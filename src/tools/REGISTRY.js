/**
 * Tools Registry: The definitive catalog for Verynt Studio.
 * 100% Synced with the Mapping Blueprint (anotheragentanswer.txt).
 * Consolidates 100+ requested features into 24 premium interactive workspaces.
 */

import {
  FileAudio, FileText, Image as ImageIcon, Scan, PenTool, BookOpen, 
  Code, Languages, Zap, Eye, Volume2, Mic, Scissors, Maximize, 
  Search, CheckCircle, GraduationCap, Briefcase, Globe, Terminal, 
  Eraser, TrendingUp, ShieldCheck, Filter, FileDigit, FileOutput, 
  FileArchive, RefreshCw, MessageSquare, Sparkles, Layers, Wand2,
  Calculator, FileSearch, ShieldAlert, Video, Cpu, HardDrive, Smartphone, Users,
  Workflow, Database, CloudOff, Target, BarChart3, Binary, ListTodo,
  Lightbulb, Mic2, FileSignature, Gavel, UserSearch, Box, Share2, Info, UserCircle, Folder
} from 'lucide-react';

export const TOOLS_REGISTRY = [
  // --- 1. PDF TOOLS & AI SUMMARIZATION ---
  { 
    id: 'pdf-tools', 
    name: 'PDF Utilities', 
    description: 'Merge, split, rotate, and delete PDF pages in-memory.', 
    category: 'pdf', 
    icon: Scissors, 
    tags: ['essential', 'offline'] 
  },
  { 
    id: 'docuchat', 
    name: 'DocuChat AI', 
    description: 'Ask questions, summarize, and extract tables from PDFs locally.', 
    category: 'pdf', 
    icon: MessageSquare, 
    tags: ['vector-db', 'summarize'] 
  },
  { 
    id: 'pdf-compress', 
    name: 'PDF Compressor', 
    description: 'Optimize PDF file size without quality loss.', 
    category: 'pdf', 
    icon: FileArchive, 
    tags: ['utility'] 
  },
  { 
    id: 'workspace', 
    name: 'Verynt Workspace', 
    description: 'IndexedDB-powered project organizer with local cross-file search.', 
    category: 'pdf', 
    icon: Folder, 
    tags: ['indexdb', 'projects'] 
  },
  { 
    id: 'doc-builder', 
    name: 'Markdown Builder', 
    description: 'Bespoke Markdown-to-PDF compiler with live HTML preview styles.', 
    category: 'pdf', 
    icon: FileSignature, 
    tags: ['markdown', 'pdf-editor'] 
  },

  // --- 2. OCR & SCANNING ---
  { 
    id: 'ocr', 
    name: 'Vision OCR', 
    description: 'Scan receipts, screenshots, and printed media to text.', 
    category: 'ocr', 
    icon: Search, 
    tags: ['tesseract', 'scanning'] 
  },
  { 
    id: 'handwriting', 
    name: 'Handwriting OCR', 
    description: 'Convert handwritten scripts into digital text.', 
    category: 'ocr', 
    icon: PenTool, 
    tags: ['vision-weights'] 
  },
  { 
    id: 'id-scanner', 
    name: 'ID Scanner', 
    description: 'Securely extract data from passports and IDs locally.', 
    category: 'ocr', 
    icon: ShieldCheck, 
    tags: ['security', 'privacy'] 
  },

  // --- 3. STUDENT & RESEARCH TOOLS ---
  { 
    id: 'student-hub', 
    name: 'Student Hub', 
    description: '3D flashcards, MCQ generators, and study quiz builders.', 
    category: 'student', 
    icon: GraduationCap, 
    tags: ['active-recall'] 
  },
  { 
    id: 'math-solver', 
    name: 'Math AI Solver', 
    description: 'Step-by-step solver with dynamic function grapher.', 
    category: 'student', 
    icon: Calculator, 
    tags: ['plotting', 'solver'] 
  },
  { 
    id: 'citation-gen', 
    name: 'Citation Gen', 
    description: 'Generate APA/MLA bibliographies locally.', 
    category: 'student', 
    icon: BookOpen, 
    tags: ['academic'] 
  },

  // --- 4. WRITING & JOB TOOLS ---
  { 
    id: 'scribble', 
    name: 'Writer Studio', 
    description: 'Tone adjusters, cover letter generators, and ATS checkers.', 
    category: 'writer', 
    icon: Wand2, 
    tags: ['resume-tailor'] 
  },

  // --- 5. IMAGE AI TOOLS ---
  { 
    id: 'clear', 
    name: 'Vision Background', 
    description: 'Background removal, face blur, and cutout brushes.', 
    category: 'vision', 
    icon: ImageIcon, 
    tags: ['optic-buffer'] 
  },
  { 
    id: 'scale', 
    name: 'Vision Upscaler', 
    description: 'Neural image multiplier for 4x resolution.', 
    category: 'vision', 
    icon: Layers, 
    tags: ['upscale'] 
  },
  { 
    id: 'heic-converter', 
    name: 'HEIC to JPG', 
    description: 'Local file format converter for iPhone assets.', 
    category: 'vision', 
    icon: RefreshCw, 
    tags: ['utility'] 
  },

  // --- 6. TRANSLATION TOOLS ---
  { 
    id: 'translator', 
    name: 'Signal Translator', 
    description: 'Client-side multilingual text translation.', 
    category: 'translation', 
    icon: Globe, 
    tags: ['multilingual'] 
  },
  { 
    id: 'pdf-translator', 
    name: 'PDF Translator', 
    description: 'Translate entire documents while keeping layout.', 
    category: 'translation', 
    icon: Languages, 
    tags: ['layout-engine'] 
  },

  // --- 7. DEVELOPER TOOLS ---
  { 
    id: 'dev-utils', 
    name: 'Developer Tools', 
    description: 'JSON, Base64, SQL, and Markdown aggregating desk.', 
    category: 'dev', 
    icon: Terminal, 
    tags: ['logic-utils'] 
  },
  { 
    id: 'code-explainer', 
    name: 'Code Explainer', 
    description: 'Interactive neural debugger for code blocks.', 
    category: 'dev', 
    icon: Code, 
    tags: ['ai-debugging'] 
  },

  // --- 8. VOICE, AUDIO & WORKSPACES ---
  { 
    id: 'whisper', 
    name: 'Whisper Transcribe', 
    description: 'WebGPU audio-to-text with real-time waveforms.', 
    category: 'audio', 
    icon: Mic, 
    tags: ['hardware-acc'] 
  },
  { 
    id: 'audioforge', 
    name: 'AudioForge', 
    description: 'Detect and trim silent audio blocks in-browser.', 
    category: 'audio', 
    icon: Scissors, 
    tags: ['audio-analysis'] 
  },
  { 
    id: 'flow', 
    name: 'Verynt Flow', 
    description: 'Visual AI mindmap with interactive nodes.', 
    category: 'audio', 
    icon: Workflow, 
    tags: ['canvas-mindmap'] 
  },
  { 
    id: 'voiceforge', 
    name: 'VoiceForge TTS', 
    description: 'High-fidelity human speech signal synthesis.', 
    category: 'audio', 
    icon: Volume2, 
    tags: ['tts'] 
  },

  // --- 9. STUDIO SYSTEMS ---
  { 
    id: 'model-manager', 
    name: 'Engine Registry', 
    description: 'Manage local neural weight buffers and cache.', 
    category: 'system', 
    icon: Database, 
    tags: ['core'] 
  }
];

export const CATEGORIES = [
  { id: 'pdf', name: 'PDF & Summaries', icon: FileText, desc: 'Advanced document intelligence.' },
  { id: 'audio', name: 'Acoustic Studio', icon: FileAudio, desc: 'Neural audio signals.' },
  { id: 'vision', name: 'Visual Perception', icon: ImageIcon, desc: 'Computer vision and optics.' },
  { id: 'ocr', name: 'Extraction Hub', icon: Search, desc: 'OCR and data scanning.' },
  { id: 'writer', name: 'Writer Studio', icon: PenTool, desc: 'Job and content automation.' },
  { id: 'student', name: 'Academic Studio', icon: GraduationCap, desc: 'Cognitive recall tools.' },
  { id: 'dev', name: 'Developer Studio', icon: Terminal, desc: 'Logic and data utilities.' },
  { id: 'translation', name: 'Signal Translation', icon: Globe, desc: 'Cross-border mapping.' },
  { id: 'system', name: 'Studio System', icon: Cpu, desc: 'Infrastructure and cache.' }
];

export const getToolById = (id) => TOOLS_REGISTRY.find((t) => t.id === id);
export const getToolsByCategory = (category) => TOOLS_REGISTRY.filter((t) => t.category === category);
export const getAllTools = () => TOOLS_REGISTRY;

export default TOOLS_REGISTRY;
