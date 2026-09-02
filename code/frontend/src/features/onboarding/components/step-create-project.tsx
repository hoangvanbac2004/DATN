'use client';

import React, { useState } from 'react';
import { FolderPlus, Loader2, ArrowRight } from 'lucide-react';
import { useCreateProject } from '@/features/project/hooks/use-project';

interface StepCreateProjectProps {
  workspaceId: string;
  workspaceName: string;
  onNext: (projectName: string) => void;
}

const COLOR_OPTIONS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

export function StepCreateProject({ workspaceId, workspaceName, onNext }: StepCreateProjectProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [error, setError] = useState('');

  const createProjectMutation = useCreateProject(workspaceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    setError('');

    createProjectMutation.mutate(
      {
        name: name.trim(),
        description: description.trim(),
        color,
      },
      {
        onSuccess: (created) => {
          onNext(created.name);
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || 'Failed to create project');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
          <FolderPlus className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Create First Project</h2>
        <p className="text-xs text-gray-400">
          Inside <span className="font-semibold text-indigo-400">{workspaceName}</span>
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-xs text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-300">Project Name *</label>
          <input
            type="text"
            placeholder="e.g. Website Redesign, Mobile App"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-gray-900/60 py-2.5 px-3.5 text-xs text-white placeholder-gray-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            autoFocus
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-300">Description (Optional)</label>
          <textarea
            placeholder="What are the main goals of this project?"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-gray-900/60 py-2.5 px-3.5 text-xs text-white placeholder-gray-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-300">Accent Color</label>
          <div className="flex items-center space-x-2">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-7 w-7 rounded-full transition transform ${
                  color === c ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-gray-900' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={createProjectMutation.isPending}
        className="flex w-full items-center justify-center space-x-2 rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 disabled:opacity-50 active:scale-[0.98]"
      >
        {createProjectMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <span>Complete Setup</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
