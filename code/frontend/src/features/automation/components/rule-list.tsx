'use client';

import React, { useState } from 'react';
import {
  Zap, ArrowRight, Play, Pause, Trash2, ChevronDown, ChevronUp, Clock, BarChart2, AlertCircle, CheckCircle2,
} from 'lucide-react';
import type { AutomationRuleDto } from '../types';
import { useAutomationRuleLogs } from '../hooks/use-automation';

interface RuleCardProps {
  rule: AutomationRuleDto;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function RuleCard({ rule, onToggle, onDelete }: RuleCardProps) {
  const [showLogs, setShowLogs] = useState(false);
  const { data: logs = [] } = useAutomationRuleLogs(showLogs ? rule.id : '');

  const triggerLabel: Record<string, string> = {
    TASK_CREATED:        'Task Created',
    TASK_STATUS_CHANGED: 'Status Changed',
    TASK_COMPLETED:      'Task Completed',
    DUE_DATE_PASSED:     'Due Date Passed',
    MEMBER_ASSIGNED:     'Member Assigned',
  };

  const actionLabel: Record<string, string> = {
    SEND_NOTIFICATION:   'Send Notification',
    UPDATE_STATUS:       'Update Status',
    MOVE_TASK_TO_COLUMN: 'Move to Column',
    ASSIGN_USER:         'Assign User',
  };

  return (
    <div className={`rounded-2xl border transition ${
      rule.isEnabled
        ? 'border-white/10 bg-white/5 hover:border-white/20'
        : 'border-white/5 bg-white/[0.02] opacity-60'
    }`}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          {/* Toggle Switch */}
          <button
            onClick={() => onToggle(rule.id)}
            className={`relative h-5 w-9 shrink-0 rounded-full transition-colors focus:outline-none ${
              rule.isEnabled ? 'bg-indigo-600' : 'bg-gray-700'
            }`}
          >
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
              rule.isEnabled ? 'translate-x-4' : 'translate-x-0.5'
            }`} />
          </button>

          {/* Rule Flow */}
          <div className="flex items-center space-x-2 min-w-0">
            <div className="shrink-0">
              <span className="rounded-lg bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-bold text-indigo-300 uppercase">
                {triggerLabel[rule.triggerType] ?? rule.triggerType}
              </span>
            </div>
            <ArrowRight className="h-3 w-3 text-gray-500 shrink-0" />
            <div className="shrink-0">
              <span className="rounded-lg bg-violet-500/20 border border-violet-500/30 px-2 py-0.5 text-[10px] font-bold text-violet-300 uppercase">
                {actionLabel[rule.actionType] ?? rule.actionType}
              </span>
            </div>
            <p className="ml-2 truncate text-xs font-semibold text-white">{rule.name}</p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 shrink-0 ml-4">
          {/* Execution Count */}
          <div className="flex items-center space-x-1 rounded-xl bg-white/5 border border-white/10 px-2 py-1">
            <BarChart2 className="h-3 w-3 text-gray-400" />
            <span className="text-[10px] font-semibold text-gray-400">{rule.executionCount}</span>
          </div>

          {/* Logs toggle */}
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="rounded-xl p-1.5 text-gray-500 hover:bg-white/10 hover:text-white transition"
            title="View Logs"
          >
            {showLogs ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {/* Toggle Enable/Disable */}
          <button
            onClick={() => onToggle(rule.id)}
            className={`rounded-xl p-1.5 transition ${
              rule.isEnabled
                ? 'text-indigo-400 hover:bg-indigo-500/20'
                : 'text-gray-500 hover:bg-white/10 hover:text-white'
            }`}
            title={rule.isEnabled ? 'Pause Rule' : 'Enable Rule'}
          >
            {rule.isEnabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(rule.id)}
            className="rounded-xl p-1.5 text-gray-500 hover:bg-red-500/20 hover:text-red-400 transition"
            title="Delete Rule"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Last executed */}
      {rule.lastExecutedAt && (
        <div className="border-t border-white/5 px-4 py-2 flex items-center space-x-1.5">
          <Clock className="h-3 w-3 text-gray-500" />
          <span className="text-[10px] text-gray-500">
            Last run: {new Date(rule.lastExecutedAt).toLocaleString()}
          </span>
        </div>
      )}

      {/* Execution Logs Panel */}
      {showLogs && (
        <div className="border-t border-white/10 px-4 py-3 space-y-1.5">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Execution Logs</p>
          {logs.length === 0 ? (
            <p className="text-[11px] text-gray-500">No execution logs yet.</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start space-x-2">
                {log.status === 'SUCCESS'
                  ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  : <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />}
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-300 truncate">{log.message}</p>
                  <p className="text-[10px] text-gray-600">{new Date(log.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

interface RuleListProps {
  rules: AutomationRuleDto[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RuleList({ rules, onToggle, onDelete }: RuleListProps) {
  if (rules.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-white/10">
          <Zap className="h-7 w-7 text-indigo-400" />
        </div>
        <p className="text-sm font-semibold text-gray-300">No automation rules yet</p>
        <p className="mt-1 text-xs text-gray-500">Click "New Rule" to build your first automation workflow.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rules.map((rule) => (
        <RuleCard key={rule.id} rule={rule} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  );
}
