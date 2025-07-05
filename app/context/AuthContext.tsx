"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Profile } from "@/app/auth/interfaces/User";

// Definición del contexto de autenticación
type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  error: null,
  refreshUser: async () => {},
});



export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Obtiene el perfil desde Supabase\  
  const fetchProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();
        if (error) {
          throw error;
        }
        return data;
      } catch (_error) {
        console.error("Error al cargar perfil:", _error);
        setError("No se pudo cargar el perfil.");
        return null;
      }
    },
    [supabase]
  );

  // Refresca la sesión y el perfil de usuario
  const refreshUser = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }

      const sessionUser = data?.session?.user;
      if (sessionUser) {
        setUser(sessionUser);
        const profileData = await fetchProfile(sessionUser.id);
        setProfile(profileData);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (_error) {
      console.error("Error al refrescar usuario:", _error);
      setUser(null);
      setProfile(null);
      setError("No se pudo cargar la sesión.");
    } finally {
      setLoading(false);
    }
  }, [supabase, fetchProfile]);

  useEffect(() => {
    void refreshUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        setUser(session.user);
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [refreshUser, fetchProfile, supabase.auth]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = (): AuthContextType => useContext(AuthContext);
