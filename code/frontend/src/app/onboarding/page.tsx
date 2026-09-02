'use client';

import React from 'react';
import { OnboardingWizard } from '@/features/onboarding/components/onboarding-wizard';

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#090d16] p-4 text-white">
      <OnboardingWizard />
    </div>
  );
}
