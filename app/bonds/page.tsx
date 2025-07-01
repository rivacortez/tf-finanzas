import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Plus } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
<<<<<<< HEAD
    <Navbar>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Mis Bonos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestiona y visualiza todos tus bonos registrados
=======
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mis Bonos Educativos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona todos tus bonos educativos en un solo lugar
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <Button asChild className="bg-primary hover:bg-primary/90 text-white">
            <Link href="/simulator">
              <Plus className="mr-2 h-4 w-4" /> Crear nuevo bono
            </Link>
          </Button>
        </div>
      </div>

      {/* Resumen de bonos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Bonos activos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {mockBonds.filter(bond => bond.status === "active").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Monto total financiado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                S/ {mockBonds.filter(bond => bond.currency === "PEN").reduce((sum, bond) => sum + bond.amount, 0).toLocaleString("es-PE")}
              </p>
              <p className="text-xl font-semibold text-blue-600/80 dark:text-blue-400/80">
                US$ {mockBonds.filter(bond => bond.currency === "USD").reduce((sum, bond) => sum + bond.amount, 0).toLocaleString("es-PE")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Próximo pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {
                  (() => {
                    const activeBonds = mockBonds.filter(bond => bond.status === "active" && bond.nextPayment);
                    if (activeBonds.length === 0) return "N/A";
                    activeBonds.sort((a, b) => {
                      const dateA = a.nextPayment ? new Date(a.nextPayment.split('/').reverse().join('-')).getTime() : Infinity;
                      const dateB = b.nextPayment ? new Date(b.nextPayment.split('/').reverse().join('-')).getTime() : Infinity;
                      return dateA - dateB;
                    });
                    return activeBonds[0].nextPayment;
                  })()
                }
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Bono: {
                  (() => {
                    const activeBonds = mockBonds.filter(bond => bond.status === "active" && bond.nextPayment);
                    if (activeBonds.length === 0) return "N/A";
                    activeBonds.sort((a, b) => {
                      const dateA = a.nextPayment ? new Date(a.nextPayment.split('/').reverse().join('-')).getTime() : Infinity;
                      const dateB = b.nextPayment ? new Date(b.nextPayment.split('/').reverse().join('-')).getTime() : Infinity;
                      return dateA - dateB;
                    });
                    return activeBonds[0].id;
                  })()
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Bonos completados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {mockBonds.filter(bond => bond.status === "completed").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de bonos */}
      <Card>
        <CardHeader>
          <CardTitle>Todos los bonos</CardTitle>
          <CardDescription>
            Lista completa de tus bonos educativos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Plazo</TableHead>
                <TableHead>TCEA</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBonds.map((bond) => (
                <TableRow key={bond.id}>
                  <TableCell className="font-medium">{bond.id}</TableCell>
                  <TableCell>{bond.name}</TableCell>
                  <TableCell>
                    {bond.currency === "PEN" ? "S/ " : "US$ "}
                    {bond.amount.toLocaleString("es-PE")}
                  </TableCell>
                  <TableCell>{bond.term} meses</TableCell>
                  <TableCell>{bond.tcea}%</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            bond.progress === 100 
                              ? "bg-green-500" 
                              : "bg-primary"
                          }`} 
                          style={{ width: `${bond.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {bond.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={bond.status === "active" ? "default" : "secondary"}>
                      {bond.status === "active" ? "Activo" : "Completado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" /> Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" /> Descargar cronograma
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 dark:text-red-400">
                          Reportar problema
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Información sobre tus bonos</h3>
            <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">
              Recuerda que todos tus bonos educativos están protegidos bajo la normativa de la SBS. 
              Para cualquier consulta o reclamo, puedes contactar a nuestro servicio de atención al usuario 
              al correo <span className="font-medium">soporte@edubono.pe</span> o llamar al <span className="font-medium">01-456-7890</span>.
>>>>>>> 5a6301ab6b123d35293a4806b95c620ac1b2f2cf
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
<<<<<<< HEAD
}
=======
} 
>>>>>>> 5a6301ab6b123d35293a4806b95c620ac1b2f2cf
