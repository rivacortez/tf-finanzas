import { createClient } from "@/utils/supabase/client";
import { Profile, Role } from "@/app/auth/interfaces/User";

export class UsersService {
  private supabase = createClient();

  // Obtener perfil por ID
  async getProfileById(userId: string): Promise<Profile | null> {
    try {
      console.log("Fetching profile for user ID:", userId);

      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("Error getting profile:", {
          message: error.message,
          details: error.details,
          code: error.code,
          hint: error.hint
        });
        return null;
      }

      if (!data) {
        console.log("No profile found for user ID:", userId);
        return null;
      }

      console.log("Profile found:", data);
      return data;
    } catch (error) {
      console.error("Unexpected error getting profile:", error);
      return null;
    }
  }

  // Crear o actualizar perfil
  async upsertProfile(profile: Omit<Profile, "created_at">): Promise<Profile | null> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .upsert([profile])
        .select()
        .single();

      if (error) {
        console.error("Error upserting profile:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error upserting profile:", error);
      return null;
    }
  }

  // Actualizar perfil
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      return null;
    }
  }

  // Obtener todos los roles
  async getRoles(): Promise<Role[]> {
    try {
      const { data, error } = await this.supabase
        .from('roles')
        .select('*');

      if (error) {
        console.error("Error getting roles:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error getting roles:", error);
      return [];
    }
  }

  // Obtener roles de un usuario
  async getUserRoles(userId: string): Promise<Role[]> {
    try {
      const { data, error } = await this.supabase
        .from('users_roles')
        .select(`
          roles (
            id,
            role
          )
        `)
        .eq('user_id', userId);

      if (error) {
        console.error("Error getting user roles:", error);
        return [];
      }

      return (
        data?.flatMap((item: { roles: { id: string; role: string }[] }) =>
          (item.roles || []).map(role => ({
            id: role.id,
            role: role.role
          }))
        ) || []
      );
    } catch (error) {
      console.error("Error getting user roles:", error);
      return [];
    }
  }

  // Asignar rol a usuario
  async assignRoleToUser(userId: string, roleId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('users_roles')
        .upsert([{ user_id: userId, role_id: roleId }]);

      if (error) {
        console.error("Error assigning role:", error);
        return false;
      }

      return true;
    } catch {
      console.error("Error assigning role:");
      return false;
    }
  }

  // Remover rol de usuario
  async removeRoleFromUser(userId: string, roleId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('users_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role_id', roleId);

      if (error) {
        console.error("Error removing role:", error);
        return false;
      }

      return true;
    } catch {
      console.error("Error removing role:");
      return false;
    }
  }

  // Verificar si un usuario tiene un rol específico
  async userHasRole(userId: string, roleName: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('users_roles')
        .select(`
          roles!inner (
            role
          )
        `)
        .eq('user_id', userId)
        .eq('roles.role', roleName)
        .single();

      if (error) {
        return false;
      }

      return !!data;
    } catch (error) {
      return false;
    }
  }

  // Obtener perfil completo con roles
  async getCompleteProfile(userId: string) {
    try {
      const [profile, roles] = await Promise.all([
        this.getProfileById(userId),
        this.getUserRoles(userId)
      ]);

      return {
        profile,
        roles
      };
    } catch {
      console.error("Error getting complete profile:");
      return null;
    }
  }
}
