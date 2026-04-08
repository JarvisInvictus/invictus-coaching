import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Invictus Coaching",
  description: "Client coaching dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <nav
          style={{
            background: "rgba(255,255,255,0.04)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
          className="px-6 py-4"
        >
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <span className="text-2xl" style={{ color: "var(--tiffany)" }}>
              ⚡
            </span>
            <Link href="/" className="text-lg font-semibold tracking-wide" style={{ color: "var(--text)" }}>
              Invictus Coaching
            </Link>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
