 "use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {  AlertTriangle } from "lucide-react";
import { generatePaymentSchedule, BondParams, PaymentRow, Indicators } from "@/lib/finance/bond-calculator";
import PaymentSchedule from "./payment-schedule";
import FinancialIndicators from "./financial-indicators";
import SbsCompliance from "./sbs-compliance";

interface BondCalculatorProps {
  bondParams: BondParams;
}

export default function BondCalculator({ bondParams }: BondCalculatorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("schedule");
  const [calculationResult, setCalculationResult] = useState<{
    schedule: PaymentRow[];
    indicators: Indicators;
  } | null>(null);

  useEffect(() => {
    try {
      // Log de entrada de parámetros
      // eslint-disable-next-line no-console
      console.log("[BondCalculator] Parámetros recibidos:", bondParams);
      setLoading(true);
      setTimeout(() => {
        // Log antes del cálculo
        // eslint-disable-next-line no-console
        console.log("[BondCalculator] Iniciando cálculo de cronograma...");
        const result = generatePaymentSchedule(bondParams);
        // Log después del cálculo
        // eslint-disable-next-line no-console
        console.log("[BondCalculator] Resultado del cálculo:", result);
        setCalculationResult(result);
        setLoading(false);
      }, 1000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[BondCalculator] Error al calcular el cronograma:", err);
      setError("Ocurrió un error al calcular el cronograma de pagos. Por favor, verifica los parámetros e intenta nuevamente.");
      setLoading(false);
    }
  }, [bondParams]);

  // Si está cargando
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Calculando cronograma de pagos...</p>
      </div>
    );
  }

  // Si hay un error
  if (error || !calculationResult) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error de cálculo</AlertTitle>
        <AlertDescription>
          {error || "No se pudo generar el cronograma de pagos. Verifica los parámetros e intenta nuevamente."}
        </AlertDescription>
      </Alert>
    );
  }

  const { schedule, indicators } = calculationResult;

  return (
    <div className="space-y-6">
      {/* Resumen del bono */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle>Resumen del Bono </CardTitle>
          <CardDescription>
            Parámetros configurados para la simulación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Monto del Bono</h3>
              <p className="text-lg font-semibold">
                {bondParams.currency === "PEN" ? "S/ " : "US$ "}
                {bondParams.amount.toLocaleString("es-PE")}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Plazo</h3>
              <p className="text-lg font-semibold">{bondParams.term} meses</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasa de Interés</h3>
              <p className="text-lg font-semibold">
                {bondParams.rateValue}% {bondParams.rateType === "effective" ? "TEA" : "TNA"}
                {bondParams.rateType === "nominal" && bondParams.capitalization && (
                  <span className="text-sm text-gray-500 ml-1">
                    (Cap. {bondParams.capitalization === "monthly" ? "mensual" :
                      bondParams.capitalization === "bimonthly" ? "bimestral" :
                      bondParams.capitalization === "quarterly" ? "trimestral" :
                      bondParams.capitalization === "biannual" ? "semestral" : "anual"})
                  </span>
                )}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Período de Gracia</h3>
              <p className="text-lg font-semibold">
                {bondParams.graceType === "none" ? "Sin período de gracia" :
                 `${bondParams.gracePeriod} meses (${bondParams.graceType === "total" ? "Total" : "Parcial"})`}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de Inicio</h3>
              <p className="text-lg font-semibold">
                {new Date(bondParams.startDate).toLocaleDateString("es-PE")}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Adicionales</h3>
              <p className="text-lg font-semibold">
                {bondParams.insurance && bondParams.commission ? "Seguro y comisiones" :
                 bondParams.insurance ? "Seguro de desgravamen" :
                 bondParams.commission ? "Comisiones" : "Sin adicionales"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pestañas para mostrar diferentes vistas */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="schedule">Cronograma de Pagos</TabsTrigger>
          <TabsTrigger value="indicators">Indicadores Financieros</TabsTrigger>
          <TabsTrigger value="compliance">Cumplimiento SBS</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <PaymentSchedule schedule={schedule} currency={bondParams.currency} />
        </TabsContent>

        <TabsContent value="indicators">
          <FinancialIndicators indicators={indicators} />
        </TabsContent>

        <TabsContent value="compliance">
          <SbsCompliance bondParams={bondParams} />
        </TabsContent>
      </Tabs>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
        <Button variant="outline" onClick={() => router.push("/simulator")}>
          Volver al Simulador
        </Button>
        <Button variant="outline">
          Descargar PDF
        </Button>
        <Button>
          Guardar Bono
        </Button>
      </div>
    </div>
  );
}