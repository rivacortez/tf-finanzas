import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

// Función para debuggear la información del usuario autenticado
export const debugUserProfile = async () => {
  const supabase = createClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("❌ Error obteniendo usuario:", error);
      return null;
    }
    
    if (!user) {
      console.log("ℹ️ No hay usuario autenticado");
      return null;
    }
    
    console.log("🔍 === DEBUG PERFIL DE USUARIO ===");
    console.log("📧 Email:", user.email);
    console.log("🆔 ID:", user.id);
    console.log("🏷️ Provider:", user.app_metadata?.provider);
    console.log("📅 Creado:", user.created_at);
    console.log("📅 Última vez visto:", user.last_sign_in_at);
    
    console.log("\n👤 === METADATOS DEL USUARIO ===");
    console.log("📋 user_metadata completo:", user.user_metadata);
    
    if (user.user_metadata) {
      console.log("🖼️ Avatar URL:", user.user_metadata.avatar_url);
      console.log("🖼️ Picture:", user.user_metadata.picture);
      console.log("📛 Nombre completo:", user.user_metadata.full_name);
      console.log("📛 Nombre:", user.user_metadata.name);
      console.log("📛 Nombre de usuario:", user.user_metadata.user_name);
      console.log("✅ Email verificado:", user.user_metadata.email_verified);
    }
    
    console.log("\n🔧 === INFORMACIÓN TÉCNICA ===");
    console.log("📋 app_metadata completo:", user.app_metadata);
    
    return user;
  } catch (error) {
    console.error("💥 Error inesperado:", error);
    return null;
  }
};

// Hook para usar en componentes React
export const useUserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    debugUserProfile().then(userData => {
      setUser(userData);
      setLoading(false);
    });
  }, []);
  
  return { user, loading };
};
