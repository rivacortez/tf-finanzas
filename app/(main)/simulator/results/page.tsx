"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FinancialIndicators from "../components/financial-indicators";
import SbsCompliance from "../components/sbs-compliance";
import PaymentSchedule from "../components/payment-schedule";
import BondCalculator from "../components/bond-calculator";

// Tipo para los parámetros del bono
type BondParams = {
  amount: number;
  currency: string;
  term: number;
  rateType: string;
  rateValue: number;
  capitalization?: string;
  gracePeriod: number;
  graceType: string;
  startDate: string;
  insurance: boolean;
  commission: boolean;
};

// Tipo para las cuotas del cronograma
type PaymentRow = {
  number: number;
  date: string;
  principal: number;
  interest: number;
  insurance: number;
  commission: number;
  total: number;
  balance: number;
};

// Tipo para los indicadores financieros
type Indicators = {
  tcea: number;
  trea: number;
  duration: number;
  modifiedDuration: number;
  convexity: number;
};

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [bondParams, setBondParams] = useState<BondParams | null>(null);
  const [schedule, setSchedule] = useState<PaymentRow[]>([]);
  const [indicators, setIndicators] = useState<Indicators | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("schedule");

  // Efecto para manejar el hash de la URL y cambiar la pestaña activa
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ["schedule", "indicators", "compliance"].includes(hash)) {
        setActiveTab(hash);
      }
    };

    // Revisar el hash inicial
    handleHashChange();

    // Escuchar cambios en el hash
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    try {
      // Obtener los datos del bono de los parámetros de la URL
      const dataParam = searchParams.get("data");
      if (!dataParam) {
        throw new Error("No se encontraron datos del bono");
      }

      const decodedParams = JSON.parse(decodeURIComponent(dataParam)) as BondParams;
      setBondParams(decodedParams);
      
      // Simular una llamada a la API para calcular el cronograma
      setTimeout(() => {
        // Generar un cronograma de pagos de prueba
        const mockedSchedule = generateMockSchedule(decodedParams);
        setSchedule(mockedSchedule);
        
        // Generar indicadores financieros de prueba
        setIndicators({
          tcea: 14.25,
          trea: 12.75,
          duration: 1.85,
          modifiedDuration: 1.72,
          convexity: 4.35
        });
        
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error("Error al procesar los datos:", err);
      setError("Ocurrió un error al procesar los datos del bono. Por favor, inténtalo de nuevo.");
      setLoading(false);
    }
  }, [searchParams]);

  // Función para generar un cronograma de pagos de prueba
  function generateMockSchedule(params: BondParams): PaymentRow[] {
    const { amount, term, rateValue, insurance, commission } = params;
    const rows: PaymentRow[] = [];
    
    // Calcular una cuota aproximada (para propósitos de demostración)
    const monthlyRate = rateValue / 100 / 12;
    const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    
    let balance = amount;
    let startDate = new Date(params.startDate);
    
    for (let i = 1; i <= term; i++) {
      const interest = balance * monthlyRate;
      let principal = payment - interest;
      
      // Ajustar para el último pago
      if (i === term) {
        principal = balance;
      }
      
      const insuranceAmount = insurance ? balance * 0.0005 : 0; // 0.05%
      const commissionAmount = commission ? 9 : 0; // S/ 9.00 por cuota
      
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(paymentDate.getMonth() + i);
      
      balance -= principal;
      if (balance < 0.01) balance = 0; // Evitar errores de redondeo
      
      rows.push({
        number: i,
        date: paymentDate.toLocaleDateString("es-PE"),
        principal: Number(principal.toFixed(2)),
        interest: Number(interest.toFixed(2)),
        insurance: Number(insuranceAmount.toFixed(2)),
        commission: commissionAmount,
        total: Number((principal + interest + insuranceAmount + commissionAmount).toFixed(2)),
        balance: Number(balance.toFixed(2))
      });
    }
    
    return rows;
  }

  // Si está cargando
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando datos del bono...</p>
        </div>
      </div>
    );
  }

  // Si hay un error
  if (error || !bondParams) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">Error</h2>
          <p className="text-red-600 dark:text-red-400">{error || "No se encontraron datos del bono"}</p>
          <Button 
            className="mt-4 bg-primary text-white hover:bg-primary/90"
            onClick={() => window.history.back()}
          >
            Volver al simulador
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Resultados de la Simulación
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          A continuación se muestra el cronograma de pagos y los indicadores financieros para tu bono educativo.
        </p>
      </div>

      {/* Calculadora de bonos con método francés */}
      {bondParams && (
        <BondCalculator bondParams={{ ...bondParams, startDate: new Date(bondParams.startDate) }} />
      )}
    </div>
  );
}

// Función para obtener la etiqueta del periodo de capitalización
function getCapitalizationLabel(cap: string): string {
  const labels: Record<string, string> = {
    monthly: "mensual",
    bimonthly: "bimestral",
    quarterly: "trimestral",
    biannual: "semestral",
    annual: "anual"
  };
  
  return labels[cap] || cap;
}