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
  Filter,
  FileDigit,
  FileOutput,
  FileArchive,
  RefreshCw,
  LucideLayout
} from 'lucide-react';

export const TOOLS_REGISTRY = [
  // --- ACOUSTIC STUDIO ---
  {
    id: 'whisper',
    name: 'Whisper Transcribe',
    description: 'Turn any voice recording into text with 99% accuracy.',
    category: 'audio',
    icon: Mic,
    tags: ['transcription', 'audio', 'offline']
  },
  {
    id: 'voiceforge',
    name: 'VoiceForge TTS',
    description: 'Convert text into natural human speech instantly.',
    category: 'audio',
    icon: Volume2,
    tags: ['tts', 'audio', 'reader']
  },
  {
    id: 'audioscribe',
    name: 'AudioScribe AI',
    description: 'Auto-generate Jira tickets and meeting notes from audio.',
    category: 'audio',
    icon: Sparkles,
    tags: ['meeting', 'summary', 'productivity']
  },

  // --- VISUAL STUDIO ---
  {
    id: 'clear',
    name: 'Vision Background',
    description: 'Instantly remove and swap image backgrounds locally.',
    category: 'images',
    icon: ImageIcon,
    tags: ['vision', 'edit', 'bg-removal']
  },
  {
    id: 'scale',
    name: 'Vision Upscaler',
    description: 'Multiply image resolution up to 4x with neural sharpening.',
    category: 'images',
    icon: Layers,
    tags: ['vision', 'upscale', 'enhance']
  },
  {
    id: 'ocr',
    name: 'Vision OCR',
    description: 'Scan and extract text from receipts and screenshots.',
    category: 'images',
    icon: Search,
    tags: ['ocr', 'vision', 'extraction']
  },
  {
    id: 'handwriting',
    name: 'Handwriting OCR',
    description: 'Convert handwritten notes into digital editable text.',
    category: 'images',
    icon: PenTool,
    tags: ['ocr', 'handwriting']
  },
  {
    id: 'id-scanner',
    name: 'ID Card Scanner',
    description: 'Securely extract data from passports and ID cards locally.',
    category: 'images',
    icon: ShieldCheck,
    tags: ['ocr', 'security']
  },
  {
    id: 'heic-converter',
    name: 'HEIC to JPG',
    description: 'Convert iPhone photos to standard formats in-browser.',
    category: 'images',
    icon: RefreshCw,
    tags: ['utility', 'converter']
  },

  // --- SEMANTIC STUDIO ---
  {
    id: 'docuchat',
    name: 'DocuChat AI',
    description: 'Chat with your PDF files and get executive summaries.',
    category: 'documents',
    icon: MessageSquare,
    tags: ['pdf', 'chat', 'search']
  },
  {
    id: 'redact',
    name: 'Privacy Redact',
    description: 'Mask sensitive IDs and credit cards in your documents.',
    category: 'documents',
    icon: ShieldCheck,
    tags: ['privacy', 'security', 'pii']
  },
  {
    id: 'scribble',
    name: 'Writer Studio',
    description: 'AI assistant for rephrasing, resumes, and cover letters.',
    category: 'documents',
    icon: Wand2,
    tags: ['writing', 'rephrase', 'editor']
  },
  {
    id: 'pdf-tools',
    name: 'PDF Power Tools',
    description: 'Merge and split PDF documents entirely in-browser.',
    category: 'documents',
    icon: Scissors,
    tags: ['pdf', 'utility', 'offline']
  },
  {
    id: 'pdf-compress',
    name: 'PDF Compressor',
    description: 'Reduce PDF file size locally without losing quality.',
    category: 'documents',
    icon: FileArchive,
    tags: ['pdf', 'utility']
  },
  {
    id: 'pdf-extract',
    name: 'PDF Extractor',
    description: 'Extract specific pages or images from any PDF file.',
    category: 'documents',
    icon: FileOutput,
    tags: ['pdf', 'utility']
  },

  // --- ACADEMIC STUDIO ---
  {
    id: 'student-hub',
    name: 'Student Hub',
    description: 'Create study flashcards and quizzes from your notes.',
    category: 'student',
    icon: GraduationCap,
    tags: ['study', 'academic', 'flashcards']
  },
  {
    id: 'math-solver',
    name: 'Math AI Solver',
    description: 'Solve complex equations with step-by-step logic.',
    category: 'student',
    icon: TrendingUp,
    tags: ['math', 'solver']
  },
  {
    id: 'citation-gen',
    name: 'Citation Gen',
    description: 'Generate APA/MLA citations for research papers.',
    category: 'student',
    icon: BookOpen,
    tags: ['academic', 'citation']
  },

  // --- DEVELOPER STUDIO ---
  {
    id: 'dev-utils',
    name: 'Developer Tools',
    description: 'Essential formatters for JSON, Base64, and Regex.',
    category: 'developer',
    icon: Terminal,
    tags: ['dev', 'utility', 'json']
  },
  {
    id: 'code-explainer',
    name: 'Code Explainer',
    description: 'Understand complex code blocks using local AI models.',
    category: 'developer',
    icon: Code,
    tags: ['dev', 'ai', 'debugging']
  },

  // --- TRANSLATION STUDIO ---
  {
    id: 'translator',
    name: 'Signal Translator',
    description: 'Neural multi-language translation for text and docs.',
    category: 'translation',
    icon: Languages,
    tags: ['translation', 'multilingual']
  },
  {
    id: 'pdf-translator',
    name: 'PDF Translator',
    description: 'Translate entire PDF documents while keeping layout.',
    category: 'translation',
    icon: FileDigit,
    tags: ['translation', 'pdf']
  }
];

export const CATEGORIES = [
  { id: 'audio', name: 'Acoustic Studio', icon: FileAudio },
  { id: 'images', name: 'Visual Studio', icon: ImageIcon },
  { id: 'documents', name: 'Semantic Studio', icon: FileText },
  { id: 'student', name: 'Academic Studio', icon: GraduationCap },
  { id: 'developer', name: 'Developer Studio', icon: Terminal },
  { id: 'translation', name: 'Translation Studio', icon: Languages }
];

export const getToolById = (id) => TOOLS_REGISTRY.find((t) => t.id === id);
export const getToolsByCategory = (category) => TOOLS_REGISTRY.filter((t) => t.category === category);
export const getAllTools = () => TOOLS_REGISTRY;

export default TOOLS_REGISTRY;

import { Sparkles, MessageSquare, Layers, Wand2 } from 'lucide-react';
