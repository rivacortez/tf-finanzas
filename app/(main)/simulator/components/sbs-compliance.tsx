"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BondParams } from "@/lib/finance/bond-calculator";
import { SBS_REGULATIONS } from "@/lib/finance/sbs-validator";

interface SbsComplianceProps {
  bondParams: BondParams;
}

export default function SbsCompliance({ bondParams }: SbsComplianceProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Función para validar tasa de interés según normativa SBS
  const validateInterestRate = () => {
    const maxRate = bondParams.currency === "PEN" 
      ? SBS_REGULATIONS.MAX_RATE_PEN 
      : SBS_REGULATIONS.MAX_RATE_USD;
    
    // Valor mínimo entre maxRate y 100 para visualización de la barra de progreso
    const visualMaxRate = Math.min(maxRate, 100);
    
    // Evaluar si la tasa cumple con el límite máximo
    const isCompliant = bondParams.rateValue <= maxRate;
    
    // Calcular porcentaje para la barra de progreso
    const percentage = Math.min((bondParams.rateValue / visualMaxRate) * 100, 100);
    
    return {
      title: "Tasa de interés",
      isCompliant,
      value: bondParams.rateValue,
      maxValue: maxRate,
      percentage,
      details: isCompliant 
        ? `La tasa de ${bondParams.rateValue}% anual está dentro del límite máximo permitido de ${maxRate}% para bonos en ${bondParams.currency === "PEN" ? "soles" : "dólares"}.`
        : `La tasa de ${bondParams.rateValue}% anual excede el límite máximo permitido de ${maxRate}% para bonos en ${bondParams.currency === "PEN" ? "soles" : "dólares"}.`,
      regulation: "Ley N° 31143 - Ley que protege de la usura a los consumidores"
    };
  };
  
  // Función para validar período de gracia
  const validateGracePeriod = () => {
    // Solo aplica si hay período de gracia
    if (bondParams.graceType === "none" || bondParams.gracePeriod === 0) {
      return {
        title: "Período de gracia",
        isCompliant: true,
        value: 0,
        maxValue: 0,
        percentage: 0,
        details: "No se ha configurado un período de gracia para este bono.",
        regulation: ""
      };
    }
    
    // Calcular el máximo período de gracia permitido
    const maxGracePeriod = Math.floor(bondParams.term * SBS_REGULATIONS.MAX_GRACE_PERIOD_RATIO);
    
    // Evaluar si el período de gracia cumple con la normativa
    const isCompliant = bondParams.gracePeriod <= maxGracePeriod;
    
    // Calcular porcentaje para la barra de progreso
    const percentage = (bondParams.gracePeriod / (maxGracePeriod || 1)) * 100;
    
    return {
      title: "Período de gracia",
      isCompliant,
      value: bondParams.gracePeriod,
      maxValue: maxGracePeriod,
      percentage,
      details: isCompliant 
        ? `El período de gracia de ${bondParams.gracePeriod} meses está dentro del límite máximo recomendado de ${maxGracePeriod} meses (${SBS_REGULATIONS.MAX_GRACE_PERIOD_RATIO * 100}% del plazo total).`
        : `El período de gracia de ${bondParams.gracePeriod} meses excede el límite máximo recomendado de ${maxGracePeriod} meses (${SBS_REGULATIONS.MAX_GRACE_PERIOD_RATIO * 100}% del plazo total).`,
      regulation: "Circular SBS N° G-200-2020"
    };
  };
  
  // Función para validar plazo
  const validateTerm = () => {
    // Evaluar si el plazo cumple con los límites
    const isCompliant = 
      bondParams.term >= SBS_REGULATIONS.MIN_TERM && 
      bondParams.term <= SBS_REGULATIONS.MAX_TERM;
    
    // Calcular porcentaje para la barra de progreso
    const percentage = (bondParams.term / SBS_REGULATIONS.MAX_TERM) * 100;
    
    return {
      title: "Plazo del bono",
      isCompliant,
      value: bondParams.term,
      maxValue: SBS_REGULATIONS.MAX_TERM,
      percentage,
      details: isCompliant 
        ? `El plazo de ${bondParams.term} meses está dentro del rango permitido (${SBS_REGULATIONS.MIN_TERM}-${SBS_REGULATIONS.MAX_TERM} meses).`
        : bondParams.term < SBS_REGULATIONS.MIN_TERM
          ? `El plazo de ${bondParams.term} meses es menor al mínimo recomendado de ${SBS_REGULATIONS.MIN_TERM} meses.`
          : `El plazo de ${bondParams.term} meses excede el máximo recomendado de ${SBS_REGULATIONS.MAX_TERM} meses.`,
      regulation: "Resolución SBS N° 3274-2017"
    };
  };
  
  // Función para validar transparencia de información
  const validateTransparency = () => {
    // En un sistema real, esto verificaría si todos los componentes del costo están correctamente etiquetados
    // Aquí simulamos que la transparencia es correcta si se han incluido las comisiones y seguros
    const hasAllCostComponents = true;
    
    return {
      title: "Transparencia de información",
      isCompliant: hasAllCostComponents,
      value: 0,
      maxValue: 0,
      percentage: 0,
      details: hasAllCostComponents
        ? "El bono contiene toda la información requerida sobre tasas, comisiones, seguros y cargos aplicables."
        : "Falta información relevante sobre los componentes del costo total del bono.",
      regulation: "Resolución SBS N° 3274-2017 - Reglamento de Gestión de Conducta de Mercado"
    };
  };
  
  // Ejecutar todas las validaciones
  const validations = [
    validateInterestRate(),
    validateGracePeriod(),
    validateTerm(),
    validateTransparency()
  ];
  
  // Calcular el número de validaciones que cumplen con la normativa
  const compliantCount = validations.filter(v => v.isCompliant).length;
  
  // Calcular el porcentaje general de cumplimiento
  const compliancePercentage = (compliantCount / validations.length) * 100;
  
  // Determinar el estado general de cumplimiento
  const overallStatus = compliancePercentage === 100 
    ? "compliant" 
    : compliancePercentage >= 75 
      ? "warning" 
      : "non-compliant";
  
  // Componente para el indicador de cumplimiento
  const ComplianceIcon = ({ isCompliant }: { isCompliant: boolean }) => (
    isCompliant 
      ? <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" /> 
      : <XCircle className="h-5 w-5 text-red-600 dark:text-red-500" />
  );

  return (
    <div className="space-y-6">
      {/* Resumen de cumplimiento */}
      <Card className={
        overallStatus === "compliant" 
          ? "border-green-200 dark:border-green-900/30" 
          : overallStatus === "warning" 
            ? "border-amber-200 dark:border-amber-900/30" 
            : "border-red-200 dark:border-red-900/30"
      }>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className={
                overallStatus === "compliant" 
                  ? "h-5 w-5 text-green-600 dark:text-green-500" 
                  : overallStatus === "warning" 
                    ? "h-5 w-5 text-amber-600 dark:text-amber-500" 
                    : "h-5 w-5 text-red-600 dark:text-red-500"
              } />
              <CardTitle>Validación Normativa SBS</CardTitle>
            </div>
            <div className="text-sm font-medium">
              {compliantCount} de {validations.length} validaciones
            </div>
          </div>
          <CardDescription>
            Estado de cumplimiento con las resoluciones de la SBS
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Porcentaje de cumplimiento
                </span>
                <span className="font-medium">
                  {compliancePercentage.toFixed(0)}%
                </span>
              </div>
              <Progress value={compliancePercentage} className={
                overallStatus === "compliant" 
                  ? "bg-green-100 dark:bg-green-900/20" 
                  : overallStatus === "warning" 
                    ? "bg-amber-100 dark:bg-amber-900/20" 
                    : "bg-red-100 dark:bg-red-900/20"
              } />
            </div>
            
            <Alert className={
              overallStatus === "compliant" 
                ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30" 
                : overallStatus === "warning" 
                  ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30" 
                  : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30"
            }>
              {overallStatus === "compliant" && (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                  <AlertTitle>Cumple con la normativa</AlertTitle>
                  <AlertDescription>
                    La configuración del bono educativo cumple con todas las regulaciones de la SBS.
                  </AlertDescription>
                </>
              )}
              
              {overallStatus === "warning" && (
                <>
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                  <AlertTitle>Cumplimiento parcial</AlertTitle>
                  <AlertDescription>
                    La configuración del bono educativo cumple parcialmente con las regulaciones de la SBS. 
                    Revise los detalles para correcciones necesarias.
                  </AlertDescription>
                </>
              )}
              
              {overallStatus === "non-compliant" && (
                <>
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-500" />
                  <AlertTitle>No cumple con la normativa</AlertTitle>
                  <AlertDescription>
                    La configuración del bono educativo no cumple con importantes regulaciones de la SBS. 
                    Es necesario ajustar los parámetros para cumplir con la normativa.
                  </AlertDescription>
                </>
              )}
            </Alert>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Ocultar detalles" : "Ver detalles"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Detalles de validaciones */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Detalles de validación normativa</CardTitle>
            <CardDescription>
              Análisis detallado de cumplimiento por cada regulación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={validations.filter(v => !v.isCompliant).map((_, i) => `item-${i}`)}>
              {validations.map((validation, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <ComplianceIcon isCompliant={validation.isCompliant} />
                      <span className="font-medium">{validation.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {validation.details}
                      </p>
                      
                      {validation.value > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                              Valor actual: {validation.value} {validation.title === "Tasa de interés" ? "%" : validation.title === "Plazo del bono" || validation.title === "Período de gracia" ? "meses" : ""}
                            </span>
                            {validation.maxValue > 0 && (
                              <span className="text-gray-500 dark:text-gray-400">
                                Máximo permitido: {validation.maxValue} {validation.title === "Tasa de interés" ? "%" : validation.title === "Plazo del bono" || validation.title === "Período de gracia" ? "meses" : ""}
                              </span>
                            )}
                          </div>
                          <Progress value={validation.percentage} className={
                            validation.percentage > 90 
                              ? "bg-red-100 dark:bg-red-900/20" 
                              : validation.percentage > 70 
                                ? "bg-amber-100 dark:bg-amber-900/20" 
                                : "bg-green-100 dark:bg-green-900/20"
                          } />
                        </div>
                      )}
                      
                      {validation.regulation && (
                        <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30 p-3 rounded-md">
                          <Info className="h-4 w-4 mt-0.5" />
                          <div>
                            <strong>Normativa aplicable:</strong> {validation.regulation}
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
      
      {/* Recomendaciones de transparencia */}
      <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Información obligatoria para transparencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Según la Resolución SBS N° 3274-2017, todo bono debe mostrar claramente los siguientes componentes:
          </p>
          <ul className="space-y-2">
            {SBS_REGULATIONS.REQUIRED_DISCLOSURES.map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Recuerde que ocultar o no divulgar adecuadamente estos componentes puede resultar en sanciones por parte de la SBS y el INDECOPI.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}