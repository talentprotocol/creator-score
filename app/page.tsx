import { SimpleAuthTest } from "@/components/auth/SimpleAuthTest";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Creator Score</h1>
            <p className="text-muted-foreground">
              Authentication Test - Browser vs Farcaster Miniapp
            </p>
          </div>

          <SimpleAuthTest />
        </div>
      </div>
    </main>
  );
}
