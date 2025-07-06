"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { User, TalentProfile } from "@/lib/types";

interface ProfileCardProps {
  user: User | null;
  profile?: TalentProfile | null;
  loading?: boolean;
  onLoadProfile?: () => void;
  onLogout?: () => void;
}

export function ProfileCard({
  user,
  profile,
  loading = false,
  onLoadProfile,
  onLogout,
}: ProfileCardProps) {
  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Not Authenticated</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please connect your wallet or authenticate via Farcaster.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          User Profile
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
            {user.authProvider}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">ID:</span> {user.id}
          </div>
          {user.fname && (
            <div className="text-sm">
              <span className="font-medium">Farcaster:</span> {user.fname}
            </div>
          )}
          {user.fid && (
            <div className="text-sm">
              <span className="font-medium">FID:</span> {user.fid}
            </div>
          )}
          {user.walletAddress && (
            <div className="text-sm">
              <span className="font-medium">Wallet:</span>{" "}
              <code className="text-xs bg-muted px-1 rounded">
                {user.walletAddress.slice(0, 6)}...
                {user.walletAddress.slice(-4)}
              </code>
            </div>
          )}
        </div>

        {profile && (
          <div className="border-t pt-4 space-y-2">
            <h4 className="text-sm font-medium">Talent Profile</h4>
            <div className="text-sm">
              <span className="font-medium">Name:</span> {profile.name || "N/A"}
            </div>
            {profile.score && (
              <div className="text-sm">
                <span className="font-medium">Score:</span> {profile.score}
              </div>
            )}
            {profile.bio && (
              <div className="text-sm">
                <span className="font-medium">Bio:</span> {profile.bio}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-4">
          {onLoadProfile && (
            <Button onClick={onLoadProfile} variant="outline" size="sm">
              Load Talent Profile
            </Button>
          )}
          {onLogout && (
            <Button onClick={onLogout} variant="destructive" size="sm">
              Logout
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
