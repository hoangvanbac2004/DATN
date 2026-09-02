'use client';

import React, { useState } from 'react';
import { X, GitCommit, Link as LinkIcon } from 'lucide-react';
import type { TimelineTaskDto, CreateDependencyPayload } from '../types';

interface AddDependencyDialogProps {
  tasks: TimelineTaskDto[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDependencyPayload) => void;
  isLoading?: boolean;
}

export function AddDependencyDialog({
  tasks,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: AddDependencyDialogProps) {
  const [predecessorId, setPredecessorId] = useState('');
  const [successorId, setSuccessorId] = useState('');
  const [dependencyType, setDependencyType] = useState('FINISH_TO_START');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!predecessorId || !successorId || predecessorId === successorId) return;

    onSubmit({
      predecessorId,
      successorId,
      dependencyType,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <GitCommit className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white font-heading">Add Task Dependency</h3>
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
            <label className="block text-xs font-semibold text-gray-300">Predecessor Task (Blocking)</label>
            <select
              value={predecessorId}
              onChange={(e) => setPredecessorId(e.target.value)}
              required
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="" disabled className="bg-[#111827]">Select Predecessor Task...</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#111827]">
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300">Successor Task (Blocked)</label>
            <select
              value={successorId}
              onChange={(e) => setSuccessorId(e.target.value)}
              required
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="" disabled className="bg-[#111827]">Select Successor Task...</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#111827]">
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300">Dependency Relation Type</label>
            <select
              value={dependencyType}
              onChange={(e) => setDependencyType(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="FINISH_TO_START" className="bg-[#111827]">Finish-to-Start (FS)</option>
              <option value="START_TO_START" className="bg-[#111827]">Start-to-Start (SS)</option>
              <option value="FINISH_TO_FINISH" className="bg-[#111827]">Finish-to-Finish (FF)</option>
              <option value="START_TO_FINISH" className="bg-[#111827]">Start-to-Finish (SF)</option>
            </select>
          </div>

          <div className="mt-6 flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !predecessorId || !successorId || predecessorId === successorId}
              className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-indigo-500 disabled:opacity-50"
            >
              <LinkIcon className="h-4 w-4" />
              <span>Link Dependency</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
