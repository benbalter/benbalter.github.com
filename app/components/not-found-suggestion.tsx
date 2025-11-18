'use client';

import {useEffect, useState} from 'react';
import {closest} from 'fastest-levenshtein';

type NotFoundSuggestionProperties = {
  urls: string[];
};

/**
 * Client component that suggests the closest matching URL to the 404 page
 * Uses Levenshtein distance to find the most similar URL to what was requested
 */
export default function NotFoundSuggestion({urls}: NotFoundSuggestionProperties) {
  const [suggestion, setSuggestion] = useState<{href: string; pathname: string} | undefined>(undefined);

  useEffect(() => {
    if (typeof window === 'undefined' || urls.length === 0) {
      return;
    }

    try {
      // Get the current URL that resulted in a 404
      const currentPath = window.location.pathname;

      // Build full URLs from the paths
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const fullUrls = urls.map(path => `${baseUrl}${path}`);

      // Find the closest matching URL using Levenshtein distance
      const closestPath = closest(window.location.href, fullUrls);
      const url = new URL(closestPath);

      setSuggestion({
        href: url.href,
        pathname: url.pathname,
      });
    } catch (error) {
      console.error('Error finding closest URL:', error);
      // Fallback to home page
      setSuggestion({
        href: '/',
        pathname: '/',
      });
    }
  }, [urls]);

  if (!suggestion) {
    return null;
  }

  return (
    <a href={suggestion.href}>{suggestion.pathname}</a>
  );
}
