'use client';

import React, { useState } from 'react';
import { Zap, Plus, Loader2, Info } from 'lucide-react';
import { AutomationBuilder } from './automation-builder';
import { RuleList } from './rule-list';
import {
  useWorkspaceAutomationRules,
  useCreateAutomationRule,
  useToggleAutomationRule,
  useDeleteAutomationRule,
} from '../hooks/use-automation';
import type { CreateRulePayload } from '../types';

interface AutomationHomeProps {
  workspaceId: string;
}

export function AutomationHome({ workspaceId }: AutomationHomeProps) {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const { data: rules = [], isLoading } = useWorkspaceAutomationRules(workspaceId);
  const createMutation = useCreateAutomationRule(workspaceId);
  const toggleMutation = useToggleAutomationRule(workspaceId);
  const deleteMutation = useDeleteAutomationRule(workspaceId);

  const handleSaveRule = (payload: CreateRulePayload) => {
    createMutation.mutate(payload);
    setIsBuilderOpen(false);
  };

  const activeCount   = rules.filter(r => r.isEnabled).length;
  const totalRuns     = rules.reduce((acc, r) => acc + r.executionCount, 0);

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white font-sans">
      {/* Page Header */}
      <div className="border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-indigo-500/30">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Automation</h1>
              <p className="text-xs text-gray-400">No-code workflow rules for this workspace</p>
            </div>
          </div>
          <button
            onClick={() => setIsBuilderOpen(true)}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:from-violet-500 hover:to-indigo-500 transition"
          >
            <Plus className="h-4 w-4" />
            <span>New Rule</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8 space-y-8">

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Rules',     value: rules.length },
            { label: 'Active Rules',    value: activeCount  },
            { label: 'Total Executions', value: totalRuns   },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center"
            >
              <p className="text-2xl font-extrabold text-white">{stat.value}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="flex items-start space-x-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3">
          <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-xs text-indigo-300 leading-relaxed">
            Automation rules trigger automatically when specific workspace events occur. 
            Each rule applies to the current workspace and all its projects unless scoped to a specific project.
          </p>
        </div>

        {/* Rules List */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
            Workspace Rules ({rules.length})
          </h2>

          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : (
            <RuleList
              rules={rules}
              onToggle={(id) => toggleMutation.mutate(id)}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          )}
        </div>
      </div>

      {/* Builder Modal */}
      <AutomationBuilder
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onSave={handleSaveRule}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
