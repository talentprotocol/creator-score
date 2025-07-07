"use client";

import { useState, useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CREATOR_CATEGORIES = [
  {
    id: "visual-art",
    label: "Visual Art",
    description: "Digital art, illustrations, photography",
  },
  {
    id: "video",
    label: "Video",
    description: "YouTube, TikTok, streaming content",
  },
  { id: "writing", label: "Writing", description: "Blogs, newsletters, books" },
  {
    id: "social",
    label: "Social",
    description: "Twitter, Instagram, community building",
  },
  {
    id: "music",
    label: "Music",
    description: "Original music, covers, production",
  },
  {
    id: "podcast",
    label: "Podcast",
    description: "Audio content, interviews, storytelling",
  },
] as const;

export function CategorySelection() {
  const posthog = usePostHog();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Track component view on mount
  useEffect(() => {
    posthog?.capture("category_selection_viewed", {
      component: "CategorySelection",
      timestamp: new Date().toISOString(),
    });
  }, [posthog]);

  const handleCategorySelect = async (categoryId: string) => {
    if (isProcessing) return; // Prevent multiple rapid selections

    const category = CREATOR_CATEGORIES.find((c) => c.id === categoryId);

    // Track category selection
    posthog?.capture("creator_category_selected", {
      categoryId: categoryId,
      categoryLabel: category?.label,
      categoryDescription: category?.description,
      previousSelection: selectedCategory,
      timestamp: new Date().toISOString(),
    });

    setSelectedCategory(categoryId);
    setIsProcessing(true);

    try {
      // Simulate API call to save selection
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Track successful save
      posthog?.capture("creator_category_saved", {
        categoryId: categoryId,
        categoryLabel: category?.label,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // Track errors
      posthog?.capture("creator_category_save_failed", {
        categoryId: categoryId,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Choose Your Main Creator Category</CardTitle>
        <CardDescription>
          Select the category that best describes your primary creative focus.
          Your selection will be saved automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CREATOR_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              disabled={isProcessing}
              className={`p-4 text-left border rounded-lg transition-all hover:border-primary/50 hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedCategory === category.id
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{category.label}</h3>
                {selectedCategory === category.id && (
                  <Badge variant="default">
                    {isProcessing ? "Saving..." : "Selected"}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </button>
          ))}
        </div>

        {selectedCategory && !isProcessing && (
          <div className="pt-2 text-center">
            <p className="text-sm text-muted-foreground">
              ✅ Category saved successfully
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
