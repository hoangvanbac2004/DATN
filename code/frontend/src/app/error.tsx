'use client';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold text-red-500">System Exception Caught</h2>
      <p className="text-gray-400 mt-2">{error.message || 'An unhandled application error occurred.'}</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
