"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navbar } from "@/components/ui/navbar";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone_number: profile.phone_number || '',
        address: profile.address || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      const updatedProfile = await updateProfile(formData);
      if (updatedProfile) {
        toast.success('Perfil actualizado correctamente');
        setIsEditing(false);
      } else {
        toast.error('Error al actualizar el perfil');
      }
    } catch (error) {
      toast.error('Error al actualizar el perfil');
      console.error(error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone_number: profile.phone_number || '',
        address: profile.address || ''
      });
    }
    setIsEditing(false);
  };

  if (authLoading || profileLoading) {
    return (
      <Navbar>
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Navbar>
    );
  }

  return (
    <Navbar>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mi Perfil
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información básica */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Actualiza tu información personal y de contacto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Nombre de usuario</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">Nombre</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Apellido</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone_number">Teléfono</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={handleCancel}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSave}>
                        Guardar cambios
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      Editar perfil
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar con información adicional */}
          <div className="space-y-6">
            {/* Avatar y info básica */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-lg">
                      {profile?.first_name?.[0] || profile?.username?.[0] || user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">
                    {profile?.first_name && profile?.last_name 
                      ? `${profile.first_name} ${profile.last_name}`
                      : profile?.username || user?.email?.split('@')[0]
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Información de cuenta */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información de Cuenta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Correo verificado</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.email_confirmed_at ? 'Sí' : 'No'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Miembro desde</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">ID de usuario</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {user?.id?.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Navbar>
  );
}
