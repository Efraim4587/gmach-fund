import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gmach Fund Management',
  description: 'Shared Investment Pool (Unitized NAV)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
