'use client';

import React from 'react';
import { ChevronRight, BookOpen, FileText } from 'lucide-react';

interface WikiBreadcrumbProps {
  pageTitle?: string;
  parentTitle?: string;
}

export function WikiBreadcrumb({ pageTitle, parentTitle }: WikiBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-xs text-gray-400 py-1">
      <div className="flex items-center space-x-1.5 font-medium text-gray-300">
        <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
        <span>Wiki</span>
      </div>

      {parentTitle && (
        <>
          <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
          <span className="truncate max-w-[150px] font-medium text-gray-400">{parentTitle}</span>
        </>
      )}

      {pageTitle && (
        <>
          <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
          <div className="flex items-center space-x-1 font-semibold text-white">
            <FileText className="h-3.5 w-3.5 text-indigo-400" />
            <span className="truncate max-w-[200px]">{pageTitle}</span>
          </div>
        </>
      )}
    </nav>
  );
}
