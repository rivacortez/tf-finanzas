import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Calculator, File, TrendingUp, Book, Shield, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "EduBono | Dashboard",
  description: "Panel principal de EduBono para la gestión de bonos educativos",
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard EduBono
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestiona tus bonos educativos y accede a todas las funcionalidades del sistema
        </p>
      </div>

      {/* Banner principal */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Bienvenido al Sistema EduBono
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl">
              Simula, configura y gestiona bonos educativos con el método francés vencido ordinario.
              Accede a todas las herramientas financieras desde un solo lugar.
            </p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 text-white">
            <Link href="/simulator">
              Comenzar simulación
            </Link>
          </Button>
        </div>
      </div>

      {/* Tarjetas de acceso rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card className="border-primary/20 transition-all hover:shadow-md hover:border-primary/40">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">Simulador de Bonos</CardTitle>
              <Calculator className="h-5 w-5 text-primary" />
            </div>
            <CardDescription>
              Calcula cuotas y cronogramas
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Simula bonos educativos con diferentes parámetros usando el método francés.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/simulator">Acceder</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-blue-200 dark:border-blue-900/30 transition-all hover:shadow-md hover:border-blue-400">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">Mis Bonos</CardTitle>
              <File className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <CardDescription>
              Gestiona tus bonos activos
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Visualiza y administra todos tus bonos educativos desde un solo lugar.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/bonds-management">Acceder</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-green-200 dark:border-green-900/30 transition-all hover:shadow-md hover:border-green-400">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">Análisis Financiero</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <CardDescription>
              Revisa indicadores y reportes
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Analiza el rendimiento de tus bonos con indicadores financieros detallados.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/analytics">Acceder</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Secciones principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Actividad reciente */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Actividad reciente</h2>
            <Button variant="ghost" size="sm" className="text-primary">Ver todo</Button>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4 flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-4">
                <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Simulación de bono educativo</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">S/ 15,000 a 24 meses - Tasa: 12.5%</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Hace 2 horas</p>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4 flex items-start">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-4">
                <File className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Bono educativo creado</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">US$ 8,000 a 36 meses - TCEA: 14.25%</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Hace 1 día</p>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4 flex items-start">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full mr-4">
                <CalendarDays className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Pago de cuota registrado</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Bono #2023-005 - Cuota 3 de 24</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Hace 3 días</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recursos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recursos y documentación</h2>
            <Button variant="ghost" size="sm" className="text-primary">Ver todo</Button>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4 flex items-start">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-4">
                <Book className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Guía del método francés</p>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">Descargar</Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Documento con explicación detallada sobre el método de amortización francés vencido.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4 flex items-start">
              <div className="bg-teal-100 dark:bg-teal-900/30 p-2 rounded-full mr-4">
                <Shield className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Normativa SBS aplicable</p>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">Descargar</Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Resoluciones y circulares de la SBS que regulan los bonos educativos.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4 flex items-start">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-4">
                <Users className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Casos prácticos</p>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">Descargar</Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ejemplos de bonos educativos en diversos escenarios de financiamiento.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 