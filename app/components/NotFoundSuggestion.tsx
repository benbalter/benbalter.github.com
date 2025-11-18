'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { closest } from 'fastest-levenshtein';

async function fetchAllSitemapUrls(baseUrl: string): Promise<string[]> {
  const urls: string[] = [];
  
  try {
    // Fetch the main sitemap (which might be an index)
    const response = await fetch(`${baseUrl}/sitemap.xml`);
    if (!response.ok) {
      return urls;
    }
    
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    
    // Check if it's a sitemap index
    const sitemapLocs = xml.querySelectorAll('sitemapindex > sitemap > loc');
    
    if (sitemapLocs.length > 0) {
      // It's a sitemap index, fetch each individual sitemap
      const sitemapUrls = Array.from(sitemapLocs)
        .map((el) => el.textContent)
        .filter((url): url is string => url !== null)
        // Convert absolute URLs to use the current host for local development
        .map((url) => {
          const urlObj = new URL(url);
          return `${baseUrl}${urlObj.pathname}`;
        });
      
      // Fetch all individual sitemaps in parallel
      const sitemapPromises = sitemapUrls.map(async (sitemapUrl) => {
        try {
          const sitemapResponse = await fetch(sitemapUrl);
          if (sitemapResponse.ok) {
            const sitemapText = await sitemapResponse.text();
            const sitemapXml = parser.parseFromString(sitemapText, 'text/xml');
            return Array.from(sitemapXml.querySelectorAll('urlset > url > loc'))
              .map((el) => el.textContent)
              .filter((url): url is string => url !== null);
          }
        } catch (error) {
          console.error(`Error fetching sitemap ${sitemapUrl}:`, error);
        }
        return [];
      });
      
      const sitemapResults = await Promise.all(sitemapPromises);
      urls.push(...sitemapResults.flat());
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
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const urls = await fetchAllSitemapUrls(baseUrl);
      
      if (urls.length > 0) {
        // Find the closest matching URL using Levenshtein distance
        const closestUrl = closest(window.location.href, urls);
        const url = new URL(closestUrl);
        setSuggestion(url.pathname);
      } else {
        setSuggestion('/');
      }
      
      setLoading(false);
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
