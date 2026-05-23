/**
 * IDScannerTool: Extract info from ID cards
 * Supports drivers license, passport, national ID
 */

import React, { useState, useRef } from 'react';
import { Upload, Download, Copy, Loader, Eye, EyeOff } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function IDScannerTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('id-scanner');
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFile(files[0]);
  };

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setFile(selectedFile);
    await scanID(selectedFile);
  };

  const scanID = async (imageFile) => {
    if (!tool.checkPermission('ocr', { size: imageFile.size })) {
      onUpgradeRequired?.(tool.error);
      return;
    }

    setIsProcessing(true);
    try {
      tool.logUsage({ fileSize: imageFile.size, type: 'id_card' });

      const model = await tool.loadModel('tesseract');
      if (!model) return;

      // Mock extracted data with privacy notice
      const mockData = {
        documentType: 'Driver License',
        issueCountry: 'United States',
        issueState: 'California',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-05-15',
        licenseNumber: '****5678',
        expiryDate: '2026-12-31',
        address: '***',
        licenseClass: 'DL',
        restrictions: 'None'
      };

      setExtractedData(mockData);
      await tool.saveResult(`id-scan-${Date.now()}`, mockData);
      onProcess?.(mockData);
    } catch (err) {
      console.error('Scanning error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const maskSensitive = (text, sensitive = false) => {
    if (!sensitive && !showSensitiveData) {
      return text.replace(/./g, '*');
    }
    return text;
  };

  return (
    <div className="space-y-6">
      {/* Privacy Notice */}
      <div className="bg-red-900 border border-red-700 rounded p-4">
        <p className="text-red-200 text-sm">
          <strong>Privacy Notice:</strong> This tool processes sensitive personal information. 
          Data is processed locally and not stored on servers. For compliance, enable encryption or use enterprise plan.
        </p>
      </div>

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
        <p className="text-gray-300 font-medium mb-2">Scan ID card image</p>
        <p className="text-gray-500 text-sm mb-4">Driver License, Passport, National ID</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
        >
          Choose File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
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
            <span className="text-gray-300">Scanning ID...</span>
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
          {/* Show/Hide Sensitive Data Toggle */}
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-300">Extracted Information</label>
            <button
              onClick={() => setShowSensitiveData(!showSensitiveData)}
              className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
            >
              {showSensitiveData ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Hide Sensitive
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Show All
                </>
              )}
            </button>
          </div>

          {/* Document Type */}
          <div className="bg-gray-800 border border-gray-700 rounded p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Document Type</p>
                <p className="text-gray-200 font-medium">{extractedData.documentType}</p>
              </div>
              <div>
                <p className="text-gray-400">Issued By</p>
                <p className="text-gray-200 font-medium">
                  {extractedData.issueState}, {extractedData.issueCountry}
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-gray-800 border border-gray-700 rounded p-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">First Name</p>
                <p className="text-gray-200 font-medium">{extractedData.firstName}</p>
              </div>
              <div>
                <p className="text-gray-400">Last Name</p>
                <p className="text-gray-200 font-medium">{extractedData.lastName}</p>
              </div>
              <div>
                <p className="text-gray-400">Date of Birth</p>
                <p className="text-gray-200 font-medium">{maskSensitive(extractedData.dateOfBirth, true)}</p>
              </div>
              <div>
                <p className="text-gray-400">Address</p>
                <p className="text-gray-200 font-medium">{maskSensitive(extractedData.address, true)}</p>
              </div>
            </div>
          </div>

          {/* Document Details */}
          <div className="bg-gray-800 border border-gray-700 rounded p-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Document Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">License Number</p>
                <p className="text-gray-200 font-medium font-mono">{maskSensitive(extractedData.licenseNumber, true)}</p>
              </div>
              <div>
                <p className="text-gray-400">Expiry Date</p>
                <p className="text-gray-200 font-medium">{extractedData.expiryDate}</p>
              </div>
              <div>
                <p className="text-gray-400">License Class</p>
                <p className="text-gray-200 font-medium">{extractedData.licenseClass}</p>
              </div>
              <div>
                <p className="text-gray-400">Restrictions</p>
                <p className="text-gray-200 font-medium">{extractedData.restrictions}</p>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
                alert('Copied to clipboard!');
              }}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
            >
              <Copy className="w-4 h-4" />
              Copy Data
            </button>
            <button
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
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
          <p className="text-sm mt-1">Data encryption, compliance reports, and batch scanning</p>
        </div>
      )}
    </div>
  );
}

IDScannerTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
