import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Plus } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

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

  // Obtener bonos del usuario
  const { data: bonos } = await supabase
    .from('bonos')
    .select('*')
    .eq('usuario_id', user.id)
    .order('fecha_emision', { ascending: false });

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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear Bono
            </Button>
          </Link>
        </div>

        {bonos && bonos.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Bonos Registrados</CardTitle>
              <CardDescription>
                Lista de todos tus bonos con sus detalles principales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo de Tasa</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Tasa de Interés</TableHead>
                    <TableHead>Plazo (días)</TableHead>
                    <TableHead>Fecha de Emisión</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bonos.map((bono) => (
                    <TableRow key={bono.id_bono}>
                      <TableCell className="font-medium">
                        {bono.tipo_tasa}
                      </TableCell>
                      <TableCell>
                        ${bono.monto.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {bono.tasa_interes}%
                      </TableCell>
                      <TableCell>
                        {bono.plazo}
                      </TableCell>
                      <TableCell>
                        {new Date(bono.fecha_emision).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Link href={`/bonds/${bono.id_bono}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
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
              <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No tienes bonos registrados</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Comienza creando tu primer bono para empezar a gestionar tus inversiones
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/bonds/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primer Bono
                  </Button>
                </Link>
                <Link href="/simulator">
                  <Button variant="outline">
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
