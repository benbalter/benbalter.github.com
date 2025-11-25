import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faBluesky } from '@fortawesome/free-brands-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface ContactLink {
  name: string;
  url: string;
  icon: string;
}

interface ContactLinksProps {
  contactLinks: ContactLink[];
  pgpKey?: string;
}

/**
 * Map FontAwesome icon class names to icon definitions.
 * This allows using the same icon names as Jekyll's _config.yml.
 * The mapping is intentionally limited to icons used in the site's contact_links
 * configuration. Unknown icons fall back to using the raw class name with <i> tag.
 */
function getIconFromClass(iconClass: string): IconDefinition | null {
  const iconMap: Record<string, IconDefinition> = {
    'fa-solid fa-envelope': faEnvelope,
    'fa-solid fa-address-card': faAddressCard,
    'fa-brands fa-linkedin': faLinkedin,
    'fa-brands fa-github': faGithub,
    'fa-brands fa-bluesky': faBluesky,
  };
  
  return iconMap[iconClass] || null;
}

/**
 * ContactLinks component (Server Component)
 * Displays contact information with icons, matching Jekyll's contact-links.html include
 */
export default function ContactLinks({ contactLinks, pgpKey }: ContactLinksProps) {
  return (
    <div className="text-center">
      <div className="row justify-content-center">
        {contactLinks.map((link) => {
          const icon = getIconFromClass(link.icon);
          
          return (
            <div key={link.name} className="col-sm">
              <Link
                href={link.url}
                rel="me noopener"
                target="_blank"
                data-proofer-ignore="true"
              >
                <div className="row justify-content-center mb-3 align-items-center">
                  <div className="col-sm-12 col-2 offset-3 offset-sm-0 text-center">
                    {icon ? (
                      <FontAwesomeIcon icon={icon} size="2x" aria-hidden="true" />
                    ) : (
                      <i className={`${link.icon} fa-2x`} aria-hidden="true" />
                    )}
                  </div>
                  <div className="col-sm-12 col-6 text-sm-center text-start">
                    {link.name}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {pgpKey && (
        <p className="small">
          <Link href="/key.asc">PGP: <code>{pgpKey}</code></Link>
        </p>
      )}
    </div>
  );
}
