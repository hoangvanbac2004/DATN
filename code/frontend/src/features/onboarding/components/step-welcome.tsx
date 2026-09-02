'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, Layers, Zap, ShieldCheck } from 'lucide-react';

interface StepWelcomeProps {
  onNext: () => void;
}

export function StepWelcome({ onNext }: StepWelcomeProps) {
  const highlights = [
    { icon: Layers, text: 'Organize tasks into spaces and projects' },
    { icon: Zap, text: 'Real-time search, reminders, and activity logs' },
    { icon: ShieldCheck, text: 'Enterprise-grade security and productivity analytics' },
  ];

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 shadow-xl">
        <CheckCircle2 className="h-8 w-8 animate-bounce" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">Welcome to TaskFlow</h2>
        <p className="mx-auto max-w-sm text-xs text-gray-400">
          Your personal productivity platform. Let&apos;s set up your first workspace in just a few clicks.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-white/10 bg-gray-900/60 p-4 text-left backdrop-blur-md">
        {highlights.map((h, i) => {
          const Icon = h.icon;
          return (
            <div key={i} className="flex items-center space-x-3 text-xs text-gray-300">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <span>{h.text}</span>
            </div>
          );
        })}
      </div>

      <button
        onClick={onNext}
        className="flex w-full items-center justify-center space-x-2 rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 active:scale-[0.98]"
      >
        <span>Get Started</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
