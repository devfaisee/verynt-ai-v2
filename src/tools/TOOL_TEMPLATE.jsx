/**
 * TOOL TEMPLATE: Use this as a reference for implementing new tools
 * Copy this file to your tool folder and fill in the implementation details
 *
 * Tools MUST follow this interface to work with the main app:
 * 1. Accept props: { isPro, onProcess, onUsage, onUpgradeRequired }
 * 2. Export a component that handles its own state
 * 3. Use useVernytTool hook for standard operations
 * 4. Fire callbacks when actions complete
 */

import React, { useState } from 'react';
import { useVernytTool } from '../../hooks/useVernytTool';

/**
 * TOOL_NAME Tool Component
 *
 * @param {Object} props
 * @param {boolean} props.isPro - Is user a Pro subscriber
 * @param {Function} props.onProcess - Called when tool processes something
 * @param {Function} props.onUsage - Called to track usage
 * @param {Function} props.onUpgradeRequired - Called when upgrade needed
 * @returns {React.ReactElement}
 */
export default function ToolNameTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('tool-name');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Main process function
   */
  const handleProcess = async () => {
    // 1. Check permissions
    if (!tool.checkPermission('action_name', { size: input.length })) {
      onUpgradeRequired?.(tool.error);
      return;
    }

    setIsProcessing(true);
    try {
      // 2. Log usage
      tool.logUsage({ inputSize: input.length });

      // 3. Load model if needed
      // const model = await tool.loadModel('model-id');
      // if (!model) return;

      // 4. Process
      // const result = await processWithModel(model, input);

      // 5. Save result
      // await tool.saveResult(`output-${Date.now()}`, result);

      // 6. Update UI
      // setOutput(result);

      // 7. Call callback
      onProcess?.(output);
    } catch (err) {
      console.error('Processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your input..."
          className="w-full h-40 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500"
        />
      </div>

      {/* Process Button */}
      <button
        onClick={handleProcess}
        disabled={isProcessing || !input.trim()}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded font-medium transition"
      >
        {isProcessing ? 'Processing...' : 'Process'}
      </button>

      {/* Progress */}
      {tool.isLoading && (
        <div className="bg-gray-700 rounded p-3">
          <div className="text-sm text-gray-300 mb-2">Loading...</div>
          <div className="w-full bg-gray-600 rounded h-2">
            <div
              className="bg-blue-500 h-2 rounded transition-all"
              style={{ width: `${tool.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {tool.error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-3 py-2 rounded">
          {typeof tool.error === 'string' ? tool.error : tool.error.message}
        </div>
      )}

      {/* Output Section */}
      {output && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Output
          </label>
          <div className="w-full h-40 px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 overflow-y-auto">
            {typeof output === 'string' ? output : JSON.stringify(output, null, 2)}
          </div>

          {/* Export/Download Buttons */}
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm">
              Copy
            </button>
            {isPro && (
              <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm">
                Download
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pro-only badge */}
      {!isPro && (
        <div className="bg-amber-900 border border-amber-700 text-amber-200 px-3 py-2 rounded text-sm">
          🔒 Pro feature: Higher resolution, batch processing, and premium models
        </div>
      )}
    </div>
  );
}

/**
 * Export with prop defaults
 */
ToolNameTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
