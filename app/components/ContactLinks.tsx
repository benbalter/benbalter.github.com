import { getSiteConfig } from '@/lib/config';

/**
 * ContactLinks component
 * Displays contact links with icons and optional PGP key
 * Replaces {% include contact-links.html %}
 */
export default function ContactLinks() {
  const config = getSiteConfig();
  const contactLinks = config.contact_links || [];
  const pgpKey = config.pgp_key;

  return (
    <div className="text-center">
      <div className="row justify-content-center">
        {contactLinks.map((link) => (
          <div key={link.url} className="col-sm">
            <a href={link.url} rel="me noopener" target="_blank" data-proofer-ignore="true">
              <div className="row justify-content-center mb-3 align-items-center">
                <div className="col-sm-12 col-2 offset-3 offset-sm-0 text-center">
                  <i className={`${link.icon} fa-2x`} aria-hidden="true"></i>
                </div>
                <div className="col-sm-12 col-6 text-sm-center text-start">
                  {link.name}
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>

      {pgpKey && (
        <p className="small">
          <a href="/key.asc">
            PGP: <code>{pgpKey}</code>
          </a>
        </p>
      )}
    </div>
  );
}
