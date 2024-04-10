import { KeyProvider } from '@/app-context/key-context-provider';
import { SubtopicsProvider } from '@/app-context/subtopics-context-provider';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import 'reactflow/dist/style.css';
import { twMerge } from 'tailwind-merge';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'knode',
  description: 'Actually learn.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={twMerge(inter.className)}>
        <Analytics />
        <Toaster />

        <KeyProvider>
          <SubtopicsProvider>{children}</SubtopicsProvider>
        </KeyProvider>
      </body>
    </html>
  );
}
