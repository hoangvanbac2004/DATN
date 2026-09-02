import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import '@/styles/globals.css';
import QueryProvider from '@/providers/QueryProvider';
import ThemeProvider from '@/components/ThemeProvider';
import { AuthProvider } from '@/providers/auth-provider';
import { I18nProvider } from '@/providers/i18n-provider';

import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'TaskFlow - Enterprise Personal Productivity Platform',
  description: 'Manage tasks, workspaces, projects, calendar, and workflows with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <ErrorBoundary>
          <ThemeProvider>
            <QueryProvider>
              <I18nProvider>
                <AuthProvider>{children}</AuthProvider>
                <Toaster position="top-right" richColors theme="dark" />
              </I18nProvider>
            </QueryProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
