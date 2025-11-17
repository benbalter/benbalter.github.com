/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://ben.balter.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  changefreq: 'monthly',
  priority: 0.7,
  sitemapSize: 5000,
  
  // Exclude paths that shouldn't be in sitemap
  exclude: [
    '/404',
    '/404/',
    '/_not-found',
    '/_not-found/',
  ],
  
  // Custom robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
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
