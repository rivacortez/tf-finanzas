"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { FcGoogle } from "react-icons/fc";

export function GoogleSignInButton() {
  const supabase = createClient();

  const signInWithGoogle = async () => {
    try {
      // Determine the correct redirect URL based on the current environment
      const isProduction = window.location.hostname !== 'localhost';
      const baseUrl = isProduction 
        ? 'https://tu-app-vercel.vercel.app' // Reemplaza con tu URL de Vercel
        : window.location.origin;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${baseUrl}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          },
          scopes: 'openid email profile'
        },
      });

      if (error) {
        console.error("Error signing in with Google:", error.message);
      }
    } catch (error) {
      console.error("Unexpected error during Google sign-in:", error);
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-900 dark:text-slate-100 font-medium transition-all duration-200"
      onClick={signInWithGoogle}
    >
      <FcGoogle className="h-5 w-5 mr-2" />
      Continuar con Google
    </Button>
  );
}