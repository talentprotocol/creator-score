"use client";

import { useAuth } from "@/hooks/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function SimpleAuthTest() {
  const {
    user,
    isAuthenticated,
    context,
    loading,
    error,
    authenticate,
    logout,
  } = useAuth();

  const handleLogin = () => {
    authenticate("privy");
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-10 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Context Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Context Detection
            <Badge variant={context === "browser" ? "default" : "secondary"}>
              {context}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {context === "browser"
              ? "Running in browser - Privy authentication available"
              : "Running in Farcaster miniapp - Frame context available"}
          </p>
        </CardContent>
      </Card>

      {/* Authentication Status */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Badge variant={isAuthenticated ? "default" : "outline"}>
              {isAuthenticated ? "Authenticated" : "Not Authenticated"}
            </Badge>
          </div>

          {/* Browser Context - Show Privy Login */}
          {context === "browser" && !isAuthenticated && (
            <Button onClick={handleLogin} className="w-full">
              Connect Wallet (Privy)
            </Button>
          )}

          {/* Show Logout for Authenticated Users */}
          {isAuthenticated && logout && (
            <Button onClick={logout} variant="outline" className="w-full">
              Logout
            </Button>
          )}

          {/* Farcaster Context - No Login Button Needed */}
          {context === "farcaster_miniapp" && !isAuthenticated && (
            <p className="text-sm text-muted-foreground">
              Authentication automatic in Farcaster context
            </p>
          )}
        </CardContent>
      </Card>

      {/* User Data Display */}
      {isAuthenticated && user && (
        <Card>
          <CardHeader>
            <CardTitle>User Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <span className="font-medium">ID:</span> <code>{user.id}</code>
              </div>

              {user.walletAddress && (
                <div>
                  <span className="font-medium">Wallet:</span>
                  <code className="ml-2 bg-muted px-2 py-1 rounded">
                    {user.walletAddress.slice(0, 6)}...
                    {user.walletAddress.slice(-4)}
                  </code>
                </div>
              )}

              {user.fid && (
                <div>
                  <span className="font-medium">FID:</span>{" "}
                  <code>{user.fid}</code>
                </div>
              )}

              {user.fname && (
                <div>
                  <span className="font-medium">Farcaster:</span>{" "}
                  <code>{user.fname}</code>
                </div>
              )}

              <div>
                <span className="font-medium">Provider:</span>
                <Badge variant="outline" className="ml-2">
                  {user.authProvider}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
