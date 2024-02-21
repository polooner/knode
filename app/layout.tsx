import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { twMerge } from 'tailwind-merge';
import 'reactflow/dist/style.css';
import { Toaster } from 'react-hot-toast';
import { KeyProvider } from '@/app-context/key-context-provider';
import { SubtopicsProvider } from '@/app-context/subtopics-context-provider';

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
        <Toaster />

        <KeyProvider>
          <SubtopicsProvider>{children}</SubtopicsProvider>
        </KeyProvider>
      </body>
    </html>
  );
}
