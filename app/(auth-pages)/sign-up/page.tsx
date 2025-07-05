import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { GoogleSignInButton } from "@/app/auth/components/google-sign-in-button";
import { signUpAction } from "@/app/actions";
import { Lock, Mail, TrendingUp, User, Shield, CheckCircle } from "lucide-react";

export default async function Signup(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Panel izquierdo - Información */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">BonoCorp</h1>
                <p className="text-slate-600 dark:text-slate-400">Gestión inteligente de bonos</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                Únete a BonoCorp
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Crea tu cuenta y comienza a gestionar tus inversiones en bonos de manera profesional.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Gratis para empezar</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Sin costos ocultos ni compromisos</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Datos seguros</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Encriptación de nivel bancario</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Análisis avanzado</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Herramientas profesionales incluidas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho - Formulario */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto h-12 w-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
              <CardDescription>
                Completa tus datos para comenzar
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Botón de Google */}
              <GoogleSignInButton />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">
                    O regístrate con email
                  </span>
                </div>
              </div>

              {/* Formulario */}
              <form action={signUpAction} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-sm font-medium">
                      Nombre
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="first_name"
                        name="first_name"
                        type="text"
                        required
                        className="pl-10 h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400"
                        placeholder="Juan"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-sm font-medium">
                      Apellido
                    </Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      required
                      className="h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400"
                      placeholder="Pérez"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Correo electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="pl-10 h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400"
                      placeholder="tu@ejemplo.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="pl-10 h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400"
                      placeholder="••••••••"
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Mínimo 8 caracteres
                  </p>
                </div>

                <SubmitButton
                  pendingText="Creando cuenta..."
                  className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Crear Cuenta
                </SubmitButton>

                <FormMessage message={searchParams} />
              </form>

              <div className="text-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">¿Ya tienes cuenta? </span>
                <Link
                  href="/sign-in"
                  className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Iniciar sesión
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Al crear tu cuenta, aceptas nuestros{" "}
            <Link href="#" className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
              Términos de Servicio
            </Link>{" "}
            y{" "}
            <Link href="#" className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
