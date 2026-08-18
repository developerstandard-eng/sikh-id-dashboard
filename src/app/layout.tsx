import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Sikh ID — Dashboard',
  description: 'One ID. One community. Endless possibilities.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans text-navy antialiased">{children}</body>
    </html>
  );
}
