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
      <body className="bg-gray-100">
        <div className="flex h-screen">

          {/* Sidebar */}
          <aside className="w-64 bg-white border-r p-6 flex flex-col">
            <h1 className="text-xl font-semibold mb-8">
              Reflect AI
            </h1>

            <nav className="space-y-3">
              <a
                href="/"
                className="block px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                Feed
              </a>

              <a
                href="/create"
                className="block px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                Create Reflection
              </a>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-10">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}
