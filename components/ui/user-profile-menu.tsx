import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserProfileMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        // Debug: Log user metadata para ver qué información tenemos
        if (user?.user_metadata) {
          console.log("🔍 User metadata:", user.user_metadata);
          console.log("🖼️ Avatar sources:");
          console.log("  - avatar_url:", user.user_metadata.avatar_url);
          console.log("  - picture:", user.user_metadata.picture);
          console.log("  - avatar:", user.user_metadata.avatar);
          console.log("  - image:", user.user_metadata.image);
          console.log("  - photo:", user.user_metadata.photo);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setImageError(false); // Reset image error on auth change
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    );
  }

  if (!user) {
    return null;
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    const name = getUserName();
    if (name && name !== "Usuario") {
      // Si tiene nombre, usar las primeras letras de las palabras
      const words = name.split(" ");
      if (words.length >= 2) {
        return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
      }
      return name.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Obtener nombre del usuario para mostrar junto al avatar
  const getUserName = () => {
    return (
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.user_name ||
      user.email?.split("@")[0] ||
      "Usuario"
    );
  };

  // Obtener la URL del avatar con mejores fallbacks para Google
  const getAvatarUrl = () => {
    if (!user?.user_metadata) return null;
    
    const metadata = user.user_metadata;
    
    // Priorizar avatar_url de Google
    if (metadata.avatar_url) return metadata.avatar_url;
    
    // Luego picture (campo común en OAuth de Google)
    if (metadata.picture) return metadata.picture;
    
    // Otros posibles campos
    if (metadata.avatar) return metadata.avatar;
    if (metadata.image) return metadata.image;
    if (metadata.photo) return metadata.photo;
    
    return null;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded-lg transition-colors">
          <Avatar className="size-8 cursor-pointer border-2 border-transparent hover:border-primary-200 transition-all">
            <AvatarImage 
              src={!imageError ? getAvatarUrl() : undefined} 
              alt={`Foto de perfil de ${getUserName()}`}
              className="object-cover"
              onError={() => {
                console.log("❌ Error loading avatar image, falling back to initials");
                setImageError(true);
              }}
              onLoad={() => {
                console.log("✅ Avatar image loaded successfully");
                setImageError(false);
              }}
            />
            <AvatarFallback className="bg-primary-500 text-white text-sm font-medium">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {/* Mostrar nombre si está disponible */}
          <span className="hidden sm:inline text-sm font-medium text-foreground max-w-[120px] truncate">
            {getUserName()}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center space-x-3">
            <Avatar className="size-10">
              <AvatarImage 
                src={!imageError ? getAvatarUrl() : undefined} 
                alt={`Foto de perfil de ${getUserName()}`}
                className="object-cover"
                onError={() => setImageError(true)}
              />
              <AvatarFallback className="bg-primary-500 text-white">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 flex-1 min-w-0">
              <p className="text-sm font-medium leading-none truncate">{getUserName()}</p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer flex items-center"
          onClick={() => router.push('/profile')}
        >
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Mi perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer flex items-center"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}