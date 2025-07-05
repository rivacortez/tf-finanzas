"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { routesConfig } from "@/lib/config/routes";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const firstName = formData.get("first_name")?.toString();
  const lastName = formData.get("last_name")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    redirect(`/sign-up?type=error&message=${encodeURIComponent("Email y contraseña son requeridos")}`);
  }

  if (password.length < 8) {
    redirect(`/sign-up?type=error&message=${encodeURIComponent("La contraseña debe tener al menos 8 caracteres")}`);
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        first_name: firstName || '',
        last_name: lastName || '',
        username: email.split('@')[0],
      }
    },
  });

  if (error) {
    console.error(`${error.code} ${error.message}`);
    let errorMessage = "Error al crear la cuenta";
    
    if (error.message.includes('already registered')) {
      errorMessage = "Este email ya está registrado";
    } else if (error.message.includes('invalid email')) {
      errorMessage = "Email inválido";
    } else if (error.message.includes('weak password')) {
      errorMessage = "La contraseña es muy débil";
    }
    
    redirect(`/sign-up?type=error&message=${encodeURIComponent(errorMessage)}`);
  }
  
  redirect(`/sign-up?type=success&message=${encodeURIComponent("¡Registro exitoso! Revisa tu email para verificar tu cuenta.")}`);
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
    console.error('Sign in error:', error);
    let errorMessage = "Error al iniciar sesión";
    
    if (error.message.includes('Invalid login credentials')) {
      errorMessage = "Credenciales incorrectas. Verifica tu email y contraseña.";
    } else if (error.message.includes('Email not confirmed')) {
      errorMessage = "Confirma tu email antes de iniciar sesión.";
    } else if (error.message.includes('Too many requests')) {
      errorMessage = "Demasiados intentos. Intenta más tarde.";
    }
    
    redirect(`/sign-in?type=error&message=${encodeURIComponent(errorMessage)}`);
  }

  redirect(routesConfig.public.home.path, RedirectType.push);
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