"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WalletDisconnectionGuide } from "./WalletDisconnectionGuide";
import { env } from "@/lib/config";

export function UnifiedAuthTest() {
  const {
    isAuthenticated,
    user,
    loading,
    error,
    context,
    authenticate,
    logout,
  } = useAuth();

  const [showDisconnectionGuide, setShowDisconnectionGuide] = useState(false);

  // Determine the current active context
  const getCurrentContext = () => {
    if (env.NEXT_PUBLIC_DEV_MODE) return "dev";
    if (context === "farcaster_miniapp") return "miniapp";
    if (context === "browser") return "browser";
    return "unknown";
  };

  const currentContext = getCurrentContext();

  // Get description for the current context
  const getContextDescription = () => {
    if (env.NEXT_PUBLIC_DEV_MODE) {
      return "Using mock authentication for rapid testing";
    }

    switch (context) {
      case "browser":
        return "Real Privy wallet authentication via browser";
      case "farcaster_miniapp":
        return "Mini app-based authentication for Farcaster users";
      default:
        return "Context detection in progress";
    }
  };

  const handleLogout = async () => {
    try {
      await logout();

      // Show educational guide for browser users with external wallets
      if (!env.NEXT_PUBLIC_DEV_MODE && context === "browser") {
        setShowDisconnectionGuide(true);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading authentication...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto border-destructive">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <h3 className="font-medium">Authentication Error</h3>
            <p className="text-sm mt-1">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center gap-2 mb-3">
            <Badge
              variant={currentContext === "dev" ? "default" : "outline"}
              className={currentContext === "dev" ? "" : "opacity-50"}
            >
              Dev
            </Badge>
            <Badge
              variant={currentContext === "browser" ? "default" : "outline"}
              className={currentContext === "browser" ? "" : "opacity-50"}
            >
              Browser
            </Badge>
            <Badge
              variant={currentContext === "miniapp" ? "default" : "outline"}
              className={currentContext === "miniapp" ? "" : "opacity-50"}
            >
              Mini App
            </Badge>
          </div>
          <CardTitle>Authentication Status</CardTitle>
          <CardDescription>{getContextDescription()}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isAuthenticated && user ? (
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">
                    Authenticated
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">User ID:</span>
                  <span className="ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {user.id}
                  </span>
                </div>

                {user.walletAddress && (
                  <div>
                    <span className="font-medium">Wallet:</span>
                    <span className="ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {`${user.walletAddress.slice(
                        0,
                        6
                      )}...${user.walletAddress.slice(-4)}`}
                    </span>
                  </div>
                )}

                {user.fid && (
                  <div>
                    <span className="font-medium">FID:</span>
                    <span className="ml-2">{user.fid}</span>
                  </div>
                )}

                {user.fname && (
                  <div>
                    <span className="font-medium">Username:</span>
                    <span className="ml-2">@{user.fname}</span>
                  </div>
                )}
              </div>

              {/* Inline Wallet Connection Status */}
              {user.walletAddress &&
                !env.NEXT_PUBLIC_DEV_MODE &&
                context === "browser" && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-blue-800">
                          Wallet Connected
                        </span>
                      </div>
                      <span className="text-xs text-blue-600">
                        Via Browser Extension
                      </span>
                    </div>
                  </div>
                )}

              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-200 rounded p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-600">
                    Not Authenticated
                  </span>
                </div>
              </div>

              <Button
                onClick={() =>
                  authenticate(
                    env.NEXT_PUBLIC_DEV_MODE
                      ? "privy"
                      : context === "farcaster_miniapp"
                      ? "farcaster"
                      : "privy"
                  )
                }
                className="w-full"
              >
                {env.NEXT_PUBLIC_DEV_MODE
                  ? "Dev Login"
                  : context === "farcaster_miniapp"
                  ? "Connect Farcaster"
                  : "Connect Wallet"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wallet Disconnection Guide Modal */}
      <WalletDisconnectionGuide
        isOpen={showDisconnectionGuide}
        onClose={() => setShowDisconnectionGuide(false)}
      />
    </>
  );
}
