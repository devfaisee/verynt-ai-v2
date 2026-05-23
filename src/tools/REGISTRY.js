/**
 * Tools Registry: Central catalog of all tools with metadata
 * Used for navigation, categorization, and tool management
 */

// Audio Tools
import WhisperTool from './audio/WhisperTool';
import VoiceForgeTool from './audio/VoiceForgeTool';
// import AudioScribeTool from './audio/AudioScribeTool';

// Document Tools
// import RedactTool from './documents/RedactTool';
// import DocuChatTool from './documents/DocuChatTool';
// import PDFMergeTool from './documents/PDFMergeTool';
// import PDFCompressTool from './documents/PDFCompressTool';
// import PDFConverterTool from './documents/PDFConverterTool';
// import PDFExtractorTool from './documents/PDFExtractorTool';

// Image Tools
// import ClearTool from './images/ClearTool';
// import ScaleTool from './images/ScaleTool';
// import ImageCompressTool from './images/ImageCompressTool';
// import HEICConverterTool from './images/HEICConverterTool';

// OCR Tools
// import OCRTool from './ocr/OCRTool';
// import ReceiptScannerTool from './ocr/ReceiptScannerTool';
// import IDScannerTool from './ocr/IDScannerTool';
// import HandwritingTool from './ocr/HandwritingTool';

// Writing Tools
// import ScribbleTool from './writing/ScribbleTool';
// import GrammarFixerTool from './writing/GrammarFixerTool';
// import ResumeTool from './writing/ResumeTool';
// import EmailComposerTool from './writing/EmailComposerTool';
// import TranslatorTool from './writing/TranslatorTool';

// Student Tools
// import FlashcardGenTool from './student/FlashcardGenTool';
// import QuizGenTool from './student/QuizGenTool';
// import MathSolverTool from './student/MathSolverTool';
// import CitationGenTool from './student/CitationGenTool';

// Developer Tools
// import JSONFormatterTool from './developer/JSONFormatterTool';
// import RegexGenTool from './developer/RegexGenTool';
// import SQLFormatterTool from './developer/SQLFormatterTool';
// import APIBuilderTool from './developer/APIBuilderTool';
// import CodeExplainerTool from './developer/CodeExplainerTool';

// Translation Tools
// import PDFTranslatorTool from './translation/PDFTranslatorTool';
// import SubtitleTranslatorTool from './translation/SubtitleTranslatorTool';
// import ScreenshotTranslatorTool from './translation/ScreenshotTranslatorTool';

import {
  FileAudio,
  FileText,
  Image,
  Scan,
  PenTool,
  BookOpen,
  Code,
  Languages,
  Zap
} from 'lucide-react';

export const TOOLS_REGISTRY = [
  // AUDIO TOOLS (3)
  {
    id: 'whisper',
    name: 'Whisper',
    description: 'Speech-to-text transcription with timestamps',
    category: 'audio',
    icon: FileAudio,
    component: WhisperTool,
    isPro: false,
    models: ['whisper-tiny', 'whisper-base'],
    tags: ['transcription', 'audio', 'offline', 'privacy']
  },
  {
    id: 'voiceforge',
    name: 'VoiceForge',
    description: 'Natural text-to-speech synthesis',
    category: 'audio',
    icon: FileAudio,
    component: VoiceForgeTool,
    isPro: false,
    models: ['speecht5-tts'],
    tags: ['text-to-speech', 'audio', 'offline']
  },
  // {
  //   id: 'audioscribe',
  //   name: 'AudioScribe',
  //   description: 'Meeting transcription & summarization',
  //   category: 'audio',
  //   icon: FileAudio,
  //   component: AudioScribeTool,
  //   isPro: false,
  //   models: ['whisper-base', 'gemma-2b'],
  //   tags: ['meeting', 'summary', 'actionitems']
  // },

  // DOCUMENT TOOLS (6)
  // {
  //   id: 'redact',
  //   name: 'Redact',
  //   description: 'PII detection & masking',
  //   category: 'documents',
  //   icon: FileText,
  //   component: RedactTool,
  //   isPro: false,
  //   models: ['bert-base-ner'],
  //   tags: ['privacy', 'pii', 'security']
  // },
  // ... more document tools

  // IMAGE TOOLS (4)
  // ...

  // OCR TOOLS (4)
  // ...

  // WRITING TOOLS (5)
  // ...

  // STUDENT TOOLS (4)
  // ...

  // DEVELOPER TOOLS (5)
  // ...

  // TRANSLATION TOOLS (3)
  // ...
];

export const TOOLS_BY_CATEGORY = {
  audio: TOOLS_REGISTRY.filter((t) => t.category === 'audio'),
  documents: TOOLS_REGISTRY.filter((t) => t.category === 'documents'),
  images: TOOLS_REGISTRY.filter((t) => t.category === 'images'),
  ocr: TOOLS_REGISTRY.filter((t) => t.category === 'ocr'),
  writing: TOOLS_REGISTRY.filter((t) => t.category === 'writing'),
  student: TOOLS_REGISTRY.filter((t) => t.category === 'student'),
  developer: TOOLS_REGISTRY.filter((t) => t.category === 'developer'),
  translation: TOOLS_REGISTRY.filter((t) => t.category === 'translation')
};

export const getToolById = (id) => TOOLS_REGISTRY.find((t) => t.id === id);
export const getToolsByCategory = (category) => TOOLS_BY_CATEGORY[category] || [];
export const getAllTools = () => TOOLS_REGISTRY;
export const getToolCount = () => TOOLS_REGISTRY.length;

export default TOOLS_REGISTRY;
