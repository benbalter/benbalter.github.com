'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { closest } from 'fastest-levenshtein';

/**
 * Fetches and parses sitemap XML to extract all URLs
 * Similar to what Sitemapper library does, but client-side compatible
 */
async function fetchSitemapUrls(sitemapUrl: string): Promise<string[]> {
  const urls: string[] = [];
  
  try {
    const response = await fetch(sitemapUrl);
    if (!response.ok) {
      return urls;
    }
    
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    
    // Check if it's a sitemap index
    const sitemapLocs = xml.querySelectorAll('sitemapindex > sitemap > loc');
    
    if (sitemapLocs.length > 0) {
      // It's a sitemap index - fetch each individual sitemap
      const sitemapUrls = Array.from(sitemapLocs)
        .map((el) => el.textContent)
        .filter((url): url is string => url !== null);
      
      // Fetch all individual sitemaps in parallel
      const sitemapPromises = sitemapUrls.map(async (url) => {
        try {
          // Convert to use current host for local development
          const baseUrl = `${window.location.protocol}//${window.location.host}`;
          const urlObj = new URL(url);
          const localUrl = `${baseUrl}${urlObj.pathname}`;
          
          const sitemapResponse = await fetch(localUrl);
          if (sitemapResponse.ok) {
            const sitemapText = await sitemapResponse.text();
            const sitemapXml = parser.parseFromString(sitemapText, 'text/xml');
            return Array.from(sitemapXml.querySelectorAll('urlset > url > loc'))
              .map((el) => el.textContent)
              .filter((url): url is string => url !== null);
          }
        } catch (error) {
          console.error(`Error fetching sitemap ${url}:`, error);
        }
        return [];
      });
      
      const results = await Promise.all(sitemapPromises);
      urls.push(...results.flat());
    } else {
      // It's a regular sitemap with URLs
      const urlLocs = xml.querySelectorAll('urlset > url > loc');
      urls.push(
        ...Array.from(urlLocs)
          .map((el) => el.textContent)
          .filter((url): url is string => url !== null)
      );
    }
  } catch (error) {
    console.error('Error fetching sitemap:', error);
  }
  
  return urls;
}

export default function NotFoundSuggestion() {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        
        // Parse sitemap directly client-side (similar to Sitemapper library)
        const urls = await fetchSitemapUrls(`${baseUrl}/sitemap.xml`);
        
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
