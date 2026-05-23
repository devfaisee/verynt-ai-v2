/**
 * ReceiptScannerTool: Parse receipts and invoices
 * Extract line items, totals, and structured data
 */

import React, { useState, useRef } from 'react';
import { Upload, Download, Copy, Loader } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function ReceiptScannerTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('receipt-scanner');
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFile(files[0]);
  };

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/') && selectedFile.type !== 'application/pdf') {
      alert('Please select an image or PDF');
      return;
    }

    setFile(selectedFile);
    await scanReceipt(selectedFile);
  };

  const scanReceipt = async (imageFile) => {
    if (!tool.checkPermission('ocr', { size: imageFile.size })) {
      onUpgradeRequired?.(tool.error);
      return;
    }

    setIsProcessing(true);
    try {
      tool.logUsage({ fileSize: imageFile.size, type: 'receipt' });

      const model = await tool.loadModel('tesseract');
      if (!model) return;

      // Mock extracted data
      const mockData = {
        merchant: 'ABC Coffee Shop',
        date: '2024-01-15',
        time: '14:30',
        items: [
          { name: 'Espresso', quantity: 2, unitPrice: 3.50, total: 7.00 },
          { name: 'Cappuccino', quantity: 1, unitPrice: 4.50, total: 4.50 },
          { name: 'Croissant', quantity: 2, unitPrice: 2.75, total: 5.50 }
        ],
        subtotal: 17.00,
        tax: 2.55,
        total: 19.55,
        paymentMethod: 'Credit Card',
        transactionId: 'TXN-2024-001234'
      };

      setExtractedData(mockData);
      await tool.saveResult(`receipt-${Date.now()}`, mockData);
      onProcess?.(mockData);
    } catch (err) {
      console.error('Scanning error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateCSV = () => {
    if (!extractedData) return '';
    const rows = [
      ['Receipt Data'],
      ['Merchant', extractedData.merchant],
      ['Date', extractedData.date],
      ['Time', extractedData.time],
      [],
      ['Item', 'Quantity', 'Unit Price', 'Total'],
      ...extractedData.items.map((item) => [
        item.name,
        item.quantity,
        `$${item.unitPrice}`,
        `$${item.total}`
      ]),
      [],
      ['Subtotal', '', '', `$${extractedData.subtotal}`],
      ['Tax', '', '', `$${extractedData.tax}`],
      ['Total', '', '', `$${extractedData.total}`]
    ];
    return rows.map((row) => row.join(',')).join('\n');
  };

  const downloadData = () => {
    let content = '';
    let filename = '';

    if (exportFormat === 'csv') {
      content = generateCSV();
      filename = 'receipt.csv';
    } else if (exportFormat === 'json') {
      content = JSON.stringify(extractedData, null, 2);
      filename = 'receipt.json';
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
          isDragging
            ? 'border-blue-400 bg-blue-900/20'
            : 'border-gray-600 bg-gray-900/30 hover:border-gray-500'
        }`}
      >
        <Upload className="mx-auto w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-300 font-medium mb-2">Drag & drop receipt image</p>
        <p className="text-gray-500 text-sm mb-4">Supports JPG, PNG, PDF</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
        >
          Choose File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
      </div>

      {/* File Info */}
      {file && (
        <div className="bg-gray-800 border border-gray-700 rounded p-4">
          <p className="text-gray-300">
            <span className="font-medium">File:</span> {file.name}
          </p>
          <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(2)}KB</p>
        </div>
      )}

      {/* Processing */}
      {isProcessing && (
        <div className="bg-gray-800 rounded p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-gray-300">Scanning receipt...</span>
          </div>
          <div className="w-full bg-gray-700 rounded h-2">
            <div
              className="bg-blue-500 h-2 rounded transition-all"
              style={{ width: `${tool.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Extracted Data */}
      {extractedData && (
        <>
          <div className="bg-gray-800 border border-gray-700 rounded p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Merchant</p>
                <p className="text-gray-200 font-medium">{extractedData.merchant}</p>
              </div>
              <div>
                <p className="text-gray-400">Date & Time</p>
                <p className="text-gray-200 font-medium">
                  {extractedData.date} {extractedData.time}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Items</label>
            <div className="bg-gray-800 border border-gray-700 rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-900">
                    <th className="text-left px-3 py-2 text-gray-300">Item</th>
                    <th className="text-center px-2 py-2 text-gray-300 w-16">Qty</th>
                    <th className="text-right px-2 py-2 text-gray-300 w-20">Price</th>
                    <th className="text-right px-3 py-2 text-gray-300 w-20">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {extractedData.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="px-3 py-2 text-gray-200">{item.name}</td>
                      <td className="text-center px-2 py-2 text-gray-200">{item.quantity}</td>
                      <td className="text-right px-2 py-2 text-gray-200">${item.unitPrice}</td>
                      <td className="text-right px-3 py-2 text-gray-200">${item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-blue-900 border border-blue-700 rounded p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-300">Subtotal</p>
                <p className="text-blue-200 font-bold">${extractedData.subtotal.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-300">Tax</p>
                <p className="text-blue-200 font-bold">${extractedData.tax.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-700">
              <p className="text-gray-300 text-sm">Total</p>
              <p className="text-blue-100 text-2xl font-bold">${extractedData.total.toFixed(2)}</p>
            </div>
          </div>

          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Export As</label>
            <div className="flex gap-2">
              {['csv', 'json'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setExportFormat(fmt)}
                  className={`flex-1 px-3 py-2 rounded font-medium transition ${
                    exportFormat === fmt
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
                alert('Copied to clipboard!');
              }}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <button
              onClick={downloadData}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </>
      )}

      {/* Pro Badge */}
      {!isPro && (
        <div className="bg-amber-900 border border-amber-700 text-amber-200 px-4 py-3 rounded">
          <p className="font-medium">🔒 Pro Feature</p>
          <p className="text-sm mt-1">Batch scan multiple receipts and export reports</p>
        </div>
      )}
    </div>
  );
}

ReceiptScannerTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
