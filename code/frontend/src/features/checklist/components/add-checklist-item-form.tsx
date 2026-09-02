'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddChecklistItemFormProps {
  onAdd: (title: string) => void;
  isLoading?: boolean;
}

export function AddChecklistItemForm({ onAdd, isLoading }: AddChecklistItemFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (trimmed) {
      onAdd(trimmed);
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add an item..."
        disabled={isLoading}
        className="flex-1 rounded-lg border border-white/10 bg-gray-900/60 px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!title.trim() || isLoading}
        className="flex items-center space-x-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-40 transition"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>Add</span>
      </button>
    </form>
  );
}
