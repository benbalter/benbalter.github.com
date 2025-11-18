'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { closest } from 'fastest-levenshtein';

export default function NotFoundSuggestion() {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        // Fetch pre-generated sitemap URLs (generated at build time using sitemapper)
        const response = await fetch('/sitemap-urls.json');
        
        if (!response.ok) {
          setSuggestion('/');
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        const urls: string[] = data.urls || [];
        
        if (urls.length > 0) {
          // Find the closest matching URL using Levenshtein distance
          const closestUrl = closest(window.location.href, urls);
          const url = new URL(closestUrl);
          setSuggestion(url.pathname);
        } else {
          setSuggestion('/');
        }
      } catch (error) {
        console.error('Error fetching sitemap suggestion:', error);
        setSuggestion('/');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestion();
  }, []);

  if (loading) {
    return <span>loading...</span>;
  }

  if (!suggestion) {
    return <Link href="/">/</Link>;
  }

  return <Link href={suggestion}>{suggestion}</Link>;
}
