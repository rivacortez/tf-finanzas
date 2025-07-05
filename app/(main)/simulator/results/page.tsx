"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import BondCalculator from "../components/bond-calculator";
import type { BondParams } from "@/lib/finance/bond-calculator";

// Contenido de la página de resultados
function ResultsPageContent() {
  const searchParams = useSearchParams();
  const [bondParams, setBondParams] = useState<BondParams | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Función interna para procesar parámetros
    const loadParams = () => {
      try {
        const dataParam = searchParams.get("data");
        if (!dataParam) {
          throw new Error("No se encontraron datos del bono");
        }

        // Parsear datos recibidos
        const decoded = JSON.parse(decodeURIComponent(dataParam)) as Record<string, unknown>;
        // Validar y convertir startDate a Date
        let parsedDate = new Date();
        const rawStart = decoded.startDate;
        if (typeof rawStart === "string") {
          const tryDate = new Date(rawStart);
          if (!isNaN(tryDate.getTime())) {
            parsedDate = tryDate;
          }
        }

        // Construir objeto BondParams sin necesidad de variable extra para destructuring
        const params: BondParams = {
          ...(decoded as Omit<BondParams, "startDate">),
          startDate: parsedDate,
        };

        console.log("[Simulador] Parámetros recibidos:", params);
        setBondParams(params);
      } catch (err) {
        console.error("Error al procesar los datos:", err);
        setError(
          "Ocurrió un error al procesar los datos del bono. Por favor, inténtalo de nuevo."
        );
      } finally {
        setLoading(false);
      }
    };

    loadParams();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Cargando datos del bono...
          </p>
        </div>
      </div>
    );
  }

  if (error || !bondParams) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">
            Error
          </h2>
          <p className="text-red-600 dark:text-red-400">
            {error || "No se encontraron datos del bono"}
          </p>
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

  console.log("[Simulador] Renderizando BondCalculator con:", bondParams);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Resultados de la Simulación
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          A continuación se muestra el cronograma de pagos y los indicadores financieros para tu bono.
        </p>
      </div>

      {/* Calculadora de bonos con método francés */}
      <BondCalculator bondParams={bondParams} />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={<div className="container mx-auto py-8">Cargando resultados...</div>}
    >
      <ResultsPageContent />
    </Suspense>
  );
}
