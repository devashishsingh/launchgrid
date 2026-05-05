import type { Metadata } from "next";
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
  title: "Launchbox — Sell Your Digital Product Without a Company",
  description:
    "Launch SaaS platforms, tools, utilities, and any digital product under our registered company. No legal hassle. No compliance burden. No upfront risk.",
  keywords: [
    "sell digital products",
    "SaaS platform",
    "no company needed",
    "indie developer",
    "digital tools",
    "freelancer invoicing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground noise">{children}</body>
    </html>
  );
}
