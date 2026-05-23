import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WhisperTool from '../tools/whisper/WhisperTool';
import RedactTool from '../tools/redact/RedactTool';
import DocuChatTool from '../tools/docuchat/DocuChatTool';
import ClearTool from '../tools/clear/ClearTool';
import DevTools from '../tools/developer/DevTools';
import StudentTools from '../tools/student/StudentTools';
import OCRTool from '../tools/ocr/OCRTool';
import PDFTools from '../tools/documents/PDFTools';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';

const toolMeta = {
  whisper: { title: 'Whisper Transcription', description: 'Transcribe audio and video files locally with high accuracy using Verynt Whisper.' },
  pdf: { title: 'DocuChat', description: 'Chat with your PDF documents and extract summaries entirely offline.' },
  'pdf-tools': { title: 'PDF Power Tools', description: 'Merge and split PDF files in-browser with total privacy.' },
  ocr: { title: 'OCR Scanner', description: 'Extract text from images and screenshots locally using Verynt OCR.' },
  redact: { title: 'Redaction Tool', description: 'Securely mask sensitive PII data in your documents before sharing.' },
  clear: { title: 'Background Remover', description: 'Remove and replace image backgrounds locally with AI.' },
  student: { title: 'Student Hub', description: 'Generate flashcards and summaries for your study materials.' },
  developer: { title: 'Dev Utilities', description: 'Essential developer tools for JSON, Base64, and Regex.' },
};

export default function ToolContainer() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const { incrementUsage, triggerLoader } = useApp();

  const [summaryText, setSummaryText] = React.useState('');

  const meta = toolMeta[toolId] || { title: 'AI Tool', description: 'Private, local AI tool by Verynt.' };

  const renderTool = () => {
    switch (toolId) {
      case 'whisper':
        return (
          <WhisperTool 
            incrementUsage={incrementUsage} 
            triggerLoader={triggerLoader}
            setSummaryText={setSummaryText}
            selectTab={(tab) => navigate(`/tool/${tab}`)}
          />
        );
      case 'pdf':
        return (
          <DocuChatTool 
            incrementUsage={incrementUsage} 
            triggerLoader={triggerLoader}
            summaryText={summaryText}
            setSummaryText={setSummaryText}
          />
        );
      case 'pdf-tools':
        return <PDFTools />;
      case 'ocr':
        return <OCRTool />;
      case 'redact':
        return <RedactTool incrementUsage={incrementUsage} />;
      case 'clear':
        return <ClearTool incrementUsage={incrementUsage} triggerLoader={triggerLoader} />;
      case 'developer':
        return <DevTools incrementUsage={incrementUsage} />;
      case 'student':
        return <StudentTools incrementUsage={incrementUsage} />;
      default:
        return <div className="text-white">Tool not found</div>;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl relative overflow-hidden space-y-6">
      <SEO title={meta.title} description={meta.description} />
      
      {/* Action Return Header */}
      <button 
        onClick={() => navigate('/')}
        className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
      >
        ← Back to Hub Dashboard
      </button>

      {/* Active Workspace Component Routing */}
      {renderTool()}
    </div>
  );
}
