# 🎯 Verynt Project Coordination Guide

**Project**: Verynt.com — Private, Local-First AI SaaS
**Status**: Phase 1 Complete ✅ | Phase 2-6 Ready for Parallel Implementation
**Timeline**: 30 days to launch

---

## 📊 Task Tracking

All tasks tracked in SQL database (session). Current status:

### Core Infrastructure (COMPLETE ✅)
- [x] ModelManager service
- [x] StorageManager service
- [x] BillingManager service
- [x] AnalyticsManager service
- [x] useVernytTool hook
- [x] Zustand global store
- [x] Tool template
- [x] Agent integration guide
- [x] Project documentation

### Tool Development (PENDING - 8 AGENTS)
33 components split across 8 agents. Track progress below:

---

## 👥 Agent Assignments

### AGENT-A: Audio Tools (`src/tools/audio/`)
**Tools**: 3 components
- [ ] WhisperTool — Speech-to-text transcription
- [ ] VoiceForgeTool — Text-to-speech synthesis
- [ ] AudioScribeTool — Meeting summarizer

**Models**: whisper-tiny, whisper-base, speecht5-tts
**Dependencies**: None
**Folder Permission**: FULL (only modify `src/tools/audio/`)

---

### AGENT-B: Document Tools (`src/tools/documents/`)
**Tools**: 6 components
- [ ] RedactTool — PII masking
- [ ] DocuChatTool — PDF Q&A
- [ ] PDFMergeTool — Merge/split PDFs
- [ ] PDFCompresssor — Compress PDFs
- [ ] PDFConverterTool — Format conversion
- [ ] PDFExtractorTool — Extract pages

**Models**: bert-base-ner, minilm-l6-v2, gemma-2b
**Dependencies**: None
**Folder Permission**: FULL (only modify `src/tools/documents/`)

---

### AGENT-C: Image Tools (`src/tools/images/`)
**Tools**: 4 components
- [ ] ClearTool — Background removal
- [ ] ScaleTool — Image upscaling
- [ ] ImageCompressTool — Compression
- [ ] HEICConverterTool — Format conversion

**Models**: bria-rmbg-1.4, esrgan-light
**Dependencies**: None
**Folder Permission**: FULL (only modify `src/tools/images/`)

---

### AGENT-D: OCR Tools (`src/tools/ocr/`)
**Tools**: 4 components
- [ ] OCRTool — Text extraction
- [ ] ReceiptScannerTool — Receipt parsing
- [ ] IDScannerTool — ID extraction
- [ ] HandwritingTool — Handwriting recognition

**Models**: tesseract.js
**Dependencies**: None
**Folder Permission**: FULL (only modify `src/tools/ocr/`)

---

### AGENT-E: Writing Tools (`src/tools/writing/`)
**Tools**: 5 components
- [ ] ScribbleTool — Rewriter/rephraser
- [ ] GrammarFixerTool — Grammar correction
- [ ] ResumeTool — Resume improvement
- [ ] EmailComposerTool — Email generator
- [ ] TranslatorTool — Multi-language translator

**Models**: qwen-0.5b, multilingual-t5
**Dependencies**: None
**Folder Permission**: FULL (only modify `src/tools/writing/`)

---

### AGENT-F: Student Tools (`src/tools/student/`)
**Tools**: 4 components
- [ ] FlashcardGenTool — Flashcard generator
- [ ] QuizGenTool — Quiz/MCQ generator
- [ ] MathSolverTool — Equation solver
- [ ] CitationGenTool — Citation formatter

**Models**: qwen-0.5b, gemma-2b
**Dependencies**: storageManager (for saving flashcards)
**Folder Permission**: FULL (only modify `src/tools/student/`)

---

### AGENT-G: Developer Tools (`src/tools/developer/`)
**Tools**: 5 components
- [ ] JSONFormatterTool — JSON formatter/validator
- [ ] RegexGenTool — Regex generator/tester
- [ ] SQLFormatterTool — SQL formatter
- [ ] APIBuilderTool — Request builder
- [ ] CodeExplainerTool — Code explainer

**Models**: qwen-0.5b
**Dependencies**: None
**Folder Permission**: FULL (only modify `src/tools/developer/`)

---

### AGENT-H: Translation Tools (`src/tools/translation/`)
**Tools**: 3 components
- [ ] PDFTranslatorTool — Translate PDFs
- [ ] SubtitleTranslatorTool — Translate subtitles
- [ ] ScreenshotTranslatorTool — Screenshot OCR + translate

**Models**: multilingual-t5
**Dependencies**: OCR (for screenshot translation)
**Folder Permission**: FULL (only modify `src/tools/translation/`)

---

## 📋 Shared Services (Coordinate Changes)

**DO NOT modify without coordination:**

- `src/services/modelManager.js` — Model registry
- `src/services/storageManager.js` — Data persistence
- `src/services/billingManager.js` — Usage limits
- `src/services/analyticsManager.js` — Telemetry
- `src/hooks/useVernytTool.js` — Standard hook
- `src/store/appStore.js` — Global state
- `src/components/` — Shared UI components

**IF YOU NEED TO:**
- Add a model → Add to MODEL_REGISTRY in modelManager.js
- Add a new storage schema → Update OBJECT_STORES in storageManager.js
- Need new shared utility → Create in `src/utils/` and coordinate
- Need new shared component → Create in `src/components/` and coordinate

---

## 🚫 Collision Prevention Rules

### STRICT BOUNDARIES

1. **Folder Ownership**
   - Each agent owns ONE folder under `src/tools/`
   - You can ONLY modify files in your assigned folder
   - Modifying another agent's folder = COLLISION

2. **Component Isolation**
   - Each tool is independent
   - No tool can call/import another tool's components
   - Share data through services (StorageManager)

3. **Service Access**
   - All services are read/write (use carefully)
   - Log your actions (for audit trail)
   - Assume other agents will do same

4. **Naming Convention**
   - Tool components: `[ToolName]Tool.jsx`
   - Hooks: `use[ToolName].js`
   - Utils: `[toolName]Utils.js`
   - This prevents accidental overwrites

### COORDINATION CHECKLIST

Before implementing, verify:

- [ ] This tool is assigned to me (check agent assignments)
- [ ] I only modify files in my folder
- [ ] I'm using `useVernytTool` hook
- [ ] I'm not calling other tools' components
- [ ] I'm not creating new models (use registry)
- [ ] I'm not modifying shared services
- [ ] I'm handling errors gracefully

---

## 🔄 Development Workflow

### Step 1: Prepare
1. Read `AGENT_INTEGRATION_GUIDE.md`
2. Review `TOOL_TEMPLATE.jsx`
3. Identify your tools and models
4. Create your tool files

### Step 2: Implement
```jsx
// src/tools/[category]/[ToolName]Tool.jsx
import { useVernytTool } from '../../hooks/useVernytTool';

export default function MyToolTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('my-tool');
  
  // Check permission
  if (!tool.checkPermission('action')) return null;
  
  // Load model
  const model = await tool.loadModel('model-id');
  
  // Log usage
  tool.logUsage({ metadata });
  
  // Save result
  await tool.saveResult('name', data);
  
  return <div>{/* Your UI */}</div>;
}
```

### Step 3: Test
- [ ] Works 100% offline
- [ ] Models cache properly
- [ ] Respects free tier limits
- [ ] Handles errors
- [ ] Mobile responsive
- [ ] No console errors

### Step 4: Submit
1. Verify all files in your folder
2. Check no modifications outside your folder
3. Submit for integration

---

## 📅 Implementation Schedule

### Phase 2: Tool Development (Days 4-10)
- All 8 agents work in parallel
- Each agent implements 3-6 tools
- Tools should be functional but not polished
- Goal: All 33 tools minimum viable

### Phase 3: Features & UX (Days 11-15)
- Core team: Homepage, dashboard, pricing page
- Agents: Polish tools, optimize UI
- Integration: All tools register in app

### Phase 4: Billing & Auth (Days 16-18)
- Core team: Stripe integration
- Agents: Ensure billing gates work

### Phase 5: SEO & Growth (Days 19-22)
- Core team: Sitemap, schema markup, landing pages
- Agents: Help with demo videos/content

### Phase 6: Polish & Launch (Days 23-30)
- All: Performance optimization
- All: Bug fixes and edge cases
- All: Product Hunt / Reddit launch

---

## 🔗 File Location Reference

Quick lookup for what's where:

| Component | Location | Owner |
|-----------|----------|-------|
| Audio Tools | `src/tools/audio/` | AGENT-A |
| Document Tools | `src/tools/documents/` | AGENT-B |
| Image Tools | `src/tools/images/` | AGENT-C |
| OCR Tools | `src/tools/ocr/` | AGENT-D |
| Writing Tools | `src/tools/writing/` | AGENT-E |
| Student Tools | `src/tools/student/` | AGENT-F |
| Developer Tools | `src/tools/developer/` | AGENT-G |
| Translation Tools | `src/tools/translation/` | AGENT-H |
| ModelManager | `src/services/` | Core |
| StorageManager | `src/services/` | Core |
| BillingManager | `src/services/` | Core |
| AnalyticsManager | `src/services/` | Core |
| useVernytTool Hook | `src/hooks/` | Core |
| Zustand Store | `src/store/` | Core |

---

## ✅ Quality Checklist

Every tool must pass:

- [x] Uses `useVernytTool` hook
- [x] Accepts required props (isPro, onProcess, onUsage, onUpgradeRequired)
- [x] Checks permissions before processing
- [x] Logs usage and events
- [x] Saves results to storage
- [x] Handles errors gracefully
- [x] Works 100% offline
- [x] Mobile responsive
- [x] Tailwind styled (dark theme)
- [x] No external API calls
- [x] No console errors
- [x] Documented

---

## 🎯 Success Metrics

### Phase 2 (Tools Development)
- ✅ All 33 components created
- ✅ All tools functional (even if basic)
- ✅ No collisions or conflicts
- ✅ All tools use standard interface

### Phase 3 (Features)
- ✅ Homepage with landing pages
- ✅ Dashboard with stats
- ✅ Pricing page with features
- ✅ All tools integrated and discoverable

### Phase 4 (Billing)
- ✅ Stripe integration working
- ✅ Free tier limits enforced
- ✅ Upgrade modal appears at limits
- ✅ Pro subscription unlocks premium

### Phase 5 (SEO)
- ✅ Sitemap generated and submitted
- ✅ Schema markup on all pages
- ✅ Backlinks from directories
- ✅ Content for social media

### Phase 6 (Launch)
- ✅ <2s page load time
- ✅ All tools tested
- ✅ Product Hunt #1 rank
- ✅ $1k/month revenue (30 days)

---

## 📞 Communication

### Coordination Topics (Post in thread)
- Need new model added?
- Need new shared utility?
- Found a bug in shared service?
- Collision with another agent?

### Self-Contained (No coordination needed)
- Tool implementation
- Tool-specific features
- Tool performance
- Tool documentation

---

## 🚀 Ready to Start?

1. ✅ Read `AGENT_INTEGRATION_GUIDE.md`
2. ✅ Review `TOOL_TEMPLATE.jsx`
3. ✅ Check your assigned tools
4. ✅ Create your tool files
5. ✅ Start implementation

**Phase 2 begins now. Let's build Verynt! 🚀**

---

**Last Updated**: Session initiated
**Coordinator**: Core Team
**Status**: Ready for parallel agent implementation
