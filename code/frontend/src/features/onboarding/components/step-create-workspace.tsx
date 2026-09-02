'use client';

import React, { useState } from 'react';
import { Layers, Loader2, ArrowRight } from 'lucide-react';
import { useCreateWorkspace } from '@/features/workspace/hooks/use-workspace';

interface StepCreateWorkspaceProps {
  onNext: (workspaceId: string, workspaceName: string) => void;
}

export function StepCreateWorkspace({ onNext }: StepCreateWorkspaceProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const createWorkspaceMutation = useCreateWorkspace();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Workspace name is required');
      return;
    }
    setError('');

    createWorkspaceMutation.mutate(
      { name: name.trim(), description: description.trim() },
      {
        onSuccess: (created) => {
          onNext(created.id, created.name);
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || 'Failed to create workspace');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
          <Layers className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Create Workspace</h2>
        <p className="text-xs text-gray-400">Workspaces hold your projects, teams, and tasks.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-xs text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-300">Workspace Name *</label>
          <input
            type="text"
            placeholder="e.g. Acme Corp, My Startup"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-gray-900/60 py-2.5 px-3.5 text-xs text-white placeholder-gray-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            autoFocus
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-300">Description (Optional)</label>
          <textarea
            placeholder="What is this workspace for?"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-gray-900/60 py-2.5 px-3.5 text-xs text-white placeholder-gray-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={createWorkspaceMutation.isPending}
        className="flex w-full items-center justify-center space-x-2 rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 disabled:opacity-50 active:scale-[0.98]"
      >
        {createWorkspaceMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <span>Continue to Project</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
