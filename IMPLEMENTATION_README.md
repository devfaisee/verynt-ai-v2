# 🚀 Verynt — Private, Local-First AI SaaS Platform

> **"Your files never leave your device."**

Complete architecture for a browser-based AI platform with zero server costs, hybrid monetization, and professional implementation.

## 📌 Project Status

**Phase 1: Core Infrastructure** ✅ Complete
- [x] Project structure initialized
- [x] Service layer built (ModelManager, StorageManager, BillingManager, AnalyticsManager)
- [x] Standard tool hook (useVernytTool) created
- [x] Global state management (Zustand)
- [x] Tool template and agent guide created
- [x] All folders structured for parallel development

**Phase 2-6**: Pending (Ready for parallel agent implementation)

## 🏗️ Architecture

### Core Services

All services are singleton instances in `src/services/`:

#### 1. **ModelManager** (`modelManager.js`)
- Centralized AI model management
- Download + cache models from HuggingFace
- Prevent duplicate downloads
- ~15 models registered (audio, vision, NLP, translation)
- Use: `tool.loadModel('model-id')`

#### 2. **StorageManager** (`storageManager.js`)
- IndexedDB abstraction for local persistence
- Project management (save/load)
- Chat history tracking
- Transcript storage
- Usage analytics logging
- Backup/import functionality
- Use: `tool.storageManager.saveProject(...)`

#### 3. **BillingManager** (`billingManager.js`)
- Free tier vs Pro tier enforcement
- Usage limit tracking (daily, per-file, resolution)
- Upgrade modal triggers
- Stripe integration hooks
- Trial subscription support
- Use: `tool.checkPermission(action, metadata)`

#### 4. **AnalyticsManager** (`analyticsManager.js`)
- Local telemetry (no external tracking)
- Time saved calculations
- Cost savings vs cloud APIs
- Usage patterns & trends
- Export for dashboards
- Use: `tool.analyticsManager.logToolUsage(...)`

### Global State (Zustand)

Store at `src/store/appStore.js`:
- Subscription status
- Current project
- Projects list
- Usage count
- Impact statistics
- UI states (sidebar, modals)

### Standard Tool Hook

`src/hooks/useVernytTool.js`:
- Provides all tools consistent interface
- Handles permissions, model loading, storage
- Uniform error handling
- Progress tracking
- Logging

## 🎯 Tool Categories (8 Agents)

Each agent owns a folder under `src/tools/`:

| Agent | Folder | Tools | Status |
|-------|--------|-------|--------|
| **A** | `audio/` | Whisper, VoiceForge, AudioScribe | Pending |
| **B** | `documents/` | Redact, DocuChat, PDF Tools | Pending |
| **C** | `images/` | Clear, Scale, Compression | Pending |
| **D** | `ocr/` | OCR, Receipt Scanner, ID Scanner | Pending |
| **E** | `writing/` | Scribble, Grammar, Email, Translator | Pending |
| **F** | `student/` | Flashcards, Quiz, Math, Citation | Pending |
| **G** | `developer/` | JSON, Regex, SQL, API, Code | Pending |
| **H** | `translation/` | PDF, Subtitle, Screenshot Translator | Pending |

**IMPORTANT**: Each agent ONLY modifies files in their assigned folder.

## 💡 Key Features

### 🔒 Privacy-First
- ✅ 100% offline operation
- ✅ WebGPU hardware acceleration
- ✅ Models cached locally (IndexedDB)
- ✅ No external API calls
- ✅ No telemetry to 3rd parties

### 💰 Zero-Server Cost
- ✅ Static deployment (Cloudflare Pages / Vercel)
- ✅ Browser handles all computation
- ✅ No GPU cluster costs
- ✅ Scales to millions without infrastructure

### 🎁 Freemium Model
**Free Tier:**
- 5-minute audio files
- 1024x1024 image resolution
- 10MB max file size
- 3 files/day
- Watermarked outputs

**Pro Tier ($12/month):**
- Unlimited audio length
- 4096x4096 image resolution
- 100MB file size
- Unlimited daily files
- Batch processing (10 items)
- No watermarks
- All export formats
- Premium models

### 📊 Impact Dashboard
- Time saved (vs typing manually)
- Money saved (vs cloud APIs)
- Weekly/daily statistics
- Usage trends

## 📂 Project Structure

```
verynt/
├── src/
│   ├── components/          # Shared UI components
│   ├── services/            # Singleton services
│   │   ├── modelManager.js
│   │   ├── storageManager.js
│   │   ├── billingManager.js
│   │   └── analyticsManager.js
│   ├── hooks/               # React hooks
│   │   └── useVernytTool.js
│   ├── store/               # Global state
│   │   └── appStore.js
│   ├── tools/               # Tool implementations (8 agents)
│   │   ├── audio/
│   │   ├── documents/
│   │   ├── images/
│   │   ├── ocr/
│   │   ├── writing/
│   │   ├── student/
│   │   ├── developer/
│   │   ├── translation/
│   │   └── TOOL_TEMPLATE.jsx
│   ├── utils/               # Utilities
│   ├── styles/              # Global styles
│   ├── App.jsx
│   └── main.jsx
├── public/                  # Static assets
├── package.json
├── vite.config.js
├── tailwind.config.js
├── AGENT_INTEGRATION_GUIDE.md    # For agents
└── README.md                # This file
```

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

All key dependencies already added:
- `@xenova/transformers` — AI models
- `tesseract.js` — OCR
- `pdf-lib` — PDF manipulation
- `zustand` — State management
- `react` — UI
- `tailwindcss` — Styling

### 2. Run Development Server
```bash
npm run dev
```

Server runs on `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

Output: `dist/` folder (ready for Cloudflare Pages / Vercel)

## 📋 For Agents: Getting Started

1. **Read** `AGENT_INTEGRATION_GUIDE.md` (comprehensive setup guide)
2. **Copy** `TOOL_TEMPLATE.jsx` as reference
3. **Implement** your tools in your assigned folder
4. **Use** `useVernytTool` hook for all standard operations
5. **Test** that tools work offline
6. **Don't touch** other agents' folders or shared services

## 🔌 AI Models Available

### Registered Models (15 total)

Audio:
- `whisper-tiny` (75MB)
- `whisper-base` (150MB)
- `speecht5-tts` (220MB)

Documents:
- `bert-base-ner` (340MB)
- `minilm-l6-v2` (80MB)

Images:
- `bria-rmbg-1.4` (280MB)
- `esrgan-light` (190MB)

Text:
- `qwen-0.5b` (350MB)
- `gemma-2b` (420MB)

Translation:
- `multilingual-t5` (580MB)

**To load a model:**
```jsx
const model = await tool.loadModel('model-id');
```

## 💾 Data Storage

All user data stored locally in browser:

- **IndexedDB**: Large files (projects, transcripts, chat history)
- **LocalStorage**: Preferences, subscription status, usage counts
- **Cache API**: AI models (if enabled)
- **SessionStorage**: Current session data

**Export/Import**: Users can export entire workspace as encrypted `.verynt` file.

## 📈 Analytics & Impact

Real-time tracking of user impact:

```js
// Estimated time saved
impactStats.timeSaved.hours  // e.g., 42 hours
impactStats.timeSaved.days   // e.g., 5 days

// Estimated cost savings vs cloud APIs
impactStats.moneySaved.usd   // e.g., "$125.43"
```

## 🎨 UI/UX Design

**Theme**: Dark-mode-first with glassmorphic components
- Background: Deep slate (#08090d)
- Primary: Cyan/Purple gradient
- Secondary: Glassmorphic cards with blur effect
- Accent: Lucide React icons

**Responsive**: Mobile-first design (PWA-ready)

## 🚀 Deployment

### Option 1: Cloudflare Pages (Recommended)
```bash
npm run build
# Connect git repo to Cloudflare Pages
```

### Option 2: Vercel
```bash
npm run build
# Deploy dist/ to Vercel
```

### Option 3: GitHub Pages
```bash
npm run build
# Push dist/ to gh-pages branch
```

**Cost**: $0/month ✅

## 📊 Monetization Strategy

### Revenue Streams

1. **Subscription** ($12/month, $96/year)
   - Unlimited usage
   - Premium models
   - Batch processing
   - No watermarks

2. **Stripe Integration**
   - Checkout
   - Customer portal
   - Subscription management

3. **Target**: $1,000/month revenue (highly achievable)
   - 83 customers @ $12/month
   - Very high margins (0 server cost)
   - Expected LTV: 18+ months

## 🔍 SEO Strategy

- Programmatic landing pages (long-tail keywords)
- Schema markup (Product, FAQ, Organization)
- Dynamic sitemap generation
- Submit to 100+ AI directories
- Social media threads (Product Hunt, Reddit, Twitter/X)

## ✅ Implementation Checklist

- [x] Phase 1: Core infrastructure
- [ ] Phase 2: Tool development (8 agents)
- [ ] Phase 3: Features & UX
- [ ] Phase 4: Billing & auth
- [ ] Phase 5: SEO & growth
- [ ] Phase 6: Polish & launch

**Timeline**: 30 days to launch (realistic with parallel agents)

## 🆘 Support

### For Agents
- Read: `AGENT_INTEGRATION_GUIDE.md`
- Reference: `TOOL_TEMPLATE.jsx`
- Coordination: This document + SQL tracking

### For Questions
- Check guide first
- Ask in coordination thread if coordination-related
- Use your tool folder for implementation-specific issues

## 📝 License

Proprietary — Verynt.com

---

**Built with ❤️ for privacy-first AI**
