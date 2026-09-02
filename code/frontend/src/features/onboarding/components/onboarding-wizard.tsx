'use client';

import React, { useState } from 'react';
import { StepWelcome } from './step-welcome';
import { StepCreateWorkspace } from './step-create-workspace';
import { StepCreateProject } from './step-create-project';
import { StepDone } from './step-done';

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [workspaceId, setWorkspaceId] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [projectName, setProjectName] = useState('');

  const steps = [
    { number: 1, label: 'Welcome' },
    { number: 2, label: 'Workspace' },
    { number: 3, label: 'Project' },
    { number: 4, label: 'Done' },
  ];

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Badge Header */}
      <div className="text-center">
        <h1 className="text-2xl font-black text-white tracking-tight font-heading">
          Task<span className="text-indigo-500">Flow</span>
        </h1>
      </div>

      {/* Progress Steps Indicator */}
      <div className="flex items-center justify-between px-4">
        {steps.map((s, idx) => (
          <React.Fragment key={s.number}>
            <div className="flex flex-col items-center space-y-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  currentStep >= s.number
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'border border-white/10 bg-gray-900/60 text-gray-500'
                }`}
              >
                {s.number}
              </div>
              <span
                className={`text-[10px] font-medium transition ${
                  currentStep >= s.number ? 'text-gray-200' : 'text-gray-500'
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-[2px] flex-1 mx-2 mb-4 transition-all ${
                  currentStep > s.number ? 'bg-indigo-600' : 'bg-white/10'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Card Container with Glassmorphism */}
      <div className="rounded-3xl border border-white/10 bg-gray-900/70 p-6 backdrop-blur-xl shadow-2xl shadow-black/50 transition-all duration-300">
        {currentStep === 1 && (
          <StepWelcome onNext={() => setCurrentStep(2)} />
        )}

        {currentStep === 2 && (
          <StepCreateWorkspace
            onNext={(id, name) => {
              setWorkspaceId(id);
              setWorkspaceName(name);
              setCurrentStep(3);
            }}
          />
        )}

        {currentStep === 3 && (
          <StepCreateProject
            workspaceId={workspaceId}
            workspaceName={workspaceName}
            onNext={(name) => {
              setProjectName(name);
              setCurrentStep(4);
            }}
          />
        )}

        {currentStep === 4 && (
          <StepDone workspaceName={workspaceName} projectName={projectName} />
        )}
      </div>
    </div>
  );
}
