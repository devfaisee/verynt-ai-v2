/**
 * EmailComposerTool: Email template generator
 * Context-aware email composition
 */

import React, { useState } from 'react';
import { Loader, Copy, Download, Send } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function EmailComposerTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('email-composer');
  const [purpose, setPurpose] = useState('follow-up');
  const [context, setContext] = useState('');
  const [composedEmail, setComposedEmail] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const purposes = [
    { id: 'follow-up', label: 'Follow-up', icon: '📧' },
    { id: 'inquiry', label: 'Inquiry', icon: '❓' },
    { id: 'proposal', label: 'Proposal', icon: '💼' },
    { id: 'apology', label: 'Apology', icon: '🤝' },
    { id: 'thank-you', label: 'Thank You', icon: '🙏' },
    ...(isPro ? [{ id: 'negotiation', label: 'Negotiation', icon: '⚖️' }] : [])
  ];

  const handleCompose = async () => {
    if (!context.trim()) return;

    const selectedPurpose = purposes.find((p) => p.id === purpose);
    if (selectedPurpose && !selectedPurpose.pro && !isPro) {
      // Allow non-pro emails
    }

    if (!tool.checkPermission('compose_email', { length: context.length })) {
      onUpgradeRequired?.(tool.error);
      return;
    }

    setIsProcessing(true);
    try {
      tool.logUsage({ length: context.length, purpose });

      const model = await tool.loadModel('email-composer');
      if (!model) return;

      // Mock composed email based on purpose
      const emailTemplates = {
        'follow-up': `Hi [Recipient],

I hope this email finds you well. I wanted to follow up on our previous conversation regarding ${context.substring(0, 30)}...

Could you please provide an update on the status? I'm eager to move forward.

Best regards,
[Your Name]`,
        inquiry: `Hi [Recipient],

I hope you're doing well. I'm reaching out to inquire about ${context.substring(0, 30)}...

Could you provide more information about this?

Thank you for your time.

Best regards,
[Your Name]`,
        proposal: `Hi [Recipient],

I'd like to propose a solution for ${context.substring(0, 30)}...

I believe this approach will bring significant value. I'd love to discuss further.

Looking forward to hearing from you.

Best regards,
[Your Name]`
      };

      const composed = emailTemplates[purpose] || emailTemplates['follow-up'];
      setComposedEmail(composed);
      await tool.saveResult(`email-${Date.now()}`, {
        purpose,
        context,
        email: composed
      });

      onProcess?.(composed);
    } catch (err) {
      console.error('Compose error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Purpose Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Email Purpose</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {purposes.map((p) => (
            <button
              key={p.id}
              onClick={() => setPurpose(p.id)}
              disabled={p.pro && !isPro}
              className={`px-3 py-2 rounded font-medium transition flex items-center gap-2 justify-center text-sm ${
                purpose === p.id
                  ? 'bg-blue-600 text-white'
                  : p.pro && !isPro
                    ? 'bg-gray-700 text-gray-500 opacity-50 cursor-not-allowed'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Context Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Context ({context.length} chars)
        </label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Describe the situation or key details..."
          className="w-full h-32 px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500"
        />
        <p className="text-gray-400 text-xs mt-2">
          Example: "Discussing project deadline extension for Q1 project"
        </p>
      </div>

      {/* Processing */}
      {isProcessing && (
        <div className="bg-gray-800 rounded p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-gray-300">Composing email...</span>
          </div>
          <div className="w-full bg-gray-700 rounded h-2">
            <div
              className="bg-blue-500 h-2 rounded transition-all"
              style={{ width: `${tool.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Composed Email */}
      {composedEmail && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Composed Email</label>
          <div className="bg-gray-800 border border-gray-700 rounded p-4">
            <p className="text-gray-200 whitespace-pre-wrap text-sm font-mono">{composedEmail}</p>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            Edit placeholders like [Recipient], [Your Name], etc.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleCompose}
          disabled={isProcessing || !context.trim()}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded font-medium transition"
        >
          Compose Email
        </button>
        {composedEmail && (
          <>
            <button
              onClick={() => {
                navigator.clipboard.writeText(composedEmail);
                alert('Copied to clipboard!');
              }}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <button
              onClick={() => {
                const blob = new Blob([composedEmail], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `email-${purpose}.txt`;
                a.click();
              }}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </>
        )}
      </div>

      {/* Pro Badge */}
      {!isPro && (
        <div className="bg-amber-900 border border-amber-700 text-amber-200 px-4 py-3 rounded">
          <p className="font-medium">🔒 Pro Feature</p>
          <p className="text-sm mt-1">Negotiation templates and advanced customization</p>
        </div>
      )}
    </div>
  );
}

EmailComposerTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
