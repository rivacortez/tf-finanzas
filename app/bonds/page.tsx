import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Plus, TrendingUp, Calculator, DollarSign } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Bono } from "@/app/core/interfaces/Bono";

export const metadata: Metadata = {
  title: "TF Finanzas | Mis Bonos",
  description: "Gestión de bonos financieros",
};

export default async function BondsPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  // Obtener bonos del usuario (por ahora usamos datos mock)
  const bonos: Bono[] = [];

  return (
    <Navbar>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Mis Bonos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestiona y visualiza todos tus bonos registrados
            </p>
          </div>
          <Link href="/bonds/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Crear Bono
            </Button>
          </Link>
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
              <div className="text-2xl font-bold">{bonos.length}</div>
              <p className="text-xs text-muted-foreground">
                Bonos en tu cartera
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Valor Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">S/ 0</div>
              <p className="text-xs text-muted-foreground">
                Valor total de la cartera
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tasa Promedio
              </CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">
                Rentabilidad promedio
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de bonos */}
        {bonos && bonos.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Bonos Registrados</CardTitle>
              <CardDescription>
                Lista completa de tus bonos con sus detalles principales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha de Emisión</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Tasa</TableHead>
                    <TableHead>Plazo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bonos.map((bono) => (
                    <TableRow key={bono.id_bono}>
                      <TableCell>
                        {new Date(bono.fecha_emision).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        S/ {bono.monto.toLocaleString()}
                      </TableCell>
                      <TableCell>{bono.tasa_interes}%</TableCell>
                      <TableCell>{bono.plazo} meses</TableCell>
                      <TableCell className="capitalize">{bono.tipo_tasa}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          activo
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/bonds/${bono.id_bono}`}>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Eye className="h-4 w-4" />
                            Ver
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No tienes bonos registrados</h3>
              <p className="text-muted-foreground mb-6">
                Comienza creando tu primer bono o usando el simulador para calcular rentabilidades
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/bonds/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Bono
                  </Button>
                </Link>
                <Link href="/simulator">
                  <Button variant="outline">
                    <Calculator className="h-4 w-4 mr-2" />
                    Usar Simulador
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Navbar>
  );
}
