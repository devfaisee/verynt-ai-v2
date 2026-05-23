# Verynt.com — Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Install & Build

```bash
cd verynt
npm install
npm run build
```

### Local Development

```bash
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## 📦 Production Deployment

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Connect repo to Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy!

```bash
npm install -g vercel
vercel --prod
```

### Option 2: Cloudflare Pages

1. Connect GitHub repo
2. Build command: `npm run build`
3. Output directory: `dist`
4. Deploy with Pages or Pages Functions

### Option 3: Self-hosted (VPS)

```bash
npm run build
# Copy dist/ to your web server
# Configure nginx/apache to serve dist/index.html for SPA routing
```

**Nginx config:**
```nginx
location / {
  try_files $uri /index.html;
}
```

---

## 🎯 Monetization Setup

### Ads Integration

Verynt uses an ads-based revenue model. No subscriptions, no paywalls.

**Current implementation:**
- `src/components/AdsBanner.jsx` — Rotating contextual ads
- Shows on Dashboard and inside each tool
- Rotates every 15 seconds
- Tracks impressions via `analyticsManager`

### Next Steps for Ads Revenue

1. **Choose ad network:**
   - Google AdSense (easiest)
   - Mediavine (high CPM)
   - Custom sponsorship deals
   - Affiliate links

2. **Configure AdsBanner.jsx** to use your network:

```jsx
// Example: Google AdSense
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
```

3. **Track performance:**
   - Ad impressions are logged in `analyticsManager.recordUsage()`
   - Check browser console: `localStorage.getItem('verynt_usage')`

---

## 📊 Analytics & Usage Tracking

All analytics are **local to the user's browser** (privacy-first):

```javascript
// Check recorded usage
const usage = localStorage.getItem('verynt_usage');
console.log(JSON.parse(usage));

// Structure:
{
  "tool_id": { count: 5, lastUsed: "2024-01-15" },
  "ads_impressions": 42,
  "total_time_saved_hours": 12
}
```

No data sent to external servers by default.

---

## 🔒 Privacy & Data

✅ **What we collect:**
- Local usage statistics (stored in browser only)
- Ad impressions (for revenue tracking)
- Anonymous analytics

✅ **What we DON'T collect:**
- User files or uploads
- Personal information
- Browsing history outside Verynt

✅ **How to verify:**
- Open DevTools Network tab
- Browse the app
- Zero requests to external servers except CDN for static assets

---

## 📋 SEO & Discovery

### Sitemap
Auto-generated from `src/utils/seo.js`:
- `/sitemap.xml` — List of all tools
- Updated on build

### Meta Tags
- OG images in `public/og-*.png`
- Schema markup for products, FAQs
- Robots.txt configured

### Submissions
After launch, submit to:
- Google Search Console
- Bing Webmaster
- AI tool directories (Product Hunt, Setapp, etc.)

---

## 🧪 Testing Before Launch

```bash
# Build and preview locally
npm run build
npm run preview

# Check for errors
npm run lint

# Run tests (if available)
npm run test
```

### Manual Checklist

- [ ] All 33 tools load without errors
- [ ] Tools work offline (no network errors)
- [ ] Ads display correctly
- [ ] Usage tracking works (check localStorage)
- [ ] Mobile responsive
- [ ] Fast load time (<2s)
- [ ] No console errors

---

## 🌍 Domain Setup

### DNS Configuration for verynt.com

**Option A: Vercel**
```
A Record:        76.76.19.61
CNAME Record:    cname.vercel-dns.com
```

**Option B: Cloudflare**
1. Add domain to Cloudflare
2. Update nameservers at registrar
3. Add CNAME: `verynt.com` → `verynt.pages.dev`

### SSL Certificate
- Automatic with Vercel / Cloudflare Pages

---

## 🚨 Troubleshooting

### Build fails with "chunk too large"
This is a warning, not an error. To fix:

```javascript
// In vite.config.js
export default {
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          'ort-wasm': ['@ort-wasm/web'],
          'transformers': ['@xenova/transformers']
        }
      }
    }
  }
}
```

### Tools not loading
- Check network tab for failed requests
- Verify model URLs in `src/services/modelManager.js`
- Clear browser cache and try again

### No ads showing
- Verify AdsBanner component is imported in pages
- Check `src/components/AdsBanner.jsx`
- Ensure ad network script tags are loaded

---

## 📈 Growth Strategy

### Day 1-7: Soft Launch
- Share with friends
- Get feedback on tool functionality
- Monitor ad performance

### Week 2: Product Hunt
- Launch on Product Hunt
- Collect user feedback
- Track viral potential

### Week 3+: Marketing
- Reddit demos (`r/SideProject`, `r/webdev`, `r/tools`)
- Twitter threads showing before/after
- YouTube demos of top tools
- HN submission

---

## 📞 Support & Feedback

Add a feedback form to Dashboard:

```jsx
<button onClick={() => window.open('mailto:support@verynt.com')}>
  Send Feedback
</button>
```

---

## 🎉 Launch Checklist

- [ ] Domain registered and DNS configured
- [ ] Build passes without errors
- [ ] All tools tested on desktop + mobile
- [ ] Ads network configured
- [ ] SEO sitemap generated
- [ ] Analytics tracking active
- [ ] 404 page configured
- [ ] Email setup for support@verynt.com
- [ ] Social media profiles created
- [ ] Product Hunt listing prepared

---

**Ready to launch? Run:**
```bash
npm run build && npm run preview
```

Then deploy to Vercel/Cloudflare and point your domain!
