import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, Landmark } from "lucide-react";

export default function SimulatorIndexPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Simuladores Financieros</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="mr-2" /> 
              Bonos Clásicos
            </CardTitle>
            <CardDescription>
              Simula bonos con diversas opciones y periodos de gracia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Calcula cronogramas de pago para bonos con método tradicional, 
              incluyendo opciones de periodo de gracia y distintos tipos de tasas.</p>
          </CardContent>
          <CardFooter>
            <Link href="/simulator" className="w-full">
              <Button variant="default" className="w-full">
                Ir al simulador
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2" /> 
              Bono Corporativo - Método Francés
            </CardTitle>
            <CardDescription>
              Simulación de bonos corporativos con el método francés e indexación por inflación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Calcula bonos corporativos con ajuste por inflación, 
              escudo fiscal y análisis de ratios como duración y convexidad.</p>
          </CardContent>
          <CardFooter>
            <Link href="/simulator/bono-frances" className="w-full">
              <Button variant="default" className="w-full">
                Ir al simulador
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Landmark className="mr-2" /> 
              Préstamos Bancarios
            </CardTitle>
            <CardDescription>
              Próximamente: Simulador de préstamos bancarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Herramienta para calcular préstamos bancarios con distintas 
              opciones de amortización y evaluación de capacidad de pago.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Próximamente
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
