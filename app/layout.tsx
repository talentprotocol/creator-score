import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Creator Score",
  description:
    "Fast, minimal, scalable Next.js app with dual authentication and Talent Protocol integration",
  openGraph: {
    title: "Creator Score",
    description:
      "Fast, minimal, scalable Next.js app with dual authentication and Talent Protocol integration",
    images: [
      {
        url: "https://via.placeholder.com/1200x630/2563eb/ffffff?text=Creator+Score",
        width: 1200,
        height: 630,
        alt: "Creator Score",
      },
    ],
  },
  other: {
    // Farcaster Frame Meta Tags
    "fc:frame": "vNext",
    "fc:frame:image":
      "https://via.placeholder.com/1200x630/2563eb/ffffff?text=Creator+Score",
    "fc:frame:button:1": "Open Creator Score",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://new.creatorscore.app",
    "fc:frame:button:2": "View Profile",
    "fc:frame:button:2:action": "link",
    "fc:frame:button:2:target": "https://new.creatorscore.app/profile",
    // XMTP Support
    "of:accepts:xmtp": "2024-02-01",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
