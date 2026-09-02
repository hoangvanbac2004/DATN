'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, CheckCircle2, Rocket, ArrowRight } from 'lucide-react';

interface StepDoneProps {
  workspaceName: string;
  projectName: string;
}

export function StepDone({ workspaceName, projectName }: StepDoneProps) {
  const router = useRouter();

  const handleFinish = () => {
    router.push('/');
  };

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shadow-2xl animate-pulse">
        <Sparkles className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">You&apos;re All Set! 🎉</h2>
        <p className="mx-auto max-w-sm text-xs text-gray-400">
          Your workspace and first project have been created successfully.
        </p>
      </div>

      <div className="space-y-2 rounded-2xl border border-white/10 bg-gray-900/60 p-4 text-left backdrop-blur-md">
        <div className="flex items-center space-x-3 text-xs text-gray-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Workspace: <strong className="text-white">{workspaceName}</strong></span>
        </div>
        <div className="flex items-center space-x-3 text-xs text-gray-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Project: <strong className="text-white">{projectName}</strong></span>
        </div>
      </div>

      <button
        onClick={handleFinish}
        className="flex w-full items-center justify-center space-x-2 rounded-xl bg-indigo-600 py-3.5 text-xs font-semibold text-white shadow-xl shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-[0.98]"
      >
        <Rocket className="h-4 w-4" />
        <span>Go to Dashboard</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
