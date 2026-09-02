'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Palette, Trash2 } from 'lucide-react';
import type { BoardColumnDto, UpdateColumnPayload } from '../types';

interface EditColumnDialogProps {
  column: BoardColumnDto | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (columnId: string, data: UpdateColumnPayload) => void;
  onDelete?: (columnId: string) => void;
  isLoading?: boolean;
}

const COLOR_PRESETS = [
  '#64748b',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
];

export function EditColumnDialog({
  column,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  isLoading,
}: EditColumnDialogProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#64748b');
  const [wipLimit, setWipLimit] = useState<number>(0);

  useEffect(() => {
    if (column) {
      setName(column.name);
      setColor(column.color || '#64748b');
      setWipLimit(column.wipLimit || 0);
    }
  }, [column]);

  if (!isOpen || !column) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit(column.id, {
      name: name.trim(),
      color,
      wipLimit: Number(wipLimit) || 0,
    });
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && column) {
      if (confirm(`Bạn có chắc chắn muốn xóa cột "${column.name}"?`)) {
        onDelete(column.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-lg font-bold text-white font-heading">Chỉnh sửa cột</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300">Tên cột *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300">Màu sắc cột</label>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full border-2 transition ${
                    color === c ? 'scale-110 border-white ring-2 ring-indigo-500' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <div className="relative flex items-center">
                <Palette className="h-4 w-4 text-gray-400 ml-1 mr-1" />
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-7 w-7 cursor-pointer rounded bg-transparent border-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300">
              Giới hạn số việc (WIP) <span className="text-[10px] text-gray-400">(0 = không giới hạn)</span>
            </label>
            <input
              type="number"
              min="0"
              value={wipLimit}
              onChange={(e) => setWipLimit(parseInt(e.target.value, 10) || 0)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="mt-6 flex items-center justify-between pt-2">
            {onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center space-x-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
                <span>Xóa cột</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/10"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-indigo-500 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>Lưu thay đổi</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
