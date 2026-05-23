# Verynt Tool Integration Guide for Agents

This guide explains how to build tools for Verynt without colliding with other agents' work.

## 🚀 Quick Start for Tool Development

### 1. Your Tool Folder
Each agent owns a specific folder under `src/tools/`:
- **AGENT-A**: `src/tools/audio/` (Whisper, VoiceForge, AudioScribe)
- **AGENT-B**: `src/tools/documents/` (Redact, DocuChat, PDFs)
- **AGENT-C**: `src/tools/images/` (Clear, Scale, Compression)
- **AGENT-D**: `src/tools/ocr/` (OCR, Scanning)
- **AGENT-E**: `src/tools/writing/` (Scribble, Grammar, Email)
- **AGENT-F**: `src/tools/student/` (Flashcards, Quiz, Math)
- **AGENT-G**: `src/tools/developer/` (JSON, Regex, Code)
- **AGENT-H**: `src/tools/translation/` (Translator, Subtitle)

**ONLY modify files in your assigned folder.**

### 2. Tool Component Structure

Every tool MUST follow this pattern:

```jsx
// src/tools/[category]/[ToolName].jsx
import { useVernytTool } from '../../hooks/useVernytTool';

export default function MyTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('my-tool-name');
  
  // Your implementation here...
  
  return (
    <div className="tool-container">
      {/* Your UI */}
    </div>
  );
}
```

### 3. Standard Props (Required)

Every tool component MUST accept these props:

```typescript
interface ToolProps {
  isPro: boolean                      // Is user a Pro subscriber?
  onProcess?: (result: any) => void   // Called when processing completes
  onUsage?: (count: number) => void   // Called to track usage
  onUpgradeRequired?: (error: any) => void  // Called when upgrade needed
}
```

### 4. Using the Tool Hook

The `useVernytTool` hook provides all standard operations:

```jsx
const tool = useVernytTool('tool-name');

// Available methods:
tool.checkPermission(action, metadata)    // Check if action is allowed
tool.loadModel(modelId)                   // Load an AI model
tool.saveResult(projectName, data)        // Save to local storage
tool.logUsage(metadata)                   // Log usage
tool.getPro()                             // Check if Pro
tool.getLimits()                          // Get tier limits
tool.requestUpgrade(reason)               // Get upgrade message

// Available state:
tool.isLoading                            // Is model loading?
tool.error                                // Current error (if any)
tool.progress                             // Loading progress 0-100
```

### 5. Billing Gate Example

```jsx
const handleProcess = async () => {
  // Check if action is allowed (respects freemium limits)
  if (!tool.checkPermission('transcribe', { duration: audioLength })) {
    // tool.error has the reason
    onUpgradeRequired?.(tool.error);
    return;
  }
  
  // Log usage
  tool.logUsage({ audioLength, format: 'mp3' });
  
  // Process...
};
```

### 6. Model Loading Example

```jsx
const processFile = async (file) => {
  // Load model (reused if already cached)
  const model = await tool.loadModel('whisper-tiny');
  if (!model) return; // Error already set in tool.error
  
  // Use model...
  
  // Save results
  const result = await tool.saveResult('transcription-' + Date.now(), {
    text: transcribedText,
    format: 'srt'
  });
};
```

## 📋 Model Registry

Available models (from `modelManager.js`):

### Audio
- `whisper-tiny` (75MB) - Fast transcription
- `whisper-base` (150MB) - Balanced transcription
- `speecht5-tts` (220MB) - Text-to-speech

### Documents
- `bert-base-ner` (340MB) - PII detection
- `minilm-l6-v2` (80MB) - Document embeddings

### Images
- `bria-rmbg-1.4` (280MB) - Background removal
- `esrgan-light` (190MB) - Image upscaling

### Text
- `qwen-0.5b` (350MB) - Text generation
- `gemma-2b` (420MB) - Summarization & chat

### Translation
- `multilingual-t5` (580MB) - Multilingual translation

**To use a model:**
```jsx
const model = await tool.loadModel('model-id');
```

## 💾 Storage Operations

Save and retrieve data with the storage manager:

```jsx
// Save a project
const project = await tool.storageManager.saveProject({
  name: 'My Project',
  description: 'Project description',
  files: [file1, file2],
  metadata: { custom: 'data' }
});

// Get chat history
const chats = await tool.storageManager.getChatHistory(projectId);

// Save chat message
await tool.storageManager.saveChatMessage(projectId, {
  role: 'user',
  content: 'Hello'
});

// Get all projects
const projects = await tool.storageManager.getProjects();

// Log usage for analytics
await tool.storageManager.logUsage('transcription', {
  duration: 300,
  language: 'en'
});
```

## 📊 Billing System

### Free Tier Limits
- Max 5-minute audio files
- Max 1024x1024 image resolution
- Max 10MB file size
- Max 3 files per day
- No batch processing
- Watermarked outputs
- Limited export formats

### Pro Tier ($12/month)
- Unlimited audio length
- 4096x4096 image resolution
- 100MB file size
- Unlimited daily files
- Batch processing (10 items)
- No watermarks
- All export formats
- Premium AI models

### Check Limits
```jsx
const limits = tool.getLimits();
// Returns either FREE_TIER_LIMITS or PRO_TIER_BENEFITS

if (!tool.getPro()) {
  // Disable premium features
}
```

## 🎯 Event Tracking

Log events for the impact dashboard:

```jsx
// Log tool usage
tool.analyticsManager.logToolUsage('my-tool', { 
  inputSize: 5000,
  format: 'pdf'
});

// Log transcription
const savings = tool.analyticsManager.logTranscription(
  duration,
  wordCount,
  processingTime
);

// Get impact stats
const stats = tool.analyticsManager.getImpactDashboard();
// { timeSaved: {...}, moneySaved: {...}, ... }
```

## 🚫 What NOT To Do

**NEVER do these:**
1. ❌ Modify files outside your folder
2. ❌ Import and use other tools' components directly
3. ❌ Create new models (use existing registry only)
4. ❌ Bypass billing checks
5. ❌ Modify shared services without coordination
6. ❌ Use external APIs (stay client-side)
7. ❌ Store data outside IndexedDB/localStorage

**ALWAYS do these:**
1. ✅ Use `useVernytTool` hook
2. ✅ Follow the tool component interface
3. ✅ Check permissions with `checkPermission()`
4. ✅ Log usage and events
5. ✅ Handle errors gracefully
6. ✅ Test offline functionality
7. ✅ Use Tailwind classes from theme

## 🎨 UI/UX Consistency

All tools should follow this pattern:

```jsx
<div className="space-y-4">
  {/* Input Section */}
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      Input
    </label>
    <textarea className="w-full h-40 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600" />
  </div>

  {/* Action Button */}
  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium">
    Process
  </button>

  {/* Loading Indicator */}
  {tool.isLoading && (
    <div className="bg-gray-700 rounded p-3">
      <div className="w-full bg-gray-600 rounded h-2">
        <div style={{width: `${tool.progress}%`}} className="bg-blue-500 h-2" />
      </div>
    </div>
  )}

  {/* Error Display */}
  {tool.error && (
    <div className="bg-red-900 border border-red-700 text-red-200 px-3 py-2 rounded">
      {tool.error.message}
    </div>
  )}

  {/* Output Section */}
  {output && (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Output
      </label>
      <div className="w-full h-40 px-3 py-2 bg-gray-700 text-gray-200 rounded">
        {output}
      </div>
    </div>
  )}

  {/* Pro Badge */}
  {!isPro && (
    <div className="bg-amber-900 border border-amber-700 text-amber-200 px-3 py-2 rounded text-sm">
      🔒 Pro feature: [description]
    </div>
  )}
</div>
```

## 📝 File Export Functions

Provide multiple export formats:

```jsx
// Text file
const downloadTxt = (content) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `output-${Date.now()}.txt`;
  a.click();
};

// JSON
const downloadJson = (data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  // ... similar download logic
};

// PDF (requires pdf-lib)
const downloadPdf = async (content) => {
  const { PDFDocument, rgb } = PDFLib;
  const pdfDoc = await PDFDocument.create();
  // ... add content
};
```

## ✅ Pre-Launch Checklist

Before submitting your tool:

- [ ] Tool works 100% offline
- [ ] All models cached after first download
- [ ] Respects free tier limits
- [ ] Shows Pro upsell appropriately
- [ ] Logs usage correctly
- [ ] Exports in multiple formats
- [ ] Mobile responsive
- [ ] Handles errors gracefully
- [ ] No console errors
- [ ] Documentation complete

## 🆘 Getting Help

If you need to:
- **Add new model**: Post in the coordination thread
- **Add shared utility**: Coordinate first
- **Access another tool's data**: Use storageManager
- **Ask questions**: Post your question in thread

## 📦 File Organization Example

```
src/tools/audio/
├── WhisperTool.jsx          # Main transcription tool
├── VoiceForgeTool.jsx       # Text-to-speech tool
├── AudioScribeTool.jsx      # Meeting summarizer
├── hooks/
│   ├── useWhisper.js        # Whisper-specific logic
│   └── useAudioRecorder.js  # Audio recording utility
├── utils/
│   ├── audioProcessor.js    # Audio processing helpers
│   └── timestamps.js        # SRT/VTT formatting
├── components/
│   ├── AudioUpload.jsx      # Reusable upload component
│   └── TranscriptViewer.jsx # Reusable transcript display
└── README.md                # Documentation
```

---

**Remember: You own your folder. Other agents own theirs. Coordinate on shared services only.**
