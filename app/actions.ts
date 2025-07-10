"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { routesConfig } from "@/lib/config/routes";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    redirect(`/sign-up?type=error&message=${encodeURIComponent("Email and password are required")}`);
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(`${error.code} ${error.message}`);
    redirect(`/sign-up?type=error&message=${encodeURIComponent(error.message)}`);
  }
  
  redirect(`/sign-up?type=success&message=${encodeURIComponent("Thanks for signing up! Please check your email for a verification link.")}`);


};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  if (!email || !password) {
    redirect(`/sign-in?type=error&message=${encodeURIComponent("Email y contraseña son requeridos")}`);
  }

  // Proceed with normal email/password authentication
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/sign-in?type=error&message=${encodeURIComponent(error.message)}`);
  }

  // Redirigir a la calculadora de bonos franceses después de iniciar sesión correctamente
  redirect('/simulator/bono-frances');
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email) {
    redirect(`/forgot-password?type=error&message=${encodeURIComponent("Email is required")}`);
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=${routesConfig.private.resetPassword.path}`,
  });

  if (error) {
    console.error(error.message);
    redirect(`/forgot-password?type=error&message=${encodeURIComponent("Could not reset password")}`);
  }

  redirect(`/forgot-password?type=success&message=${encodeURIComponent("Check your email for a link to reset your password.")}`);

};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    redirect(`${routesConfig.private.resetPassword.path}?type=error&message=${encodeURIComponent("Password and confirm password are required")}`);
  }

  if (password !== confirmPassword) {
    redirect(`${routesConfig.private.resetPassword.path}?type=error&message=${encodeURIComponent("Passwords do not match")}`);
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    redirect(`${routesConfig.private.resetPassword.path}?type=error&message=${encodeURIComponent("Password update failed")}`);
  }

  redirect(`${routesConfig.public.signIn.path}?type=success&message=${encodeURIComponent("Password updated successfully. Please sign in with your new password.")}`);
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect(routesConfig.public.signIn.path, RedirectType.push);
};