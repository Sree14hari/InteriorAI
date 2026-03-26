import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InteriorAI — AI-Powered Interior Design",
  description:
    "Transform your space with AI-powered interior design. Chat with our AI, generate stunning design concepts, and customize them to your taste.",
  keywords: ["interior design", "AI", "home decor", "room design", "design generator"],
  openGraph: {
    title: "InteriorAI — AI-Powered Interior Design",
    description: "Transform your space with AI-powered interior design.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950">
        <Script src="https://js.puter.com/v2/" strategy="beforeInteractive" />
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
