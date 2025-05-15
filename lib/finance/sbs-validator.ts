/**
 * Utilidades para validación de normativa SBS en bonos educativos
 */

import { BondParams } from "./bond-calculator";

// Normativa SBS basada en regulaciones actuales
export const SBS_REGULATIONS = {
  MAX_RATE_PEN: 83.40, // Tasa máxima en soles (según Ley N° 31143)
  MAX_RATE_USD: 16.41, // Tasa máxima en dólares
  MAX_GRACE_PERIOD_RATIO: 0.25, // Período de gracia máximo como ratio del plazo total
  MIN_TERM: 6, // Plazo mínimo en meses
  MAX_TERM: 120, // Plazo máximo en meses
  MAX_INSURANCE_RATE: 0.0005, // Tasa máxima de seguro por mes (0.05%)
  ITF_RATE: 0.00005, // Impuesto a las Transacciones Financieras (0.005%)
  REQUIRED_DISCLOSURES: [
    "Tasa de interés efectiva anual (TEA)",
    "Tasa de costo efectivo anual (TCEA)",
    "Periodicidad de pago",
    "Comisiones y gastos",
    "Seguros requeridos",
    "Impuesto a las Transacciones Financieras (ITF)"
  ]
};

// Tipo para los resultados de validación
export type ValidationResult = {
  isValid: boolean;
  message: string;
  details?: string;
};

/**
 * Valida la tasa de interés según normativa SBS
 * @param rateValue Valor de la tasa en porcentaje
 * @param currency Moneda (PEN o USD)
 * @returns Resultado de la validación
 */
export function validateInterestRate(rateValue: number, currency: string): ValidationResult {
  const maxRate = currency === "PEN" ? SBS_REGULATIONS.MAX_RATE_PEN : SBS_REGULATIONS.MAX_RATE_USD;
  
  if (rateValue <= 0) {
    return {
      isValid: false,
      message: "La tasa de interés debe ser mayor a cero",
      details: `La tasa ingresada (${rateValue}%) no es válida.`
    };
  }
  
  if (rateValue > maxRate) {
    return {
      isValid: false,
      message: `La tasa excede el límite máximo permitido de ${maxRate}%`,
      details: `Según la Ley N° 31143, la tasa máxima para préstamos en ${currency === "PEN" ? "soles" : "dólares"} es de ${maxRate}%.`
    };
  }
  
  return {
    isValid: true,
    message: `La tasa de ${rateValue}% cumple con la normativa SBS`,
    details: `Está dentro del límite máximo de ${maxRate}% para préstamos en ${currency === "PEN" ? "soles" : "dólares"}.`
  };
}

/**
 * Valida el plazo según normativa SBS
 * @param term Plazo en meses
 * @returns Resultado de la validación
 */
export function validateTerm(term: number): ValidationResult {
  if (term < SBS_REGULATIONS.MIN_TERM) {
    return {
      isValid: false,
      message: `El plazo mínimo permitido es de ${SBS_REGULATIONS.MIN_TERM} meses`,
      details: `El plazo ingresado (${term} meses) es menor al mínimo requerido.`
    };
  }
  
  if (term > SBS_REGULATIONS.MAX_TERM) {
    return {
      isValid: false,
      message: `El plazo máximo permitido es de ${SBS_REGULATIONS.MAX_TERM} meses`,
      details: `El plazo ingresado (${term} meses) excede el máximo permitido.`
    };
  }
  
  return {
    isValid: true,
    message: `El plazo de ${term} meses cumple con la normativa SBS`,
    details: `Está dentro del rango permitido de ${SBS_REGULATIONS.MIN_TERM} a ${SBS_REGULATIONS.MAX_TERM} meses.`
  };
}

/**
 * Valida el período de gracia según normativa SBS
 * @param gracePeriod Período de gracia en meses
 * @param graceType Tipo de período de gracia (none, partial, total)
 * @param term Plazo total en meses
 * @returns Resultado de la validación
 */
export function validateGracePeriod(gracePeriod: number, graceType: string, term: number): ValidationResult {
  // Si no hay período de gracia, es válido
  if (graceType === "none" || gracePeriod === 0) {
    return {
      isValid: true,
      message: "No se ha configurado un período de gracia",
      details: "No aplica validación de período de gracia."
    };
  }
  
  // Calcular el máximo período de gracia permitido
  const maxGracePeriod = Math.floor(term * SBS_REGULATIONS.MAX_GRACE_PERIOD_RATIO);
  
  if (gracePeriod > maxGracePeriod) {
    return {
      isValid: false,
      message: `El período de gracia excede el máximo permitido de ${maxGracePeriod} meses`,
      details: `Según normativa SBS, el período de gracia no debe exceder el ${SBS_REGULATIONS.MAX_GRACE_PERIOD_RATIO * 100}% del plazo total.`
    };
  }
  
  if (gracePeriod >= term) {
    return {
      isValid: false,
      message: "El período de gracia no puede ser mayor o igual al plazo total",
      details: `El período de gracia (${gracePeriod} meses) debe ser menor al plazo total (${term} meses).`
    };
  }
  
  return {
    isValid: true,
    message: `El período de gracia de ${gracePeriod} meses cumple con la normativa SBS`,
    details: `Está dentro del límite máximo de ${maxGracePeriod} meses para un plazo de ${term} meses.`
  };
}

/**
 * Valida todos los parámetros del bono según normativa SBS
 * @param params Parámetros del bono
 * @returns Objeto con resultados de validación para cada parámetro
 */
export function validateBondParams(params: BondParams): {
  interestRate: ValidationResult;
  term: ValidationResult;
  gracePeriod: ValidationResult;
  overall: ValidationResult;
} {
  const interestRateValidation = validateInterestRate(params.rateValue, params.currency);
  const termValidation = validateTerm(params.term);
  const gracePeriodValidation = validateGracePeriod(params.gracePeriod, params.graceType, params.term);
  
  // Determinar validación general
  const isOverallValid = interestRateValidation.isValid && termValidation.isValid && gracePeriodValidation.isValid;
  
  const overallValidation: ValidationResult = {
    isValid: isOverallValid,
    message: isOverallValid 
      ? "El bono cumple con todas las normativas SBS" 
      : "El bono no cumple con algunas normativas SBS",
    details: isOverallValid
      ? "Todos los parámetros del bono cumplen con las regulaciones de la SBS."
      : "Revise los parámetros marcados como inválidos para cumplir con la normativa."
  };
  
  return {
    interestRate: interestRateValidation,
    term: termValidation,
    gracePeriod: gracePeriodValidation,
    overall: overallValidation
  };
}