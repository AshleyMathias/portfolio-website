import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-website-tau-one-12.vercel.app"),
  title: "Ashley Mathias | AI Engineer",
  description:
    "AI Engineer building RAG pipelines, multi-agent platforms, and MCP architectures. Explore interactive system blueprints and production AI work.",
  keywords: [
    "AI Engineer",
    "Architecture",
    "AI Agents",
    "RAG",
    "MCP",
    "System Design",
  ],
  openGraph: {
    title: "Ashley Mathias | AI Engineer",
    description:
      "Ashley Mathias — AI Engineer designing RAG systems, multi-agent workflows, and production AI architectures.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashley Mathias | AI Engineer",
    description:
      "AI Engineer designing RAG systems, multi-agent workflows, and production AI architectures.",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
