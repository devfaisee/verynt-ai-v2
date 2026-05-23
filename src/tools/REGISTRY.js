/**
 * Tools Registry: Central catalog of all tools with metadata
 * Perfectly synced with the Verynt Master Blueprint and AI Document Toolbox features.
 */

import {
  FileAudio,
  FileText,
  Image as ImageIcon,
  Scan,
  PenTool,
  BookOpen,
  Code,
  Languages,
  Zap,
  Eye,
  Volume2,
  Mic,
  Scissors,
  Maximize,
  Search,
  CheckCircle,
  GraduationCap,
  Briefcase,
  Globe,
  Terminal,
  Eraser,
  TrendingUp,
  ShieldCheck,
  Filter
} from 'lucide-react';

export const TOOLS_REGISTRY = [
  // --- CATEGORY A: AUDIO & SPEECH ---
  {
    id: 'whisper',
    name: 'Verynt Whisper',
    description: 'High-accuracy speech-to-text transcription with local timestamps.',
    category: 'audio',
    icon: FileAudio,
    isPro: false,
    models: ['whisper-tiny', 'whisper-base'],
    tags: ['transcription', 'audio', 'offline']
  },
  {
    id: 'voiceforge',
    name: 'Verynt VoiceForge',
    description: 'Natural text-to-speech synthesis with custom pitch and rate controls.',
    category: 'audio',
    icon: Volume2,
    isPro: false,
    models: ['speecht5-tts'],
    tags: ['tts', 'audio', 'reader']
  },
  {
    id: 'audioscribe',
    name: 'Verynt AudioScribe',
    description: 'Meeting transcription & summarization into Jira/Notion templates.',
    category: 'audio',
    icon: Mic,
    isPro: false,
    models: ['whisper-base', 'gemma-2b'],
    tags: ['meeting', 'summary', 'productivity']
  },

  // --- CATEGORY B: TEXT & DOCUMENTS ---
  {
    id: 'redact',
    name: 'Verynt Redact',
    description: 'Smart offline PII masker for emails, names, and credit cards.',
    category: 'documents',
    icon: Eye,
    isPro: false,
    models: ['bert-base-ner'],
    tags: ['privacy', 'security', 'pii']
  },
  {
    id: 'docuchat',
    name: 'Verynt DocuChat',
    description: 'Interactive PDF chat and semantic search using local vector DB.',
    category: 'documents',
    icon: FileText,
    isPro: false,
    models: ['minilm-l6-v2', 'llama-3-8b'],
    tags: ['pdf', 'chat', 'search']
  },
  {
    id: 'scribble',
    name: 'Verynt Scribble',
    description: 'AI writer and rephraser with tone and length adjustments.',
    category: 'documents',
    icon: PenTool,
    isPro: false,
    models: ['lamini-flan-t5'],
    tags: ['writing', 'rephrase', 'editor']
  },
  {
    id: 'pdf-tools',
    name: 'PDF Power Tools',
    description: 'Merge, split, compress, and rotate PDFs entirely in-browser.',
    category: 'documents',
    icon: Scissors,
    isPro: false,
    tags: ['pdf', 'utility', 'offline']
  },

  // --- CATEGORY C: IMAGES & GRAPHICS ---
  {
    id: 'clear',
    name: 'Verynt Clear',
    description: 'AI background remover and object eraser with high-res export.',
    category: 'images',
    icon: ImageIcon,
    isPro: false,
    models: ['bria-rmbg-1.4'],
    tags: ['vision', 'edit', 'bg-removal']
  },
  {
    id: 'scale',
    name: 'Verynt Scale',
    description: 'Image super-resolution upscaler up to 4x sharpening.',
    category: 'images',
    icon: Maximize,
    isPro: false,
    models: ['esrgan-light'],
    tags: ['vision', 'upscale', 'enhance']
  },
  {
    id: 'ocr',
    name: 'Verynt OCR',
    description: 'Extract structured text from scans and receipts with 99% accuracy.',
    category: 'images',
    icon: Search,
    isPro: false,
    models: ['tesseract'],
    tags: ['ocr', 'vision', 'extraction']
  },

  // --- CATEGORY D: STUDENT & ACADEMIC ---
  {
    id: 'student-hub',
    name: 'Student Hub',
    description: 'Flashcard generators, quiz creators, and citation builders.',
    category: 'student',
    icon: GraduationCap,
    isPro: false,
    tags: ['study', 'academic', 'flashcards']
  },
  {
    id: 'math-solver',
    name: 'Math AI Solver',
    description: 'Solve equations and graph functions locally with step-by-step logic.',
    category: 'student',
    icon: TrendingUp,
    isPro: true,
    tags: ['math', 'solver', 'academic']
  },

  // --- CATEGORY E: DEVELOPER UTILITIES ---
  {
    id: 'dev-utils',
    name: 'Developer Utilities',
    description: 'JSON formatters, Regex builders, and SQL compilers.',
    category: 'developer',
    icon: Terminal,
    isPro: false,
    tags: ['dev', 'utility', 'json']
  },
  {
    id: 'code-explainer',
    name: 'Code Explainer',
    description: 'Local AI code analysis and error explanation.',
    category: 'developer',
    icon: Code,
    isPro: true,
    models: ['qwen-0.5b'],
    tags: ['dev', 'ai', 'debugging']
  },

  // --- CATEGORY F: TRANSLATION ---
  {
    id: 'translator',
    name: 'Verynt Translator',
    description: 'Multi-language offline translator for documents and text.',
    category: 'translation',
    icon: Languages,
    isPro: false,
    models: ['multilingual-t5'],
    tags: ['translation', 'multilingual', 'offline']
  }
];

export const CATEGORIES = [
  { id: 'audio', name: 'Audio & Speech', icon: FileAudio },
  { id: 'documents', name: 'Text & Documents', icon: FileText },
  { id: 'images', name: 'Images & Graphics', icon: ImageIcon },
  { id: 'student', name: 'Student Tools', icon: GraduationCap },
  { id: 'developer', name: 'Developer Tools', icon: Terminal },
  { id: 'translation', name: 'Translation', icon: Languages }
];

export const getToolById = (id) => TOOLS_REGISTRY.find((t) => t.id === id);
export const getToolsByCategory = (category) => TOOLS_REGISTRY.filter((t) => t.category === category);
export const getAllTools = () => TOOLS_REGISTRY;

export default TOOLS_REGISTRY;
