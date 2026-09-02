'use client';

import React from 'react';
import { X, Download } from 'lucide-react';
import type { AttachmentDto } from '../types';

interface AttachmentPreviewModalProps {
  attachment: AttachmentDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AttachmentPreviewModal({ attachment, isOpen, onClose }: AttachmentPreviewModalProps) {
  if (!isOpen || !attachment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative max-w-4xl max-h-[90vh] space-y-3">
        <div className="flex items-center justify-between text-white border-b border-white/10 pb-2">
          <span className="text-xs font-bold truncate max-w-md">{attachment.fileName}</span>
          <div className="flex items-center space-x-2">
            <a
              href={attachment.fileUrl}
              download={attachment.fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-1.5 bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition"
              title="Download file"
            >
              <Download className="h-4 w-4" />
            </a>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gray-950">
          <img
            src={attachment.fileUrl}
            alt={attachment.fileName}
            className="max-h-[75vh] w-auto max-w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
