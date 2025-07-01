# 🚀 Guía de Configuración: Registro y Login Funcional

## ✅ Mejoras Implementadas

### 🔐 **Autenticación Mejorada**

1. **Registro (Sign-up) mejorado**:
   - ✅ Captura nombre y apellido
   - ✅ Validación de contraseña (mínimo 8 caracteres)
   - ✅ Mensajes de error específicos en español
   - ✅ Almacenamiento de datos en `user_metadata`

2. **Login (Sign-in) mejorado**:
   - ✅ Validación de credenciales
   - ✅ Mensajes de error específicos en español
   - ✅ Redirección automática al dashboard

3. **Componentes UI mejorados**:
   - ✅ FormMessage con íconos y colores
   - ✅ SubmitButton con spinner de carga
   - ✅ Diseño moderno y responsivo

### 🛠️ **Para que funcione completamente:**

## 📋 Pasos de Configuración

### 1. **Configurar Supabase**

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
2. En tu proyecto, ve a **Settings > API**
3. Copia estos valores:
   - **URL del proyecto**: `https://tu-proyecto.supabase.co`
   - **anon/public key**: La clave pública

### 2. **Actualizar variables de entorno**

Edita el archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-real
SUPABASE_SERVICE_ROLE_KEY=tu-clave-de-servicio-real
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

### 3. **Configurar Base de Datos**

En el **SQL Editor** de Supabase, ejecuta:

```sql
-- 1. Crear tabla de roles básicos
INSERT INTO roles (id, role) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'admin'),
  ('550e8400-e29b-41d4-a716-446655440002', 'user')
ON CONFLICT (id) DO NOTHING;

-- 2. Función para crear automáticamente un perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, first_name, last_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  
  -- Asignar rol de usuario por defecto
  INSERT INTO public.users_roles (user_id, role_id)
  VALUES (new.id, '550e8400-e29b-41d4-a716-446655440002');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger para ejecutar la función
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Políticas RLS permisivas para testing
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON profiles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on id" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### 4. **Configurar URLs de redirección**

En Supabase, ve a **Authentication > URL Configuration**:

- **Site URL**: `http://localhost:3002`
- **Redirect URLs**: `http://localhost:3002/auth/callback`

## 🧪 **Pruebas**

Una vez configurado:

1. **Registro nuevo usuario**:
   - Ve a `http://localhost:3002/sign-up`
   - Completa el formulario
   - Verifica tu email
   - Serás redirigido al dashboard

2. **Login usuario existente**:
   - Ve a `http://localhost:3002/sign-in`
   - Ingresa credenciales
   - Serás redirigido al dashboard

## 🎨 **Características del Diseño**

- **Layout split-screen** profesional
- **Gradientes modernos** emerald/teal
- **Iconografía consistente** con Lucide React
- **Mensajes de error** claros y en español
- **Modo oscuro/claro** automático
- **Responsive design** para móvil/desktop

## 🐛 **Solución de Problemas**

### Error: "Invalid login credentials"
- Verifica que el email esté confirmado
- Revisa que la contraseña sea correcta

### Error: "Este email ya está registrado"
- Usa el formulario de login en su lugar
- O usa "¿Olvidaste tu contraseña?"

### Error de redirección
- Verifica las URLs en Supabase
- Asegúrate de que `.env.local` esté configurado

## 📱 **Próximos Pasos**

1. Configurar Google OAuth (opcional)
2. Personalizar email templates en Supabase
3. Agregar validación de formularios más robusta
4. Implementar "Recordarme" en login

---

La aplicación está lista para usar una vez que configures las credenciales de Supabase! 🎉
