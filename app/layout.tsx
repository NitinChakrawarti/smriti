
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from './providers';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Smriti - AI Knowledge Ingestion',
  description: 'Smriti captures links, cleans them with AI, and turns them into searchable knowledge.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Smriti',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/logo/dark_logo.png" />
        <link rel="apple-touch-icon" href="/logo/dark_logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} app-shell`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
