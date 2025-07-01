import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { routesConfig } from "@/lib/config/routes";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (data?.user && !error) {
      console.log('User authenticated successfully:', data.user.email);
      
      // Check if profile exists, if not it will be created by the trigger
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error('Error checking profile:', profileError);
      } else if (!profileData) {
        console.log('Profile not found, trigger should create it automatically');
      } else {
        console.log('Profile found:', profileData.username);
      }
    } else if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${origin}/sign-in?type=error&message=${encodeURIComponent('Error de autenticación')}`);
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}${routesConfig.public.home.path}`);
}