import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Parse the Cloudflare Pages _redirects file once for all tests
const redirectsPath = resolve(process.cwd(), 'public/_redirects');
const redirectsContent = readFileSync(redirectsPath, 'utf-8');
const redirectLines = redirectsContent
  .split('\n')
  .filter((line) => line.trim() && !line.startsWith('#'))
  .map((line) => {
    const parts = line.trim().split(/\s+/);
    return { source: parts[0], destination: parts[1], status: parts[2] };
  });

/** Assert that the _redirects file contains a 301 mapping from source to destination */
const expectRedirect = (source: string, destination: string) => {
  const match = redirectLines.find(
    (r) => r.source === source && r.destination === destination && r.status === '301',
  );
  expect(match, `Expected 301 redirect from ${source} to ${destination}`).toBeDefined();
};

test.describe('Legacy URL Redirects', () => {
  test.describe('Page Redirects', () => {
    test('should redirect /cv/ to /resume/', () => {
      expectRedirect('/cv/', '/resume/');
    });

    test('should redirect /books/ to /other-recommended-reading/', () => {
      expectRedirect('/books/', '/other-recommended-reading/');
    });

    test('should redirect /books-for-geeks/ to /other-recommended-reading/', () => {
      expectRedirect('/books-for-geeks/', '/other-recommended-reading/');
    });

    test('should redirect /recommended-reading/ to /other-recommended-reading/', () => {
      expectRedirect('/recommended-reading/', '/other-recommended-reading/');
    });
  });

  test.describe('Post URL Corrections - Typos', () => {
    test('should redirect post with typo /2014/01/27/open-collabortion/', () => {
      expectRedirect('/2014/01/27/open-collabortion/', '/2014/01/27/open-collaboration/');
    });

    test('should redirect /2014/09/29/your-code-deserves-better/', () => {
      expectRedirect('/2014/09/29/your-code-deserves-better/', '/2014/09/29/our-code-deserves-better/');
    });

    test('should redirect /2021/03/26/n-things-a-technicalp-program-manager-does/', () => {
      expectRedirect(
        '/2021/03/26/n-things-a-technicalp-program-manager-does/',
        '/2021/03/26/nine-things-a-technical-program-manager-does/',
      );
    });
  });

  test.describe('Post URL Corrections - Wrong Dates', () => {
    test('should redirect post with wrong date /2014/12/08/types-of-pull-requests/', () => {
      expectRedirect('/2014/12/08/types-of-pull-requests/', '/2015/12/08/types-of-pull-requests/');
    });

    test('should redirect /2013/02/13/what-is-a-hacker/ to correct date', () => {
      expectRedirect('/2013/02/13/what-is-a-hacker/', '/2013/02/04/what-is-a-hacker/');
    });

    test('should redirect /2013/02/16/what-is-a-hacker/ to correct date', () => {
      expectRedirect('/2013/02/16/what-is-a-hacker/', '/2013/02/04/what-is-a-hacker/');
    });

    test('should redirect /2014/11/03/rules-of-communicating-at-github/ to correct date', () => {
      expectRedirect(
        '/2014/11/03/rules-of-communicating-at-github/',
        '/2014/11/06/rules-of-communicating-at-github/',
      );
    });

    test('should redirect /2014/11/17/open-source-policy/ to correct date', () => {
      expectRedirect('/2014/11/17/open-source-policy/', '/2014/11/24/open-source-policy/');
    });

    test('should redirect /2023/12/07/cathedral-bazaar-management/ to correct date', () => {
      expectRedirect('/2023/12/07/cathedral-bazaar-management/', '/2023/12/08/cathedral-bazaar-management/');
    });
  });

  test.describe('Post URL Corrections - Special Characters', () => {
    test('should redirect source-disclosed--open-source with double dash', () => {
      expectRedirect(
        '/2014/09/29/source-disclosed--open-source/',
        '/2014/09/29/source-disclosed-is-not-the-same-as-open-source/',
      );
    });

    test('should redirect source-disclosed with not-equal symbol', () => {
      expectRedirect(
        '/2014/09/29/source-disclosed-!=-open-source/',
        '/2014/09/29/source-disclosed-is-not-the-same-as-open-source/',
      );
    });

    test('should redirect why-government-contractors-should-3-open-source', () => {
      expectRedirect(
        '/2014/10/08/why-government-contractors-should-3-open-source/',
        '/2014/10/08/why-government-contractors-should-embrace-open-source/',
      );
    });
  });

  test.describe('External Redirects', () => {
    test('should redirect github.blog post to external URL', () => {
      expectRedirect(
        '/2023/10/04/how-to-communicate-like-a-github-engineer/',
        'https://github.blog/engineering/engineering-principles/how-to-communicate-like-a-github-engineer-our-principles-practices-and-tools/',
      );
    });

    test('should redirect old GitHub blog post to external URL', () => {
      expectRedirect(
        '/2015/04/27/eight-lessons-learned-hacking-on-github-pages-for-six-months/',
        'https://github.com/blog/1992-eight-lessons-learned-hacking-on-github-pages-for-six-months',
      );
    });

    test('should redirect TechCrunch article to external URL', () => {
      expectRedirect(
        '/2012/04/23/enterprise-open-source-usage-is-up-but-challenges-remain/',
        'https://techcrunch.com/2012/04/22/enterprise-open-source-usage-is-up-but-challenges-remain/',
      );
    });
  });
});
