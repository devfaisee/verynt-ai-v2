/**
 * Sitemap Generator for SEO
 * Creates a sitemap.xml for search engine indexing
 */

export const PROGRAMMATIC_PAGES = [
  // Tool pages
  {
    path: '/tools/whisper',
    title: 'Whisper - Privacy-First Speech-to-Text Transcription',
    description: 'Transcribe audio files locally offline. No data sent to servers. Free speech-to-text tool.',
    keywords: ['transcription', 'speech to text', 'local transcription', 'offline transcription'],
    priority: 0.9
  },
  {
    path: '/tools/voiceforge',
    title: 'VoiceForge - Local Text-to-Speech Synthesis',
    description: 'Generate natural-sounding voices from text. 100% offline text-to-speech.',
    keywords: ['text to speech', 'tts', 'offline tts', 'voice generation'],
    priority: 0.9
  },
  {
    path: '/category/audio',
    title: 'Audio Tools - Transcription & Voice Generation | Verynt',
    description: 'Local audio processing tools: transcription, text-to-speech, meeting summaries.',
    keywords: ['audio tools', 'transcription', 'voice tools', 'offline audio'],
    priority: 0.8
  }
];

export function generateSitemap(domain = 'https://verynt.com') {
  const staticPages = [
    { path: '/', priority: 1.0, changefreq: 'weekly' },
    { path: '/pricing', priority: 0.9, changefreq: 'monthly' },
    { path: '/about', priority: 0.7, changefreq: 'monthly' }
  ];

  const allPages = [
    ...staticPages.map((p) => ({
      url: domain + p.path,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: p.changefreq,
      priority: p.priority
    })),
    ...PROGRAMMATIC_PAGES.map((p) => ({
      url: domain + p.path,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: p.priority
    }))
  ];

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  allPages.forEach((page) => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${page.url}</loc>\n`;
    sitemap += `    <lastmod>${page.lastmod}</lastmod>\n`;
    sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${page.priority}</priority>\n`;
    sitemap += '  </url>\n';
  });

  sitemap += '</urlset>';
  return sitemap;
}

export function generateSchemaMarkup(toolName, toolDescription) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: toolName,
    description: toolDescription,
    applicationCategory: 'Productivity'
  };
}

export const DEFAULT_FAQS = [
  {
    question: 'Is my data private?',
    answer: 'Yes, 100% private. All processing happens in your browser.'
  },
  {
    question: 'Do I need to sign up?',
    answer: 'No. Start using immediately.'
  }
];
