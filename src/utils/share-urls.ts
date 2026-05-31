/** Generate encoded share URLs for social platforms */
export interface ShareUrls {
  encodedTitle: string;
  encodedUrl: string;
  bluesky: string;
  twitter: string;
  linkedin: string;
  email: string;
}

export function getShareUrls(title: string, url: string): ShareUrls {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  return {
    encodedTitle,
    encodedUrl,
    bluesky: `https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
  };
}
