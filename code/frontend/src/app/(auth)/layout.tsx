import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#090d16] p-4 text-gray-100 overflow-hidden font-sans">
      {/* Dynamic Background Glow Elements */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-heading">
            Task<span className="text-indigo-500">Flow</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">Enterprise Personal Productivity Platform</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111827]/70 p-8 shadow-2xl backdrop-blur-md">
          {children}
        </div>
      </div>
    </div>
  );
}
