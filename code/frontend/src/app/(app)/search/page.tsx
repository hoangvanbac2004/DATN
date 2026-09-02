'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { SearchEntityType, SearchQueryParams } from '@/features/search/types';
import { useGlobalSearch } from '@/features/search/hooks/use-search';
import { FilterPanel } from '@/features/search/components/filter-panel';
import { SearchResults } from '@/features/search/components/search-results';

export default function GlobalSearchPage() {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<SearchEntityType>('ALL');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'title'>('relevance');
  const [page, setPage] = useState(0);

  const searchParams: SearchQueryParams = {
    q: query,
    type: selectedType,
    sortBy,
    page,
    size: 20,
  };

  const { data, isLoading } = useGlobalSearch(searchParams);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
          <Search className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white font-heading">Global Search</h1>
          <p className="text-xs text-gray-400">Search across all tasks, projects, tags, and comments</p>
        </div>
      </div>

      {/* Input Box */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          placeholder="Search for tasks, projects, tags..."
          className="w-full rounded-2xl border border-white/10 bg-gray-950/60 pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition"
        />
      </div>

      {/* Filter Panel */}
      <FilterPanel
        selectedType={selectedType}
        onSelectType={(t) => {
          setSelectedType(t);
          setPage(0);
        }}
        sortBy={sortBy}
        onSelectSortBy={(s) => {
          setSortBy(s);
          setPage(0);
        }}
        counts={{
          tasks: data?.totalTasks || 0,
          projects: data?.totalProjects || 0,
          tags: data?.totalTags || 0,
          comments: data?.totalComments || 0,
        }}
      />

      {/* Results Feed */}
      <SearchResults data={data} isLoading={isLoading} onPageChange={(p) => setPage(p)} />
    </div>
  );
}
