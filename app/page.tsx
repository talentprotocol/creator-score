import { UnifiedAuthTest } from "@/components/auth/UnifiedAuthTest";
import { CategorySelection } from "@/components/features/CategorySelection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Creator Score</h1>
            <p className="text-muted-foreground">
              Fast, minimal, scalable Next.js app with dual authentication
            </p>
          </div>

          <UnifiedAuthTest />

          {/* PostHog Event Tracking Test */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">
                PostHog Event Tracking Test
              </h2>
              <p className="text-sm text-muted-foreground">
                Select a category to test custom event tracking
              </p>
            </div>
            <CategorySelection />
          </div>
        </div>
      </div>
    </main>
  );
}
