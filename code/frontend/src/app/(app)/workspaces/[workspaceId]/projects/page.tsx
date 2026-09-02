'use client';

import React, { use, useState } from 'react';
import { Plus, Folder, Star, Archive, Layers } from 'lucide-react';
import { useProjects } from '@/features/project/hooks/use-project';
import { ProjectCard } from '@/features/project/components/project-card';
import { CreateProjectDialog } from '@/features/project/components/create-project-dialog';

type FilterType = 'all' | 'favorites' | 'archived';

export default function WorkspaceProjectsPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.workspaceId;

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filterParams = {
    archived: activeFilter === 'archived' ? true : undefined,
    favorite: activeFilter === 'favorites' ? true : undefined,
  };

  const { data: projects = [], isLoading } = useProjects(workspaceId, filterParams);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-heading">
            Projects Directory
          </h1>
          <p className="text-xs text-gray-400">Manage all projects belonging to this workspace</p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
            activeFilter === 'all'
              ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Folder className="h-4 w-4" />
          <span>All Projects</span>
        </button>

        <button
          onClick={() => setActiveFilter('favorites')}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
            activeFilter === 'favorites'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Star className="h-4 w-4" />
          <span>Favorites</span>
        </button>

        <button
          onClick={() => setActiveFilter('archived')}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
            activeFilter === 'archived'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Archive className="h-4 w-4" />
          <span>Archived</span>
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#111827]/40 p-8 text-center backdrop-blur-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400">
            <Folder className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-white font-heading">No Projects Found</h3>
          <p className="mt-1 text-xs text-gray-400 max-w-sm">
            {activeFilter === 'all'
              ? 'Get started by creating your first project in this workspace.'
              : `No ${activeFilter} projects found.`}
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="mt-4 flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Project</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <CreateProjectDialog
        workspaceId={workspaceId}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
