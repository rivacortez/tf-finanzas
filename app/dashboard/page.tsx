import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Calculator, File, TrendingUp, Book, PlusCircle } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: " Finanzas | Dashboard",
  description: "Panel principal de  Finanzas para la gestión de bonos",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  // Por ahora, no consultamos la base de datos hasta que se configuren las políticas RLS
  const profile = null;
  const bonos = null;
  const bonosCount = 0;

  return (
    <Navbar>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bienvenido, {user.email?.split('@')[0]}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona tus bonos financieros y accede a todas las funcionalidades del sistema
          </p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Bonos
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bonosCount || 0}</div>
              <p className="text-xs text-muted-foreground">
                Bonos registrados en tu cuenta
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Valor Total
              </CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">
                Valor total de tus bonos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tasa Promedio
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">
                Tasa de interés promedio
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/bonds/create">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="text-center">
                  <PlusCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Crear Bono</CardTitle>
                  <CardDescription>
                    Registra un nuevo bono en el sistema
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/simulator">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="text-center">
                  <Calculator className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Simulador</CardTitle>
                  <CardDescription>
                    Simula el comportamiento de bonos
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/bonds">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="text-center">
                  <File className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Mis Bonos</CardTitle>
                  <CardDescription>
                    Ve todos tus bonos registrados
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/documentation">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="text-center">
                  <Book className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Documentación</CardTitle>
                  <CardDescription>
                    Aprende cómo usar el sistema
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>

        {/* Bonos recientes */}
        {bonos && bonos.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Bonos Recientes
              </h2>
              <Link href="/bonds">
                <Button variant="outline">Ver todos</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bonos.slice(0, 3).map((bono) => (
                <Card key={bono.id_bono}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Bono - {bono.tipo_tasa}
                    </CardTitle>
                    <CardDescription>
                      Monto: ${bono.monto.toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Tasa:</span>
                        <span className="text-sm font-medium">{bono.tasa_interes}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Plazo:</span>
                        <span className="text-sm font-medium">{bono.plazo} días</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Emisión:</span>
                        <span className="text-sm font-medium">
                          {new Date(bono.fecha_emision).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/bonds/${bono.id_bono}`} className="w-full">
                      <Button className="w-full" variant="outline">
                        Ver detalles
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Si no hay bonos */}
        {(!bonos || bonos.length === 0) && (
          <Card className="text-center py-12">
            <CardContent>
              <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No tienes bonos registrados</h3>
              <p className="text-muted-foreground mb-6">
                Comienza creando tu primer bono o usando el simulador
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/bonds/create">
                  <Button>Crear Bono</Button>
                </Link>
                <Link href="/simulator">
                  <Button variant="outline">Usar Simulador</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Navbar>
  );
}
