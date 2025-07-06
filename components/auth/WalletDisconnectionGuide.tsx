"use client";

import { CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";

interface WalletDisconnectionGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletDisconnectionGuide({
  isOpen,
  onClose,
}: WalletDisconnectionGuideProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if screen is mobile size (below 640px - Tailwind's sm breakpoint)
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const contentJSX = (
    <div className="space-y-4">
      {/* Accessibility titles for screen readers */}
      <DialogTitle className="sr-only">Logout Complete</DialogTitle>
      <DialogDescription className="sr-only">
        Information about wallet connection status after logout
      </DialogDescription>

      {/* Success header */}
      <div className="text-center">
        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <h3 className="text-lg font-semibold">Signed Out</h3>
      </div>

      {/* Simple info */}
      <div className="bg-blue-50 border border-blue-200 rounded p-3">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            Your wallet may still appear connected in your browser extension.
            This is normal and secure.
          </p>
        </div>
      </div>

      {/* Action button */}
      <Button onClick={onClose} className="w-full">
        Got it
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-auto">
          {/* Drag handle for mobile */}
          <div className="mx-auto w-12 h-1 bg-gray-300 rounded-full mb-4" />
          <div className="pb-6">{contentJSX}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">{contentJSX}</DialogContent>
    </Dialog>
  );
}
