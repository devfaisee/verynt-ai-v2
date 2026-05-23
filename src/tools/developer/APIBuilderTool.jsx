/**
 * APIBuilderTool: Build API requests interactively
 * Construct requests with headers, params, and body
 */

import React, { useState } from 'react';
import { Copy, Download, Send } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function APIBuilderTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('api-builder');
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://api.example.com/endpoint');
  const [headers, setHeaders] = useState([{ key: 'Content-Type', value: 'application/json' }]);
  const [params, setParams] = useState([]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState(null);

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'];

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (idx) => {
    setHeaders(headers.filter((_, i) => i !== idx));
  };

  const updateHeader = (idx, key, value) => {
    const newHeaders = [...headers];
    newHeaders[idx] = { key, value };
    setHeaders(newHeaders);
  };

  const generateCurl = () => {
    let curl = `curl -X ${method} "${url}"`;

    headers.forEach((h) => {
      if (h.key && h.value) {
        curl += ` \\\n  -H "${h.key}: ${h.value}"`;
      }
    });

    if (body) {
      curl += ` \\\n  -d '${body}'`;
    }

    return curl;
  };

  const sendRequest = async () => {
    if (!tool.checkPermission('api_call', { url, method })) {
      onUpgradeRequired?.(tool.error);
      return;
    }

    tool.logUsage({ method, url });

    // Mock response
    const mockResponse = {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json',
        'content-length': '256'
      },
      body: {
        success: true,
        data: { id: 1, message: 'Request completed successfully' },
        timestamp: new Date().toISOString()
      }
    };

    setResponse(mockResponse);
    onProcess?.(mockResponse);
  };

  return (
    <div className="space-y-6">
      {/* Method & URL */}
      <div className="flex gap-2">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 font-mono w-24"
        >
          {methods.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/endpoint"
          className="flex-1 px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 font-mono text-sm"
        />
      </div>

      {/* Headers */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-300">Headers</label>
          <button
            onClick={addHeader}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            + Add
          </button>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {headers.map((h, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={h.key}
                onChange={(e) => updateHeader(idx, e.target.value, h.value)}
                placeholder="Header name"
                className="flex-1 px-3 py-1 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 text-sm"
              />
              <input
                type="text"
                value={h.value}
                onChange={(e) => updateHeader(idx, h.key, e.target.value)}
                placeholder="Value"
                className="flex-1 px-3 py-1 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 text-sm"
              />
              <button
                onClick={() => removeHeader(idx)}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      {['POST', 'PUT', 'PATCH'].includes(method) && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Request Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full h-32 px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 font-mono text-sm"
          />
        </div>
      )}

      {/* cURL Command */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">cURL Command</label>
        <div className="bg-gray-800 border border-gray-700 rounded p-3 font-mono text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
          {generateCurl()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            navigator.clipboard.writeText(generateCurl());
            alert('cURL copied!');
          }}
          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
        >
          <Copy className="w-4 h-4" />
          Copy cURL
        </button>
        <button
          onClick={sendRequest}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
        >
          <Send className="w-4 h-4" />
          Send Request
        </button>
      </div>

      {/* Response */}
      {response && (
        <div className="bg-gray-800 border border-gray-700 rounded p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded text-sm font-bold ${response.status === 200 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
              {response.status} {response.statusText}
            </span>
          </div>
          <div className="bg-gray-900 rounded p-3 text-gray-300 text-sm max-h-40 overflow-y-auto font-mono">
            {JSON.stringify(response.body, null, 2)}
          </div>
        </div>
      )}

      {/* Pro Badge */}
      {!isPro && (
        <div className="bg-amber-900 border border-amber-700 text-amber-200 px-4 py-3 rounded">
          <p className="font-medium">🔒 Pro Feature</p>
          <p className="text-sm mt-1">Request history, environment variables, and API documentation generator</p>
        </div>
      )}
    </div>
  );
}

APIBuilderTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
