"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);

  // Load logged-in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <html lang="en">
      <body className="bg-void text-slate-100 antialiased">
        <div className="flex h-screen overflow-hidden">

          {/* ================= SIDEBAR ================= */}
          <aside className="w-64 bg-abyss border-r border-navy-800 flex flex-col">

            {/* Logo */}
            <div className="p-6 border-b border-navy-800">
              <h1 className="text-lg font-semibold text-white">
                Reflect AI
              </h1>
              <p className="text-[10px] text-slate-500">
                Internal Platform
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 rounded-lg text-sm hover:bg-navy-800"
              >
                Feed
              </Link>

              <Link
                href="/create"
                className="block px-3 py-2 rounded-lg text-sm hover:bg-navy-800"
              >
                Create Reflection
              </Link>

              <Link
                href="/podcast/create"
                className="block px-3 py-2 rounded-lg text-sm hover:bg-navy-800"
              >
                Host Podcast
              </Link>
            </nav>

            {/* ================= USER FOOTER ================= */}
            <div
              className="p-4 border-t border-navy-800 relative"
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              {user ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-2 px-2 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-300">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Member
                      </p>
                    </div>
                  </div>

                  {/* Hover Logout Menu */}
                  {showMenu && (
                    <div className="absolute bottom-14 left-4 bg-navy-900 border border-navy-700 rounded-lg shadow-lg w-36 z-50">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-navy-800 rounded-lg"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col gap-1">
                  <Link
                    href="/login"
                    className="text-xs text-blue-400"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="text-xs text-blue-400"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

          </aside>

          {/* ================= MAIN CONTENT ================= */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}
