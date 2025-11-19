import { getContactLinks, getPgpKey } from '@/lib/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

// Add icons to library
library.add(fas, fab);

/**
 * ContactLinks displays a grid of social/contact links with icons
 * This is a server component that reads contact_links from _config.yml
 */
export default function ContactLinks() {
  const contactLinks = getContactLinks();
  const pgpKey = getPgpKey();

  return (
    <div className="text-center">
      <div className="row justify-content-center">
        {contactLinks.map((link) => (
          <div key={link.name} className="col-sm">
            <a 
              href={link.url} 
              rel="me noopener" 
              target="_blank"
              data-proofer-ignore="true"
            >
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
