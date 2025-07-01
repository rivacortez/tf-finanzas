# TF Finanzas - Aplicación de Gestión de Bonos

Una aplicación moderna y elegante para la gestión de bonos financieros, construida con Next.js 14, Supabase y Tailwind CSS.

## 🚀 Características

- ✅ **Autenticación segura** con Supabase Auth (email/contraseña y Google OAuth)
- ✅ **Diseño moderno** con componentes UI de última generación
- ✅ **Modo oscuro/claro** automático
- ✅ **Gestión de bonos** completa (CRUD)
- ✅ **Simulador financiero** para análisis de bonos
- ✅ **Dashboard interactivo** con métricas en tiempo real
- ✅ **Responsivo** para móvil, tablet y desktop

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

## 📦 Instalación

1. **Clona el repositorio**
```bash
git clone <tu-repositorio>
cd tf-finanzas-app
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura las variables de entorno**
```bash
# Copia el template
cp .env.local.template .env.local

# Edita .env.local con tus credenciales de Supabase
```

4. **Configura Supabase**
   - Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
   - Ejecuta el script SQL en `database-setup-simple.sql` en el editor SQL de Supabase
   - Copia tu URL del proyecto y la clave anónima a `.env.local`

5. **Ejecuta la aplicación**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## 🔧 Configuración de Supabase

### Variables de entorno requeridas:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima
SUPABASE_SERVICE_ROLE_KEY=tu-clave-de-servicio (opcional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Configuración de autenticación OAuth (Google):

1. Ve a Authentication > Providers en tu dashboard de Supabase
2. Habilita el proveedor de Google
3. Configura las URLs de redirección:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://tu-dominio.com/auth/callback`

## 📊 Estructura de la base de datos

La aplicación utiliza las siguientes tablas principales:

- `profiles` - Perfiles de usuario
- `roles` - Roles del sistema
- `users_roles` - Relación usuario-rol
- `bonos` - Información de bonos
- `configuraciones` - Configuraciones del sistema
- `pagos` - Información de pagos
- `valoracion_bonos` - Valoraciones de bonos

## 🎨 Diseño UI/UX

### Características del diseño:

- **Gradientes modernos** con colores emerald y teal
- **Cards con backdrop blur** para un efecto glassmorphism
- **Animaciones suaves** con transiciones CSS
- **Iconos consistentes** de Lucide React
- **Typography escalable** con Tailwind CSS
- **Layout responsive** para todas las pantallas

### Páginas principales:

- `/sign-in` - Página de inicio de sesión con diseño dividido
- `/sign-up` - Página de registro con validación en tiempo real  
- `/dashboard` - Panel principal con métricas y accesos rápidos
- `/bonds` - Gestión completa de bonos
- `/simulator` - Simulador financiero interactivo
- `/profile` - Perfil de usuario

## 🔒 Seguridad

- Row Level Security (RLS) habilitado en todas las tablas
- Autenticación JWT con Supabase
- Validación de tipos con TypeScript
- Sanitización de inputs del usuario
- Políticas de acceso granulares

## 📱 Responsive Design

La aplicación está optimizada para:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

Con breakpoints específicos de Tailwind CSS para una experiencia fluida.

## 🚦 Estados de la aplicación

- **Loading states** con skeletons y spinners
- **Error boundaries** para manejo de errores
- **Empty states** con call-to-actions claros
- **Success feedback** con toast notifications

## 📈 Próximas funcionalidades

- [ ] Notificaciones push
- [ ] Exportación de reportes (PDF/Excel)
- [ ] Gráficos avanzados con Chart.js
- [ ] API pública para integraciones
- [ ] Modo offline con PWA

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

---

Hecho con ❤️ para la gestión profesional de bonos financieros.
