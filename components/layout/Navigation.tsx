"use client";

import { Button } from "@/components/ui/button";
import type { ComponentProps } from "@/lib/types";

interface NavigationProps extends ComponentProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

const navigationItems = [
  { path: "/", label: "Home", icon: "home" },
  { path: "/leaderboard", label: "Leaderboard", icon: "trophy" },
  { path: "/search", label: "Search", icon: "search" },
  { path: "/profile", label: "Profile", icon: "user" },
];

export function Navigation({
  currentPath = "/",
  onNavigate,
  className = "",
}: NavigationProps) {
  const renderIcon = (iconName: string) => {
    const iconClasses = "h-5 w-5";

    switch (iconName) {
      case "home":
        return (
          <svg
            className={iconClasses}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        );
      case "trophy":
        return (
          <svg
            className={iconClasses}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        );
      case "search":
        return (
          <svg
            className={iconClasses}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        );
      case "user":
        return (
          <svg
            className={iconClasses}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t md:hidden ${className}`}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navigationItems.map((item) => (
          <Button
            key={item.path}
            variant={currentPath === item.path ? "default" : "ghost"}
            size="sm"
            onClick={() => onNavigate?.(item.path)}
            className="flex flex-col items-center gap-1 h-12 px-2"
          >
            {renderIcon(item.icon)}
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}
