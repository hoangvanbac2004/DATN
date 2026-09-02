'use client';

import React, { useState } from 'react';
import { X, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import type { CreateRulePayload, TriggerType, ActionType } from '../types';

interface AutomationBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateRulePayload) => void;
  isLoading?: boolean;
}

const TRIGGER_OPTIONS: { value: TriggerType; label: string; description: string }[] = [
  { value: 'TASK_CREATED',         label: 'Task Created',          description: 'When a new task is added to the project' },
  { value: 'TASK_STATUS_CHANGED',  label: 'Status Changed',         description: 'When a task status is updated' },
  { value: 'TASK_COMPLETED',       label: 'Task Completed',         description: 'When a task is marked as Done' },
  { value: 'DUE_DATE_PASSED',      label: 'Due Date Passed',        description: 'When a task due date is overdue' },
  { value: 'MEMBER_ASSIGNED',      label: 'Member Assigned',        description: 'When a member is assigned to a task' },
];

const ACTION_OPTIONS: { value: ActionType; label: string; description: string }[] = [
  { value: 'SEND_NOTIFICATION',    label: 'Send Notification',      description: 'Notify the assignee automatically' },
  { value: 'UPDATE_STATUS',        label: 'Update Status',          description: 'Change the task status to a target value' },
  { value: 'MOVE_TASK_TO_COLUMN',  label: 'Move to Column',         description: 'Move the task to a specific board column' },
  { value: 'ASSIGN_USER',          label: 'Assign User',            description: 'Auto-assign a workspace member' },
];

export function AutomationBuilder({ isOpen, onClose, onSave, isLoading }: AutomationBuilderProps) {
  const [step, setStep] = useState<'trigger' | 'action' | 'name'>(  'trigger');
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerType | null>(null);
  const [selectedAction, setSelectedAction]   = useState<ActionType | null>(null);
  const [ruleName, setRuleName] = useState('');

  if (!isOpen) return null;

  const canProceedToAction = Boolean(selectedTrigger);
  const canProceedToName   = Boolean(selectedTrigger && selectedAction);
  const canSave            = Boolean(selectedTrigger && selectedAction && ruleName.trim());

  const triggerLabel = TRIGGER_OPTIONS.find(t => t.value === selectedTrigger)?.label;
  const actionLabel  = ACTION_OPTIONS.find(a => a.value === selectedAction)?.label;

  const handleSave = () => {
    if (!selectedTrigger || !selectedAction || !ruleName.trim()) return;
    onSave({
      name:             ruleName.trim(),
      triggerType:      selectedTrigger,
      actionType:       selectedAction,
      actionConfigJson: JSON.stringify({ auto: true }),
      isEnabled:        true,
    });
    handleClose();
  };

  const handleClose = () => {
    setStep('trigger');
    setSelectedTrigger(null);
    setSelectedAction(null);
    setRuleName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0f172a] shadow-2xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#111827] px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Automation Rule Builder</h2>
              <p className="text-[10px] text-gray-400">Define a no-code automation workflow</p>
            </div>
          </div>
          <button onClick={handleClose} className="rounded-xl p-2 text-gray-400 hover:bg-white/10 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Progress */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-[#111827]/60 px-6 py-3">
          {(['trigger', 'action', 'name'] as const).map((s, i) => {
            const labels = ['1. Trigger', '2. Action', '3. Name'];
            const isDone = (step === 'action' && s === 'trigger') ||
                           (step === 'name'   && (s === 'trigger' || s === 'action'));
            const isActive = step === s;
            return (
              <React.Fragment key={s}>
                <div className={`flex items-center space-x-1.5 rounded-xl px-3 py-1 text-xs font-semibold transition ${
                  isActive ? 'bg-indigo-600 text-white' :
                  isDone   ? 'bg-emerald-600/30 text-emerald-300' : 'text-gray-500'
                }`}>
                  {isDone ? <CheckCircle className="h-3 w-3" /> : <span>{i + 1}</span>}
                  <span>{labels[i]}</span>
                </div>
                {i < 2 && <ArrowRight className="h-3 w-3 text-gray-600 shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 p-6 space-y-3 overflow-y-auto min-h-[300px]">

          {/* Trigger Selection */}
          {step === 'trigger' && (
            <>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Choose a Trigger</h3>
              {TRIGGER_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedTrigger(opt.value)}
                  className={`w-full flex items-start space-x-3 rounded-2xl border p-4 text-left transition ${
                    selectedTrigger === opt.value
                      ? 'border-indigo-500 bg-indigo-600/20 shadow-lg shadow-indigo-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`mt-0.5 h-4 w-4 rounded-full border-2 shrink-0 transition ${
                    selectedTrigger === opt.value ? 'border-indigo-400 bg-indigo-400' : 'border-gray-500'
                  }`} />
                  <div>
                    <p className="text-xs font-bold text-white">{opt.label}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{opt.description}</p>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Action Selection */}
          {step === 'action' && (
            <>
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 flex items-center space-x-2 mb-4">
                <Zap className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <p className="text-xs text-indigo-300">Trigger: <span className="font-bold text-white">{triggerLabel}</span></p>
              </div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Then do this Action</h3>
              {ACTION_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedAction(opt.value)}
                  className={`w-full flex items-start space-x-3 rounded-2xl border p-4 text-left transition ${
                    selectedAction === opt.value
                      ? 'border-violet-500 bg-violet-600/20 shadow-lg shadow-violet-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`mt-0.5 h-4 w-4 rounded-full border-2 shrink-0 transition ${
                    selectedAction === opt.value ? 'border-violet-400 bg-violet-400' : 'border-gray-500'
                  }`} />
                  <div>
                    <p className="text-xs font-bold text-white">{opt.label}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{opt.description}</p>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Name Step */}
          {step === 'name' && (
            <>
              {/* Rule Flow Preview */}
              <div className="flex items-center justify-center space-x-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 mb-4">
                <div className="rounded-xl bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 text-xs font-bold text-indigo-300">
                  {triggerLabel}
                </div>
                <ArrowRight className="h-4 w-4 text-gray-500" />
                <div className="rounded-xl bg-violet-600/20 border border-violet-500/30 px-3 py-1.5 text-xs font-bold text-violet-300">
                  {actionLabel}
                </div>
              </div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Give this Rule a Name</h3>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="e.g. Alert assignee when task is completed"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#111827]/80 px-6 py-4">
          <button
            onClick={() => {
              if (step === 'action') setStep('trigger');
              if (step === 'name')   setStep('action');
            }}
            className={`text-xs text-gray-400 hover:text-white transition ${step === 'trigger' ? 'invisible' : ''}`}
          >
            ← Back
          </button>

          <div className="flex items-center space-x-3">
            <button onClick={handleClose} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition">
              Cancel
            </button>

            {step === 'trigger' && (
              <button
                onClick={() => setStep('action')}
                disabled={!canProceedToAction}
                className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50 transition"
              >
                Continue →
              </button>
            )}
            {step === 'action' && (
              <button
                onClick={() => setStep('name')}
                disabled={!canProceedToName}
                className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50 transition"
              >
                Continue →
              </button>
            )}
            {step === 'name' && (
              <button
                onClick={handleSave}
                disabled={!canSave || isLoading}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 transition shadow-lg"
              >
                {isLoading ? 'Saving…' : 'Save Rule'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
