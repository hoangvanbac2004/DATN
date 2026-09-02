'use client';

import React, { useState, useEffect } from 'react';
import { X, Settings, Save } from 'lucide-react';
import type { BoardDto, UpdateBoardSettingsPayload } from '../types';

interface BoardSettingsDialogProps {
  board: BoardDto | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateBoardSettingsPayload) => void;
  isLoading?: boolean;
}

export function BoardSettingsDialog({
  board,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: BoardSettingsDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [columnWidth, setColumnWidth] = useState(280);
  const [showTaskCount, setShowTaskCount] = useState(true);

  useEffect(() => {
    if (board) {
      setName(board.name);
      setDescription(board.description || '');
      setColumnWidth(board.settings?.columnWidth || 280);
      setShowTaskCount(board.settings?.showTaskCount ?? true);
    }
  }, [board]);

  if (!isOpen || !board) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim() || board.name,
      description: description.trim(),
      settings: {
        columnWidth: Number(columnWidth) || 280,
        showTaskCount,
        allowWipLimits: board.settings?.allowWipLimits || false,
        defaultColor: board.settings?.defaultColor || '#6366f1',
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white font-heading">Cài đặt bảng công việc</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300">Tên bảng *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300">Mô tả</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả ngắn cho bảng..."
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none resize-none placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300">Độ rộng cột (px)</label>
            <input
              type="number"
              min="200"
              max="450"
              value={columnWidth}
              onChange={(e) => setColumnWidth(parseInt(e.target.value, 10) || 280)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-xs font-semibold text-gray-300">Hiện số lượng công việc trên tiêu đề cột</span>
            <input
              type="checkbox"
              checked={showTaskCount}
              onChange={(e) => setShowTaskCount(e.target.checked)}
              className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="mt-6 flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/10"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-indigo-500"
            >
              <Save className="h-4 w-4" />
              <span>Lưu cài đặt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
