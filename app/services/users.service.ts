/* File: app/services/users.service.ts */
import { createClient } from "@/utils/supabase/client";
import { Profile, Role } from "@/app/auth/interfaces/User";

export class UsersService {
  private supabase = createClient();

  // Obtener perfil por ID
  async getProfileById(userId: string): Promise<Profile | null> {
    
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
          hint: error.hint,
        });
        return null;
      }

      if (!data) {
        console.log("No profile found for user ID:", userId);
        return null;
      }

      console.log("Profile found:", data);
      return data;
    }

  // Crear o actualizar perfil
  async upsertProfile(profile: Omit<Profile, "created_at">): Promise<Profile | null> {
   
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
   
  }

  // Actualizar perfil
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
  
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
    
  }

  // Obtener todos los roles
  async getRoles(): Promise<Role[]> {
   
      const { data, error } = await this.supabase
        .from('roles')
        .select('*');

      if (error) {
        console.error("Error getting roles:", error);
        return [];
      }

      return data || [];
   
  }

  // Obtener roles de un usuario
  async getUserRoles(userId: string): Promise<Role[]> {
    
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
        data?.flatMap((item: { roles: Role[] }) => item.roles) || []
      );
    
    
  }

  // Asignar rol a usuario
  async assignRoleToUser(userId: string, roleId: string): Promise<boolean> {
    
      const { error } = await this.supabase
        .from('users_roles')
        .upsert([{ user_id: userId, role_id: roleId }]);

      if (error) {
        console.error("Error assigning role:", error);
        return false;
      }

      return true;
    
  }

  // Remover rol de usuario
  async removeRoleFromUser(userId: string, roleId: string): Promise<boolean> {
   
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
    
  }

  // Verificar si un usuario tiene un rol específico
  async userHasRole(userId: string, roleName: string): Promise<boolean> {
  
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
    
  }

  // Obtener perfil completo con roles
  async getCompleteProfile(userId: string) {
   
      const [profile, roles] = await Promise.all([
        this.getProfileById(userId),
        this.getUserRoles(userId),
      ]);

      return { profile, roles };
    
  }
}
