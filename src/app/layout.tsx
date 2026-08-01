import type { Metadata } from 'next';
import { Heebo } from 'next/font/google';
import './globals.css';

const heebo = Heebo({ subsets: ['hebrew', 'latin'] });

export const metadata: Metadata = {
  title: 'Gmach / קרן השקעות',
  description: 'Shared Investment Pool (Unitized NAV)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={heebo.className}>
      <body className="bg-gray-50 text-gray-900 antialiased flex h-screen overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-l border-gray-200 flex flex-col shadow-sm z-10">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-800">ניהול קרן Gmach</h1>
            <p className="text-xs text-gray-500 mt-1">מערכת NAV יחידתית</p>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <a href="/" className="flex items-center px-4 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium">
              <span className="ml-3">ראשי (Dashboard)</span>
            </a>
            <a href="/members" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
              <span className="ml-3">חברים (Members)</span>
            </a>
            <a href="/operations" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
              <span className="ml-3">פעולות (Operations)</span>
            </a>
            <a href="/valuations" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
              <span className="ml-3">שערוך (Valuations)</span>
            </a>
          </nav>
          <div className="p-4 border-t border-gray-100 text-sm text-gray-400 text-center">
            גרסה 1.0.0
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>

      </body>
    </html>
  );
}
