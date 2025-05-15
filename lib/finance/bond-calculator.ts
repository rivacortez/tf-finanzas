/**
 * Utilidades para el cálculo de bonos educativos usando el método francés
 */

// Tipos para los parámetros del bono
export type BondParams = {
  amount: number;           // Monto del bono
  currency: string;         // Moneda (PEN o USD)
  term: number;             // Plazo en meses
  rateType: string;         // Tipo de tasa (effective o nominal)
  rateValue: number;        // Valor de la tasa en porcentaje
  capitalization?: string;  // Periodo de capitalización para tasa nominal
  gracePeriod: number;      // Número de periodos de gracia
  graceType: string;        // Tipo de periodo de gracia (none, partial, total)
  startDate: Date;          // Fecha de inicio
  insurance: boolean;       // Incluir seguro de desgravamen
  commission: boolean;      // Incluir comisiones
};

// Tipo para las cuotas del cronograma
export type PaymentRow = {
  number: number;           // Número de cuota
  date: string;            // Fecha de pago
  principal: number;       // Amortización de capital
  interest: number;        // Interés
  insurance: number;       // Seguro de desgravamen
  commission: number;      // Comisión
  itf: number;             // Impuesto a las Transacciones Financieras
  total: number;           // Total de la cuota
  balance: number;         // Saldo de capital
};

// Tipo para los indicadores financieros
export type Indicators = {
  tcea: number;            // Tasa de Costo Efectivo Anual
  trea: number;            // Tasa de Rendimiento Efectivo Anual
  duration: number;        // Duración de Macaulay
  modifiedDuration: number; // Duración modificada
  convexity: number;       // Convexidad
};

/**
 * Convierte una moneda a otra usando un tipo de cambio
 * @param amount Monto en moneda base
 * @param exchangeRate Tipo de cambio
 * @returns Monto convertido
 */
export function convertCurrency(amount: number, exchangeRate: number): number {
  return amount * exchangeRate;
}

/**
 * Convierte una Tasa Efectiva Anual (TEA) a Tasa Efectiva Diaria (TED)
 * @param tea Tasa Efectiva Anual en decimal (ej: 0.12 para 12%)
 * @returns Tasa Efectiva Diaria en decimal
 */
export function teaToTed(tea: number): number {
  return Math.pow(1 + tea, 1/360) - 1;
}

/**
 * Convierte una Tasa Efectiva Diaria (TED) a Tasa Efectiva Mensual (TEM)
 * @param ted Tasa Efectiva Diaria en decimal
 * @param days Número de días del mes (por defecto 30)
 * @returns Tasa Efectiva Mensual en decimal
 */
export function tedToTem(ted: number, days: number = 30): number {
  return Math.pow(1 + ted, days) - 1;
}

/**
 * Convierte una Tasa Nominal Anual (TNA) a Tasa Efectiva Anual (TEA)
 * @param tna Tasa Nominal Anual en decimal (ej: 0.12 para 12%)
 * @param periods Número de periodos de capitalización por año
 * @returns Tasa Efectiva Anual en decimal
 */
export function tnaToTea(tna: number, periods: number): number {
  return Math.pow(1 + tna / periods, periods) - 1;
}

/**
 * Convierte una Tasa Efectiva Anual (TEA) a Tasa Efectiva por Periodo (TEP)
 * @param tea Tasa Efectiva Anual en decimal
 * @param periods Número de periodos por año
 * @returns Tasa Efectiva por Periodo en decimal
 */
export function teaToTep(tea: number, periods: number): number {
  return Math.pow(1 + tea, 1 / periods) - 1;
}

/**
 * Convierte una Tasa Efectiva de un periodo a otra Tasa Efectiva en diferente periodo
 * @param tep1 Tasa efectiva en la periodicidad original en decimal
 * @param p Número de periodos en el sistema original
 * @param q Número de periodos en el sistema nuevo
 * @returns Tasa efectiva en la nueva periodicidad en decimal
 */
export function convertTep(tep1: number, p: number, q: number): number {
  return Math.pow(1 + tep1, p / q) - 1;
}

/**
 * Calcula la cuota constante usando el método francés
 * @param principal Monto del préstamo
 * @param rate Tasa de interés por periodo en decimal
 * @param periods Número total de cuotas
 * @returns Cuota periódica constante
 */
export function calculatePayment(principal: number, rate: number, periods: number): number {
  // Si la tasa es 0, la cuota es simplemente el principal dividido entre los periodos
  if (rate === 0) return principal / periods;
  
  // Fórmula del método francés: C = S * [r * (1 + r)^n] / [(1 + r)^n - 1]
  return principal * (rate * Math.pow(1 + rate, periods)) / (Math.pow(1 + rate, periods) - 1);
}

/**
 * Calcula el interés para un periodo específico
 * @param balance Capital vivo del periodo anterior
 * @param rate Tasa de interés por periodo en decimal
 * @returns Interés del periodo
 */
export function calculateInterest(balance: number, rate: number): number {
  return balance * rate;
}

/**
 * Calcula la amortización para un periodo específico
 * @param payment Cuota fija
 * @param interest Interés del periodo
 * @returns Amortización del periodo
 */
export function calculatePrincipal(payment: number, interest: number): number {
  return payment - interest;
}

/**
 * Calcula el capital vivo para un periodo específico
 * @param previousBalance Capital vivo del periodo anterior
 * @param principal Amortización del periodo actual
 * @returns Capital vivo al final del periodo
 */
export function calculateBalance(previousBalance: number, principal: number): number {
  return previousBalance - principal;
}

/**
 * Calcula el capital amortizado acumulado hasta un periodo específico
 * @param initialPrincipal Capital inicial
 * @param currentBalance Capital vivo al final del periodo
 * @returns Capital amortizado acumulado
 */
export function calculateAmortizedCapital(initialPrincipal: number, currentBalance: number): number {
  return initialPrincipal - currentBalance;
}

/**
 * Calcula el Valor Actual Neto (VAN) de un flujo de pagos
 * @param initialAmount Inversión inicial (capital prestado)
 * @param cashFlows Array de flujos de caja futuros
 * @param rate Tasa de descuento por periodo en decimal
 * @returns Valor Actual Neto
 */
export function calculateNPV(initialAmount: number, cashFlows: number[], rate: number): number {
  let npv = -initialAmount;
  
  for (let i = 0; i < cashFlows.length; i++) {
    npv += cashFlows[i] / Math.pow(1 + rate, i + 1);
  }
  
  return npv;
}

/**
 * Calcula la Tasa Interna de Retorno (TIR) de un flujo de pagos
 * @param initialAmount Inversión inicial (capital prestado)
 * @param cashFlows Array de flujos de caja futuros
 * @param guess Estimación inicial para la TIR (por defecto 0.1 o 10%)
 * @param tolerance Tolerancia para la convergencia (por defecto 0.0001)
 * @param maxIterations Número máximo de iteraciones (por defecto 100)
 * @returns Tasa Interna de Retorno en decimal
 */
export function calculateIRR(
  initialAmount: number, 
  cashFlows: number[], 
  guess: number = 0.1, 
  tolerance: number = 0.0001, 
  maxIterations: number = 100
): number {
  let rate = guess;
  
  for (let i = 0; i < maxIterations; i++) {
    const npv = calculateNPV(initialAmount, cashFlows, rate);
    
    if (Math.abs(npv) < tolerance) {
      return rate;
    }
    
    // Calcular la derivada del VAN respecto a la tasa
    let derivative = 0;
    for (let j = 0; j < cashFlows.length; j++) {
      derivative -= (j + 1) * cashFlows[j] / Math.pow(1 + rate, j + 2);
    }
    
    // Método de Newton-Raphson para encontrar la raíz
    const newRate = rate - npv / derivative;
    
    if (Math.abs(newRate - rate) < tolerance) {
      return newRate;
    }
    
    rate = newRate;
  }
  
  // Si no converge, devolver la última aproximación
  return rate;
}

/**
 * Calcula la duración de Macaulay para un bono
 * @param cashFlows Array de flujos de caja futuros
 * @param rate Tasa de interés por periodo en decimal
 * @param price Precio del bono (generalmente el monto inicial)
 * @returns Duración de Macaulay en periodos
 */
export function calculateDuration(cashFlows: number[], rate: number, price: number): number {
  let duration = 0;
  
  for (let i = 0; i < cashFlows.length; i++) {
    const presentValue = cashFlows[i] / Math.pow(1 + rate, i + 1);
    duration += (i + 1) * presentValue;
  }
  
  return duration / price;
}

/**
 * Calcula la duración modificada para un bono
 * @param duration Duración de Macaulay
 * @param rate Tasa de interés por periodo en decimal
 * @returns Duración modificada
 */
export function calculateModifiedDuration(duration: number, rate: number): number {
  return duration / (1 + rate);
}

/**
 * Calcula la convexidad para un bono
 * @param cashFlows Array de flujos de caja futuros
 * @param rate Tasa de interés por periodo en decimal
 * @param price Precio del bono (generalmente el monto inicial)
 * @returns Convexidad
 */
export function calculateConvexity(cashFlows: number[], rate: number, price: number): number {
  let convexity = 0;
  
  for (let i = 0; i < cashFlows.length; i++) {
    const t = i + 1;
    const presentValue = cashFlows[i] / Math.pow(1 + rate, t);
    convexity += t * (t + 1) * presentValue / Math.pow(1 + rate, 2);
  }
  
  return convexity / price;
}

/**
 * Genera un cronograma de pagos completo usando el método francés
 * @param params Parámetros del bono
 * @returns Objeto con el cronograma de pagos y los indicadores financieros
 */
export function generatePaymentSchedule(params: BondParams): { schedule: PaymentRow[], indicators: Indicators } {
  const {
    amount,
    currency,
    term,
    rateType,
    rateValue,
    capitalization,
    gracePeriod,
    graceType,
    startDate,
    insurance,
    commission
  } = params;
  
  // Convertir la tasa anual a tasa mensual
  let monthlyRate: number;
  
  if (rateType === 'effective') {
    // Convertir TEA a TEM
    monthlyRate = teaToTep(rateValue / 100, 12);
  } else {
    // Convertir TNA a TEM según el periodo de capitalización
    let periods = 12; // Por defecto, capitalización mensual
    
    switch (capitalization) {
      case 'bimonthly':
        periods = 6;
        break;
      case 'quarterly':
        periods = 4;
        break;
      case 'biannual':
        periods = 2;
        break;
      case 'annual':
        periods = 1;
        break;
    }
    
    const tea = tnaToTea(rateValue / 100, periods);
    monthlyRate = teaToTep(tea, 12);
  }
  
  // Calcular la cuota constante (sin incluir seguro ni comisiones)
  const payment = calculatePayment(amount, monthlyRate, term);
  
  // Definir valores para seguro, comisión e ITF
  const insuranceRate = insurance ? 0.0005 : 0; // 0.05% mensual sobre el saldo
  const commissionAmount = commission ? 9 : 0; // S/ 9.00 o US$ 9.00 por cuota
  const itfRate = 0.00005; // 0.005% según normativa SBS
  
  // Generar el cronograma de pagos
  const schedule: PaymentRow[] = [];
  let balance = amount;
  let paymentDate = new Date(startDate);
  
  // Flujos de caja para cálculos financieros
  const cashFlows: number[] = [];
  
  for (let i = 1; i <= term; i++) {
    // Calcular la fecha de pago
    paymentDate = new Date(paymentDate);
    paymentDate.setMonth(paymentDate.getMonth() + 1);
    const formattedDate = paymentDate.toLocaleDateString('es-PE');
    
    // Calcular interés del periodo
    const interest = calculateInterest(balance, monthlyRate);
    
    // Determinar amortización según el periodo de gracia
    let principal = 0;
    if (i <= gracePeriod) {
      // Periodo de gracia
      if (graceType === 'total') {
        // Gracia total: no se paga ni capital ni intereses (se capitalizan)
        principal = 0;
        balance += interest; // Capitalizar intereses
      } else if (graceType === 'partial') {
        // Gracia parcial: solo se pagan intereses
        principal = 0;
      }
    } else {
      // Periodo normal: se paga la cuota completa
      principal = calculatePrincipal(payment, interest);
      
      // Ajustar para el último pago
      if (i === term) {
        principal = balance;
      }
    }
    
    // Calcular seguro y comisión
    const insuranceAmount = balance * insuranceRate;
    
    // Actualizar el balance
    balance = calculateBalance(balance, principal);
    if (balance < 0.01) balance = 0; // Evitar errores de redondeo
    
    // Calcular el ITF (aplica sobre el monto total de la operación)
    const subtotal = principal + interest + insuranceAmount + commissionAmount;
    const itfAmount = subtotal * itfRate;
    
    // Calcular el total de la cuota
    const totalPayment = subtotal + itfAmount;
    
    // Agregar al cronograma
    schedule.push({
      number: i,
      date: formattedDate,
      principal: Number(principal.toFixed(2)),
      interest: Number(interest.toFixed(2)),
      insurance: Number(insuranceAmount.toFixed(2)),
      commission: commissionAmount,
      itf: Number(itfAmount.toFixed(2)),
      total: Number(totalPayment.toFixed(2)),
      balance: Number(balance.toFixed(2))
    });
    
    // Agregar al flujo de caja para cálculos financieros
    cashFlows.push(totalPayment);
  }
  
  // Calcular indicadores financieros
  const monthlyIRR = calculateIRR(amount, cashFlows);
  const annualTCEA = Math.pow(1 + monthlyIRR, 12) - 1;
  
  // Para la TREA, consideramos solo los intereses (sin seguros ni comisiones)
  const interestOnlyCashFlows = schedule.map(row => row.principal + row.interest);
  const monthlyTREA = calculateIRR(amount, interestOnlyCashFlows);
  const annualTREA = Math.pow(1 + monthlyTREA, 12) - 1;
  
  // Calcular duración, duración modificada y convexidad
  const duration = calculateDuration(cashFlows, monthlyIRR, amount);
  const modifiedDuration = calculateModifiedDuration(duration, monthlyIRR);
  const convexity = calculateConvexity(cashFlows, monthlyIRR, amount);
  
  // Convertir a años para mejor interpretación
  const durationInYears = duration / 12;
  const modifiedDurationInYears = modifiedDuration / 12;
  
  const indicators: Indicators = {
    tcea: Number((annualTCEA * 100).toFixed(2)),
    trea: Number((annualTREA * 100).toFixed(2)),
    duration: Number(durationInYears.toFixed(2)),
    modifiedDuration: Number(modifiedDurationInYears.toFixed(2)),
    convexity: Number(convexity.toFixed(2))
  };
  
  return { schedule, indicators };
}