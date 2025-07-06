"use client";

import { Button } from "@/components/ui/button";
import type { ComponentProps } from "@/lib/types";

interface HeaderProps extends ComponentProps {
  title?: string;
  onMenuClick?: () => void;
  isAuthenticated?: boolean;
  onAuthClick?: () => void;
}

export function Header({
  title = "Creator Score",
  onMenuClick,
  isAuthenticated = false,
  onAuthClick,
  className = "",
}: HeaderProps) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b ${className}`}
    >
      <div className="flex items-center justify-between h-14 px-4 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>

        <Button
          onClick={onAuthClick}
          variant={isAuthenticated ? "outline" : "default"}
          size="sm"
        >
          {isAuthenticated ? "Profile" : "Connect"}
        </Button>
      </div>
    </header>
  );
}
