import type { Metadata } from "next";
import { Anton, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blyoi — Build Life Like You Own It",
  description:
    "Blyoi gives independent creators the registered company, legal agreements, invoicing, payment rails and trust layer to sell software without owning a company. Build life like you own it.",
  keywords: [
    "Blyoi",
    "build life like you own it",
    "sell digital products",
    "SaaS platform",
    "no company needed",
    "indie developer",
    "creator economy",
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
      className={`${anton.variable} ${jakarta.variable} ${geistMono.variable} h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground noise">{children}</body>
    </html>
  );
}
