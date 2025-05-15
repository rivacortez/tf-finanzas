"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon, HelpCircle } from "lucide-react";

// Tipo para los indicadores financieros
type Indicators = {
  tcea: number;
  trea: number;
  duration: number;
  modifiedDuration: number;
  convexity: number;
};

interface FinancialIndicatorsProps {
  indicators: Indicators | null;
}

export default function FinancialIndicators({ indicators }: FinancialIndicatorsProps) {
  if (!indicators) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600 dark:text-gray-400">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* TCEA */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">TCEA</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>Tasa de Costo Efectivo Anual. Representa el costo total del bono incluyendo intereses, comisiones y gastos.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription>Costo total anualizado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{indicators.tcea.toFixed(2)}%</p>
          </CardContent>
        </Card>

        {/* TREA */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">TREA</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>Tasa de Rendimiento Efectivo Anual. Representa el rendimiento para el inversionista del bono.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription>Rendimiento para el inversionista</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600 dark:text-green-500">{indicators.trea.toFixed(2)}%</p>
          </CardContent>
        </Card>

        {/* Duración de Macaulay */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Duración</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>La duración de Macaulay mide el tiempo promedio ponderado en que se recupera la inversión.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription>Tiempo promedio de recuperación</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{indicators.duration.toFixed(2)} años</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sensitivity" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="sensitivity">Sensibilidad a tasas</TabsTrigger>
          <TabsTrigger value="formulas">Fórmulas de cálculo</TabsTrigger>
        </TabsList>
        
        {/* Pestaña de Sensibilidad */}
        <TabsContent value="sensitivity">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Duración Modificada */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Duración Modificada</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p>Mide la sensibilidad del precio del bono a cambios en la tasa de interés. Indica el cambio porcentual del precio ante una variación de 1% en la tasa.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <CardDescription>Sensibilidad a cambios en tasas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Valor:</span>
                  <span className="text-lg font-semibold">{indicators.modifiedDuration.toFixed(4)}</span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Interpretación:</p>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm">Un aumento de 1% en la tasa causaría una disminución aproximada del <span className="font-bold text-red-500">{(indicators.modifiedDuration * 1).toFixed(2)}%</span> en el valor del bono.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Convexidad */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Convexidad</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p>Mide la curvatura de la relación precio-rendimiento. Complementa a la duración modificada para cambios grandes en tasas de interés.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <CardDescription>Corrección a la estimación lineal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Valor:</span>
                  <span className="text-lg font-semibold">{indicators.convexity.toFixed(4)}</span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Interpretación:</p>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm">La convexidad corrige la estimación de la duración modificada, especialmente para grandes cambios en las tasas de interés.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Pestaña de Fórmulas */}
        <TabsContent value="formulas">
          <Card>
            <CardHeader>
              <CardTitle>Fórmulas para el cálculo de indicadores</CardTitle>
              <CardDescription>
                Principales ecuaciones utilizadas en la evaluación del bono
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">TCEA (Tasa de Costo Efectivo Anual)</h3>
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-center font-mono">P = Σ FCt / (1 + TCEA)^(t/365)</p>
                  <p className="text-sm mt-2">
                    Donde P es el monto del préstamo, FCt son los flujos de caja (pagos) en el tiempo t.
                    Se calcula igualando el valor presente de todos los flujos futuros con el monto del préstamo.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Duración de Macaulay</h3>
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-center font-mono">D = Σ [ t * (FCt / (1+i)^t) ] / P</p>
                  <p className="text-sm mt-2">
                    Donde t es el tiempo en años, FCt es el flujo de caja en el tiempo t,
                    i es la tasa de interés y P es el precio o valor presente de los flujos.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Duración Modificada</h3>
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-center font-mono">DM = D / (1 + i)</p>
                  <p className="text-sm mt-2">
                    Donde D es la duración de Macaulay e i es la tasa de interés.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Convexidad</h3>
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-center font-mono">C = (1/P) * Σ [ FCt * t * (t+1) / (1+i)^(t+2) ]</p>
                  <p className="text-sm mt-2">
                    Donde FCt es el flujo de caja en el tiempo t, i es la tasa de interés y P es el precio del bono.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 