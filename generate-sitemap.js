import { TOOLS_REGISTRY } from './src/tools/REGISTRY';

const BASE_URL = 'https://verynt.com';

function generateSitemap() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/tool/model-manager</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  ${TOOLS_REGISTRY.map(tool => `
  <url>
    <loc>${BASE_URL}/tool/${tool.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
</urlset>`;

  return xml.trim();
}

console.log(generateSitemap());
