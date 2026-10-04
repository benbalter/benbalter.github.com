/**
 * Newsletter sign-ups: `POST /api/subscribe` and its optional queue consumer.
 *
 * The browser posts the email address and a Cloudflare Turnstile token here
 * instead of straight to Kit, so the Kit form endpoint stays private and bots
 * have to pass Turnstile first. Flow:
 *
 *   1. Parse the body (form-encoded/multipart from a plain HTML form post, or
 *      JSON from fetch). A filled honeypot gets a fake success and nothing else.
 *   2. Verify the Turnstile token with siteverify.
 *   3. If the `SUBSCRIBE_QUEUE` binding exists, enqueue the address and return
 *      success; the `queue()` consumer calls Kit and retries 429/5xx with
 *      backoff. Without the binding, call Kit inline.
 *
 * Kit (v4 API) takes two calls: create the subscriber as `inactive`, then add
 * it to the form. Creating it `active` (Kit's default) would skip the form's
 * double opt-in, so the confirmation email would never go out.
 *
 * Privacy: email addresses and IPs are never logged or written anywhere but
 * Kit. The IP goes only to Turnstile's siteverify (`remoteip`); with the queue
 * enabled the address sits in the queue until the consumer delivers it to Kit.
 *
 * Secrets (Worker secrets, never in wrangler.json): TURNSTILE_SECRET_KEY,
 * KIT_API_KEY. Locally, put them in a gitignored `.dev.vars`.
 */

import { siteConfig } from '../src/config';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const KIT_API_URL = 'https://api.kit.com/v4';

/** Where no-JS form posts land afterwards (`:target` shows the message). */
const THANKS_PATH = '/subscribe/#subscribe-thanks';
const ERROR_PATH = '/subscribe/#subscribe-error';

/** RFC 5321 caps a forward-path at 256 octets, so an address at 254. */
const MAX_EMAIL_LENGTH = 254;
/** Turnstile tokens are at most 2048 characters. */
const MAX_TOKEN_LENGTH = 2048;
/** Deliberately loose: Kit does the real validation, this just drops junk. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @typedef {object} SubscribeEnv
 * @property {string} [TURNSTILE_SECRET_KEY]
 * @property {string} [KIT_API_KEY]
 * @property {string} [KIT_FORM_ID] Overrides siteConfig.kitFormId, e.g. to
 *   point at a form whose ID isn't published in this repo.
 * @property {{ send: (body: SubscribeMessage) => Promise<unknown> }} [SUBSCRIBE_QUEUE]
 */

/** @typedef {{ email: string }} SubscribeMessage */

/**
 * @typedef {object} QueueMessage
 * @property {SubscribeMessage} body
 * @property {number} attempts
 * @property {() => void} ack
 * @property {(options?: { delaySeconds?: number }) => void} retry
 */

/**
 * Thrown when Kit answers with a status worth retrying (429 or 5xx) or the
 * request fails outright. Carries no request data, so it's safe to log.
 */
export class RetryableKitError extends Error {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = 'RetryableKitError';
  }
}

/**
 * Pull the email, Turnstile token, and honeypot out of a form or JSON body.
 * @param {Request} request
 * @returns {Promise<{ email: string, token: string, honeypot: string } | null>}
 */
async function readBody(request) {
  const type = request.headers.get('Content-Type') ?? '';
  try {
    if (type.includes('application/json')) {
      /** @type {Record<string, unknown>} */
      const json = (await request.json()) ?? {};
      const str = (/** @type {unknown} */ value) => (typeof value === 'string' ? value : '');
      return {
        email: str(json.email),
        token: str(json['cf-turnstile-response']),
        honeypot: str(json.website),
      };
    }
    const form = await request.formData();
    const str = (/** @type {string} */ key) => {
      const value = form.get(key);
      return typeof value === 'string' ? value : '';
    };
    return {
      email: str('email'),
      token: str('cf-turnstile-response'),
      honeypot: str('website'),
    };
  } catch {
    return null;
  }
}

/**
 * Verify a Turnstile token with siteverify. Retries once on a network error,
 * reusing the idempotency key so the single-use token isn't burned twice.
 * @param {string} token
 * @param {string} secret
 * @param {string | null} ip
 * @returns {Promise<boolean>}
 */
async function verifyTurnstile(token, secret, ip) {
  const body = new URLSearchParams({
    secret,
    response: token,
    idempotency_key: crypto.randomUUID(),
  });
  if (ip) body.set('remoteip', ip);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(SITEVERIFY_URL, { method: 'POST', body });
      /** @type {{ success?: boolean }} */
      const result = await response.json();
      return result.success === true;
    } catch {
      // Network or JSON failure: try once more, then fail closed.
    }
  }
  return false;
}

/**
 * POST to Kit's v4 API. Throws RetryableKitError on 429/5xx or a network
 * failure, and a plain Error on any other non-2xx (e.g. 422 for an address
 * Kit rejects), which won't succeed on retry.
 * @param {string} path
 * @param {object} payload
 * @param {string} apiKey
 */
async function kitPost(path, payload, apiKey) {
  let response;
  try {
    response = await fetch(`${KIT_API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Kit-Api-Key': apiKey },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new RetryableKitError(`Kit ${path} request failed`);
  }
  if (response.ok) return;
  if (response.status === 429 || response.status >= 500) {
    throw new RetryableKitError(`Kit ${path} returned ${response.status}`);
  }
  throw new Error(`Kit ${path} returned ${response.status}`);
}

/**
 * Subscribe an address to the Kit form, triggering its double opt-in email.
 * @param {string} email
 * @param {SubscribeEnv} env
 */
export async function subscribeToKit(email, env) {
  // Retryable: a missing secret is a config fix away, so queued sign-ups
  // should wait for it rather than be dropped.
  if (!env.KIT_API_KEY) throw new RetryableKitError('KIT_API_KEY is not set');
  // Create (or find) the subscriber as inactive so the form's confirmation
  // email decides activation. Kit can't change an existing subscriber's state
  // here, so a confirmed reader stays confirmed.
  await kitPost('/subscribers', { email_address: email, state: 'inactive' }, env.KIT_API_KEY);
  await kitPost(
    `/forms/${env.KIT_FORM_ID || siteConfig.kitFormId}/subscribers`,
    { email_address: email },
    env.KIT_API_KEY,
  );
}

/**
 * Reply in the format the client asked for: JSON for fetch, a 303 back to
 * the subscribe page for a plain form post.
 * @param {Request} request
 * @param {boolean} ok
 * @param {number} status
 * @param {string} [error]
 */
function reply(request, ok, status, error) {
  const accept = request.headers.get('Accept') ?? '';
  if (accept.includes('application/json')) {
    return Response.json(ok ? { ok } : { ok, error }, {
      status,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
  const location = new URL(ok ? THANKS_PATH : ERROR_PATH, request.url);
  return new Response(null, {
    status: 303,
    headers: { Location: location.toString(), 'Cache-Control': 'no-store' },
  });
}

/**
 * Handle `POST /api/subscribe`.
 * @param {Request} request
 * @param {SubscribeEnv} env
 * @returns {Promise<Response>}
 */
export async function handleSubscribe(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  }

  const body = await readBody(request);
  if (!body) return reply(request, false, 400, 'bad-request');

  // Honeypot: pretend it worked so bots don't learn to skip the field.
  if (body.honeypot.trim() !== '') return reply(request, true, 200);

  const email = body.email.trim();
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return reply(request, false, 400, 'invalid-email');
  }

  if (!body.token || body.token.length > MAX_TOKEN_LENGTH) {
    return reply(request, false, 400, 'missing-token');
  }

  if (!env.TURNSTILE_SECRET_KEY) {
    // Fail closed: without the secret there's no bot check to pass.
    console.error('subscribe: TURNSTILE_SECRET_KEY is not set');
    return reply(request, false, 503, 'unavailable');
  }

  const verified = await verifyTurnstile(
    body.token,
    env.TURNSTILE_SECRET_KEY,
    request.headers.get('CF-Connecting-IP'),
  );
  if (!verified) return reply(request, false, 403, 'turnstile-failed');

  try {
    if (env.SUBSCRIBE_QUEUE) {
      await env.SUBSCRIBE_QUEUE.send({ email });
    } else {
      await subscribeToKit(email, env);
    }
  } catch (error) {
    // The message names only the Kit path and status, never the address.
    console.error('subscribe:', error instanceof Error ? error.message : 'failed');
    return reply(request, false, 502, 'upstream');
  }

  return reply(request, true, 200);
}

/**
 * Seconds to wait before redelivering a message: 30s, 60s, 120s, ... capped
 * at 15 minutes. How long an outage this rides out depends on the consumer's
 * `max_retries` (Queues defaults to 3, about 3.5 minutes; 10 is about 90).
 * @param {number} attempts Delivery attempts so far (1 on first delivery).
 */
export function retryDelay(attempts) {
  return Math.min(30 * 2 ** Math.max(attempts - 1, 0), 900);
}

/**
 * Queue consumer: deliver each queued sign-up to Kit. Retry 429/5xx and
 * network failures with backoff; drop anything else (a 422 won't get better).
 * @param {{ messages: readonly QueueMessage[] }} batch
 * @param {SubscribeEnv} env
 */
export async function consumeSubscribeQueue(batch, env) {
  for (const message of batch.messages) {
    try {
      await subscribeToKit(message.body.email, env);
      message.ack();
    } catch (error) {
      if (error instanceof RetryableKitError) {
        console.warn('subscribe queue: retrying:', error.message);
        message.retry({ delaySeconds: retryDelay(message.attempts) });
      } else {
        console.error(
          'subscribe queue: dropping message:',
          error instanceof Error ? error.message : 'failed',
        );
        message.ack();
      }
    }
  }
}
