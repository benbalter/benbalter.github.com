/**
 * Create (or update) this site's site.standard.publication record.
 *
 * One-time setup: run once, then paste the printed AT-URI into
 * siteConfig.standardSite.publicationUri. The publication lexicon uses a TID
 * record key (not a fixed "self"), so this looks up any existing publication
 * record and updates it in place; otherwise it creates a new one and lets the
 * PDS assign the key. Re-running is therefore idempotent.
 *
 * Usage:
 *   ATPROTO_APP_PASSWORD=xxxx npx tsx script/standard-site/create-publication.ts [--dry-run]
 *
 * Reference: https://standard.site/
 */

import { login } from './auth';
import { siteConfig } from '../../src/config';

const COLLECTION = 'site.standard.publication';

async function main(): Promise<void> {
  const dryRun = process.argv.slice(2).includes('--dry-run');

  const record = {
    $type: COLLECTION,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
  };

  if (dryRun) {
    console.log(`📄 ${COLLECTION} (dry run — nothing written):`);
    console.log(JSON.stringify(record, null, 2));
    return;
  }

  const { agent, did } = await login();

  // Reuse an existing publication record if one is already present.
  const existing = await agent.com.atproto.repo.listRecords({
    repo: did,
    collection: COLLECTION,
    limit: 1,
  });
  const existingUri = existing.data.records[0]?.uri;

  let uri: string;
  if (existingUri) {
    const rkey = existingUri.split('/').pop()!;
    const res = await agent.com.atproto.repo.putRecord({
      repo: did,
      collection: COLLECTION,
      rkey,
      record,
    });
    uri = res.data.uri;
    console.log('✅ Existing publication record updated.');
  } else {
    // Omit rkey so the PDS assigns a valid TID for this tid-keyed collection.
    const res = await agent.com.atproto.repo.createRecord({
      repo: did,
      collection: COLLECTION,
      record,
    });
    uri = res.data.uri;
    console.log('✅ Publication record created.');
  }

  console.log('');
  console.log('AT-URI (paste into siteConfig.standardSite.publicationUri):');
  console.log(`  ${uri}`);
}

main().catch((err) => {
  console.error('❌ Failed to create publication record:', err);
  process.exit(1);
});
