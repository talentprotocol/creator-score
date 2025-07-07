import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { generateMiniAppMetaTags, generateOpenGraphConfig } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Generate meta tags
const miniAppMetaTags = generateMiniAppMetaTags();
const openGraphConfig = generateOpenGraphConfig();

export const metadata: Metadata = {
  title: "Creator Score",
  description:
    "Fast, minimal, scalable Next.js app with dual authentication and Talent Protocol integration",
  openGraph: openGraphConfig,
  twitter: {
    card: "summary_large_image",
    title: openGraphConfig.title,
    description: openGraphConfig.description,
    images: openGraphConfig.images,
  },
  other: miniAppMetaTags,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
