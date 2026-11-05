import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Notes',
  description: 'A small notes app to add AI features to'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="mx-auto min-h-screen max-w-2xl bg-white px-4 py-8 text-slate-900">
        <header className="mb-8 border-b border-slate-200 pb-4">
          <Link href="/" className="text-xl font-semibold">
            AI Notes
          </Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
