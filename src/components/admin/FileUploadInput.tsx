'use client';

import React, { useRef, useState } from 'react';
import { Upload, FileText, Image as ImageIcon, X, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';

interface FileUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  placeholder?: string;
  description?: string;
  fileType?: 'pdf' | 'image' | 'any';
  id?: string;
}

export function FileUploadInput({
  label,
  value,
  onChange,
  accept = 'image/*,.pdf',
  placeholder = 'Select a file from your disk or enter URL',
  description,
  fileType = 'any',
  id,
}: FileUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showManualUrl, setShowManualUrl] = useState(false);

  const isPdf = fileType === 'pdf' || (value && (value.endsWith('.pdf') || value.includes('application/pdf')));
  const isImage = fileType === 'image' || (value && (value.match(/\.(jpg|jpeg|png|gif|webp|svg)/i) || value.startsWith('data:image/')));

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    setErrorMsg(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        setErrorMsg(data.error || 'Failed to upload file.');
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      setErrorMsg('Error uploading file: ' + (err.message || 'Network error'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-xs font-mono text-zinc-400 dark:text-zinc-500 font-medium">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="text-[10px] font-mono text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 underline cursor-pointer"
        >
          {showManualUrl ? 'Switch to File Browser' : 'Paste Custom URL'}
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        id={id ? `${id}-file-input` : undefined}
      />

      {showManualUrl ? (
        /* Manual URL Input Fallback */
        <div className="flex items-center space-x-2">
          <input
            type="text"
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 text-xs"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-zinc-400 hover:text-red-500 rounded-lg"
              title="Clear input"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        /* File Upload Box */
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className={`relative border-2 border-dashed rounded-xl p-4 transition-all duration-200 cursor-pointer text-center group ${
            dragActive
              ? 'border-emerald-500 bg-emerald-500/10'
              : value
              ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/10 hover:border-emerald-500'
              : 'border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 hover:border-emerald-500/60 dark:hover:border-emerald-500/60'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-3 space-y-2">
              <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
              <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                Uploading to Disk...
              </p>
            </div>
          ) : value ? (
            /* Selected File State */
            <div className="flex items-center justify-between space-x-3 text-left">
              <div className="flex items-center space-x-3 overflow-hidden">
                {isImage ? (
                  <div className="h-12 w-12 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-900">
                    <img src={value} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                ) : isPdf ? (
                  <div className="h-12 w-12 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center shrink-0 font-mono text-xs font-bold">
                    <FileText className="h-6 w-6" />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 font-mono text-xs font-bold">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {value.startsWith('data:') ? 'Base64 Uploaded File' : value.split('/').pop()}
                  </p>
                  <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 mt-0.5">
                    <CheckCircle2 className="h-3 w-3 inline" />
                    <span>File attached &amp; ready</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {!value.startsWith('data:') && (
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 text-zinc-500 hover:text-emerald-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                    title="View file"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBrowseClick();
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                  title="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Empty Upload Prompt */
            <div className="flex flex-col items-center justify-center py-2 space-y-1.5">
              <div className="p-2.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                {fileType === 'pdf' ? (
                  <FileText className="h-5 w-5" />
                ) : fileType === 'image' ? (
                  <ImageIcon className="h-5 w-5" />
                ) : (
                  <Upload className="h-5 w-5" />
                )}
              </div>
              <div className="text-center">
                <p className="text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  Click to select {fileType === 'pdf' ? 'Resume PDF' : fileType === 'image' ? 'Image' : 'File'} from disk
                </p>
                <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mt-0.5">
                  {description || `Click or drag and drop your ${fileType === 'pdf' ? '.pdf file' : 'file'} here`}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <p className="text-[11px] font-mono text-red-500 mt-1">{errorMsg}</p>
      )}
    </div>
  );
}
