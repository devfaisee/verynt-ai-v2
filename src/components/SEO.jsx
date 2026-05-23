import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords }) {
  const fullTitle = `${title} | Verynt - Private Local AI`;
  const defaultDesc = "Experience high-performance, private AI tools running completely in your browser. Verynt offers Whisper transcription, OCR, PDF tools, and more with 0 server latency and total privacy.";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="keywords" content={keywords || "private AI, local AI, browser AI, whisper offline, OCR private, PDF summarizer local"} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
    </Helmet>
  );
}
