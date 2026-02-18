import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reflect AI",
  description: "Internal reflection platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-void text-slate-100 antialiased">
        <div className="flex h-screen overflow-hidden">

          {/* Sidebar */}
          <aside className="w-64 bg-abyss border-r border-navy-800 flex flex-col flex-shrink-0 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy-900/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

            {/* Logo */}
            <div className="p-6 pb-4 relative">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/50">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1L10.5 6H15L11 9.5L12.5 14.5L8 11.5L3.5 14.5L5 9.5L1 6H5.5L8 1Z" fill="white" fillOpacity="0.9"/>
                  </svg>
                </div>
                <div>
                  <h1 className="font-display text-lg font-semibold text-white tracking-tight leading-none">
                    Reflect
                  </h1>
                  <span className="text-[10px] text-blue-400/70 font-mono uppercase tracking-widest">AI Platform</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-6 h-px bg-gradient-to-r from-transparent via-navy-700 to-transparent mb-4" />

            {/* Nav */}
            <nav className="flex-1 px-3 space-y-1">
              <p className="px-3 mb-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Navigation</p>

              <a href="/" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800/80 transition-all duration-200 relative">
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <span className="font-sans text-sm font-medium">Feed</span>
              </a>

              <a href="/create" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800/80 transition-all duration-200">
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </div>
                <span className="font-sans text-sm font-medium">Create Reflection</span>
              </a>

              <a href="/podcast/create" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800/80 transition-all duration-200">
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </div>
                <span className="font-sans text-sm font-medium">Host Podcast</span>
              </a>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-navy-800">
              <div className="flex items-center gap-2 px-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-xs font-mono text-blue-200">U</div>
                <div>
                  <p className="text-xs font-medium text-slate-300">Internal User</p>
                  <p className="text-[10px] text-slate-500">Member</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-void">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}