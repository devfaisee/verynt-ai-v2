import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords, toolId }) {
  const siteName = 'Verynt Studio';
  const fullTitle = `${title} | ${siteName} - Private Local AI`;
  const domain = 'https://verynt.com';
  const canonical = toolId ? `${domain}/tool/${toolId}` : domain;
  
  const defaultDesc = "Experience world-class, private AI tools running 100% in your browser. Verynt offers Whisper transcription, PDF intelligence, and Vision optics with zero server latency and total data privacy.";

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description || defaultDesc} />
      <meta name="keywords" content={keywords || "private AI, local AI, browser AI, whisper offline, OCR private, PDF summarizer local, zero server cost AI"} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={`${domain}/og-image.png`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={`${domain}/og-image.png`} />
      
      {/* Accessibility & Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      <meta name="theme-color" content="#0c0c0d" />
    </Helmet>
  );
}
