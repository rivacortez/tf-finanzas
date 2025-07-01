import { useState, useEffect } from 'react';
import { UsersService } from '@/app/services/users.service';
import { Profile, Role } from '@/app/auth/interfaces/User';
import { useAuth } from '@/app/context/AuthContext';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const usersService = new UsersService();

  const fetchUserProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await usersService.getCompleteProfile(user.id);
      
      if (data) {
        setProfile(data.profile);
        setRoles(data.roles);
      }
    } catch (err) {
      setError('Error al cargar el perfil');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return null;
    
    try {
      const updatedProfile = await usersService.updateProfile(user.id, updates);
      
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
      
      return updatedProfile;
    } catch (err) {
      setError('Error al actualizar el perfil');
      console.error(err);
      return null;
    }
  };

  const hasRole = (roleName: string): boolean => {
    return roles.some(role => role.role === roleName);
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  return {
    profile,
    roles,
    loading,
    error,
    updateProfile,
    hasRole,
    isAdmin,
    refetch: fetchUserProfile
  };
};
