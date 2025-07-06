"use client";

import { Header } from "./Header";
import { Navigation } from "./Navigation";
import type { ComponentProps } from "@/lib/types";

interface LayoutProps extends ComponentProps {
  currentPath?: string;
  isAuthenticated?: boolean;
  onNavigate?: (path: string) => void;
  onMenuClick?: () => void;
  onAuthClick?: () => void;
}

export function Layout({
  children,
  currentPath = "/",
  isAuthenticated = false,
  onNavigate,
  onMenuClick,
  onAuthClick,
  className = "",
}: LayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <Header
        isAuthenticated={isAuthenticated}
        onMenuClick={onMenuClick}
        onAuthClick={onAuthClick}
      />

      {/* Main content area with padding for fixed header/nav */}
      <main className="pt-14 pb-16 md:pb-4 px-4 max-w-screen-xl mx-auto">
        {children}
      </main>

      <Navigation currentPath={currentPath} onNavigate={onNavigate} />
    </div>
  );
}
