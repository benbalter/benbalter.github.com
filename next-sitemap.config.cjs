/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://ben.balter.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  changefreq: 'monthly',
  priority: 0.7,
  sitemapSize: 5000,
  outDir: './out',
  
  // Exclude paths that shouldn't be in sitemap
  exclude: [
    '/404',
    '/404/',
    '/404.html',
    '/_not-found',
    '/_not-found/',
    '/2021-analysis-of-federal-dotgov-domains',
    '/2021-analysis-of-federal-dotgov-domains/',
    '/behind-github-geojson',
    '/behind-github-geojson/',
    '/collaborative-policymaking',
    '/collaborative-policymaking/',
    '/digital-government-strategy',
    '/digital-government-strategy/',
    '/digital-strategy-reporting',
    '/digital-strategy-reporting/',
    '/dont-build-an-api',
    '/dont-build-an-api/',
    '/fine-print',
    '/fine-print/',
    '/government-glossary',
    '/government-glossary/',
    '/make-government-better-together',
    '/make-government-better-together/',
    '/make-maps-better-together',
    '/make-maps-better-together/',
    '/make-reporting-better-together',
    '/make-reporting-better-together/',
    '/open-source-alternatives',
    '/open-source-alternatives/',
    '/open-source-demistified',
    '/open-source-demistified/',
    '/open-source-software-licensing',
    '/open-source-software-licensing/',
    '/open-sourcing-government',
    '/open-sourcing-government/',
    '/simple-api',
    '/simple-api/',
    '/tag*',
    '/tags*',
    '/the-dynamic-site-is-dead',
    '/the-dynamic-site-is-dead/',
    '/the-next-cultural-commons',
    '/the-next-cultural-commons/',
    '/uncle-sams-list',
    '/uncle-sams-list/',
  ],
  
  // Custom robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/2021-analysis-of-federal-dotgov-domains/',
          '/404.html',
          '/behind-github-geojson/',
          '/collaborative-policymaking/',
          '/digital-government-strategy/',
          '/digital-strategy-reporting/',
          '/dont-build-an-api/',
          '/fine-print/',
          '/government-glossary/',
          '/make-government-better-together/',
          '/make-maps-better-together/',
          '/make-reporting-better-together/',
          '/open-source-alternatives/',
          '/open-source-demistified/',
          '/open-source-software-licensing/',
          '/open-sourcing-government/',
          '/simple-api/',
          '/tag*',
          '/tags*',
          '/the-dynamic-site-is-dead/',
          '/the-next-cultural-commons/',
          '/uncle-sams-list/',
        ],
      },
    ],
    additionalSitemaps: [
      'https://ben.balter.com/tweets/sitemap.xml',
    ],
  },
  
  // Custom transformation for URLs
  transform: async (config, path) => {
    // Default priority for different types of pages
    let priority = config.priority;
    let changefreq = config.changefreq;
    
    // Homepage gets highest priority
    if (path === '/') {
      priority = 1.0;
      changefreq = 'weekly';
    }
    // Blog posts get high priority
    else if (path.match(/\/\d{4}\/\d{2}\/\d{2}\//)) {
      priority = 0.8;
      changefreq = 'monthly';
    }
    // Other pages get medium priority
    else {
      priority = 0.6;
      changefreq = 'monthly';
    }
    
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
