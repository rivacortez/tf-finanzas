"use client";

import { useEffect } from "react";
import { debugUserProfile } from "@/lib/debug-user-profile";
import { Button } from "@/components/ui/button";

export function DebugUserProfile() {
  const handleDebug = async () => {
    console.clear();
    console.log("🔍 Iniciando debug del perfil de usuario...");
    await debugUserProfile();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={handleDebug}
        variant="outline"
        size="sm"
        className="bg-blue-500 text-white hover:bg-blue-600"
      >
        🐛 Debug User Profile
      </Button>
    </div>
  );
}
