/**
 * Utilidades para el cálculo de bonos  usando el método francés
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

// Interfaces para bonos corporativos (método francés)
export interface CorporateBondInput {
  valorNominal: number;        // Valor Nominal del bono
  valorComercial: number;      // Valor Comercial del bono
  nDeAnos: number;             // Número de años
  frecuenciaCuponDias: number; // Frecuencia del cupón en días
  diasXAno: number;            // Días por año (360/365)
  tipoTasaInteres: string;     // Efectiva/Nominal
  tasaInteresAnual: number;    // Tasa de interés anual (%)
  tasaDescuento: number;       // Tasa anual de descuento (COK) (%)
  impuestoRenta: number;       // Impuesto a la renta (%)
  fechaEmision: string;        // Fecha de emisión
  inflacionAnual: number;      // Tasa de inflación anual (%)
  costos: {
    prima: { porcentaje: number, aplicaA: 'Emisor' | 'Bonista' | 'Ambos' };
    estructuracion: { porcentaje: number, aplicaA: 'Emisor' | 'Bonista' | 'Ambos' };
    colocacion: { porcentaje: number, aplicaA: 'Emisor' | 'Bonista' | 'Ambos' };
    flotacion: { porcentaje: number, aplicaA: 'Emisor' | 'Bonista' | 'Ambos' };
    cavali: { porcentaje: number, aplicaA: 'Emisor' | 'Bonista' | 'Ambos' };
  };
}

export interface CorporateBondRow {
  n: number;                    // Número de periodo
  fechaProgramada: string;      // Fecha programada de pago
  inflacionAnual: number;       // Inflación anual
  inflacionPeriodica: number;   // Inflación del periodo
  plazoGracia: string;          // Tipo de plazo de gracia (S/T/P)
  bono: number;                 // Valor del bono inicial
  bonoIndexado: number;         // Bono ajustado por inflación
  cuponInteres: number;         // Interés del periodo
  cuota: number;                // Cuota total
  amortizacion: number;         // Amortización
  prima: number;                // Prima (si aplica)
  escudo: number;               // Escudo fiscal
  flujoEmisor: number;          // Flujo para el emisor
  flujoEmisorConEscudo: number; // Flujo para el emisor con escudo fiscal
  flujoBonista: number;         // Flujo para el bonista
  flujoActualizado: number;     // Flujo actualizado (para cálculos de duración)
  faPorPlazo: number;           // Flujo actualizado por plazo (para duración)
  factorConvexidad: number;     // Factor para convexidad
}

export interface CorporateBondResults {
  // Parámetros calculados
  nPeriodosPorAno: number;
  nTotalPeriodos: number;
  diasCapitalizacion: number;
  tasaEfectivaPeriodica: number;
  cokPeriodico: number;
  inflacionPeriodica: number;
  // Costos
  costesInicialesEmisor: number;
  costesInicialesBonista: number;
  // Indicadores
  precioActual: number;
  utilidadPerdida: number;
  duracion: number;
  convexidad: number;
  duracionModificada: number;
  total: number; // Duración + Convexidad
  tceaEmisor: number;
  tceaEmisorConEscudo: number;
  treaBonista: number;
  // Tabla de amortización
  tablaAmortizacion: CorporateBondRow[];
}

/**
 * Calcula todos los resultados para un bono corporativo usando el método francés
 * @param input Parámetros del bono corporativo
 * @returns Resultados completos del bono corporativo
 */
export function calcularBonoFrances(input: CorporateBondInput): CorporateBondResults {
  const {
    valorNominal,
    valorComercial,
    nDeAnos,
    frecuenciaCuponDias,
    diasXAno,
    tasaInteresAnual,
    tasaDescuento,
    impuestoRenta,
    fechaEmision,
    inflacionAnual,
    costos
  } = input;

  // 1. Cálculo de parámetros básicos
  const nPeriodosPorAno = diasXAno / frecuenciaCuponDias;
  const nTotalPeriodos = Math.round(nDeAnos * nPeriodosPorAno);
  
  // Calcular días de capitalización según la fórmula exacta de Excel
  const diasCapitalizacion = calcularDiasCapitalizacion(frecuenciaCuponDias);
  
  // 2. Conversión de tasas según fórmulas exactas de Excel
  // L9: =(1+L8)^(L4/E8)-1 donde L8=tasa anual (7.5%), L4=frecuencia cupón (180), E8=días año (360)
  const tasaEfectivaAnual = tasaInteresAnual / 100;
  const tasaEfectivaPeriodica = Math.pow(1 + tasaEfectivaAnual, frecuenciaCuponDias / diasXAno) - 1;
  
  // L10: =(1+E12)^(L4/E8)-1 donde E12=COK anual (4.5%)
  const cokPeriodico = Math.pow(1 + (tasaDescuento / 100), frecuenciaCuponDias / diasXAno) - 1;
  
  // 3. Cálculo de costos iniciales según las fórmulas de Excel
  // L11: =SUMA($E$17:$E$20)*E5 (Costos Iniciales Emisor)
  // L12: =SUMA($E$19:$E$20)*E5 (Costos Iniciales Bonista)
  
  // Costos que aplican al Emisor (Estructuración, Colocación, Flotación, CAVALI - la Prima NO se suma según requerimiento)
  // La prima se excluye del cálculo según especificación:
  


  const porcentajesEstructuracionEmisor = (costos.estructuracion.aplicaA === 'Emisor' || costos.estructuracion.aplicaA === 'Ambos') ? costos.estructuracion.porcentaje : 0;
  const porcentajesColocacionEmisor = (costos.colocacion.aplicaA === 'Emisor' || costos.colocacion.aplicaA === 'Ambos') ? costos.colocacion.porcentaje : 0;
  const porcentajesFlotacionEmisor = (costos.flotacion.aplicaA === 'Emisor' || costos.flotacion.aplicaA === 'Ambos') ? costos.flotacion.porcentaje : 0;
  const porcentajesCAVALIEmisor = (costos.cavali.aplicaA === 'Emisor' || costos.cavali.aplicaA === 'Ambos') ? costos.cavali.porcentaje : 0;
  
  // NOTA: La prima NO se incluye en los costos iniciales del emisor según especificación
  const costesInicialesEmisor = (porcentajesEstructuracionEmisor + porcentajesColocacionEmisor + porcentajesFlotacionEmisor + porcentajesCAVALIEmisor) * valorComercial / 100;
  
  // Costos que aplican al Bonista (Flotación y CAVALI - la Prima NO se suma según requerimiento)
  // Estas variables se calculan para completitud pero NO se incluyen en los costos iniciales del bonista:
  // const porcentajesPrimaBonista = (costos.prima.aplicaA === 'Bonista' || costos.prima.aplicaA === 'Ambos') ? costos.prima.porcentaje : 0;
  // const porcentajesEstructuracionBonista = (costos.estructuracion.aplicaA === 'Bonista' || costos.estructuracion.aplicaA === 'Ambos') ? costos.estructuracion.porcentaje : 0;
  // const porcentajesColocacionBonista = (costos.colocacion.aplicaA === 'Bonista' || costos.colocacion.aplicaA === 'Ambos') ? costos.colocacion.porcentaje : 0;
  
  const porcentajesFlotacionBonista = (costos.flotacion.aplicaA === 'Bonista' || costos.flotacion.aplicaA === 'Ambos') ? costos.flotacion.porcentaje : 0;
  const porcentajesCAVALIBonista = (costos.cavali.aplicaA === 'Bonista' || costos.cavali.aplicaA === 'Ambos') ? costos.cavali.porcentaje : 0;
  
  // NOTA: La prima NO se incluye en los costos iniciales del bonista según especificación
  const costesInicialesBonista = (porcentajesFlotacionBonista + porcentajesCAVALIBonista) * valorComercial / 100;
  
  // 4. Cálculo de la cuota constante (método francés)
  // Para bonos con inflación, la cuota se calcula sobre el valor nominal inicial
  
  // 5. Generación de la tabla de amortización con ajustes por inflación
  const tablaAmortizacion: CorporateBondRow[] = [];
  let saldoBono = valorNominal;
  
  // Calcular fechas de pago
  const fechaBase = new Date(fechaEmision);
  const fechas: string[] = [];
  
  for (let i = 1; i <= nTotalPeriodos; i++) {
    const nuevaFecha = new Date(fechaBase);
    // Agregar meses según la frecuencia
    if (frecuenciaCuponDias === 180) { // Semestral
      nuevaFecha.setMonth(nuevaFecha.getMonth() + (6 * i));
    } else if (frecuenciaCuponDias === 90) { // Trimestral
      nuevaFecha.setMonth(nuevaFecha.getMonth() + (3 * i));
    } else if (frecuenciaCuponDias === 30) { // Mensual
      nuevaFecha.setMonth(nuevaFecha.getMonth() + i);
    } else { // Anual
      nuevaFecha.setFullYear(nuevaFecha.getFullYear() + i);
    }
    fechas.push(nuevaFecha.toLocaleDateString('es-ES'));
  }
  
  // Generar la tabla de amortización
  // Agregar periodo 0 (inicial) como en Excel
  tablaAmortizacion.push({
    n: 0,
    fechaProgramada: fechaBase.toLocaleDateString('es-ES'),
    inflacionAnual: inflacionAnual,
    inflacionPeriodica: 0, // Sin inflación en el periodo inicial según la condición SI
    plazoGracia: 'S',
    bono: valorNominal,
    bonoIndexado: valorNominal,
    cuponInteres: 0, // Sin interés en el periodo inicial
    cuota: 0, // Sin cuota en el periodo inicial
    amortizacion: 0, // Sin amortización en el periodo inicial
    prima: 0,
    escudo: 0,
    flujoEmisor: valorComercial - costesInicialesEmisor, // Flujo positivo para el emisor
    flujoEmisorConEscudo: valorComercial - costesInicialesEmisor, // Igual sin escudo en periodo inicial
    flujoBonista: -valorComercial - costesInicialesBonista, // Flujo negativo para el bonista
    flujoActualizado: 0,
    faPorPlazo: 0,
    factorConvexidad: 0
  });

  for (let i = 0; i < nTotalPeriodos; i++) {
    const periodoActual = i + 1;
    
    // Cálculo de inflación periódica según fórmula de Excel:
    // =SI(A28<=$L$7;POTENCIA(1+C28;$L$4/$E$8)-1;0)
    // Si el período actual <= total de períodos, entonces calcular inflación periódica, sino 0
    const inflacionPeriodica = periodoActual <= nTotalPeriodos ? 
      Math.pow(1 + (inflacionAnual / 100), frecuenciaCuponDias / diasXAno) - 1 : 0;
    
    // Ajuste por inflación del bono
    const bonoIndexado = saldoBono * (1 +inflacionPeriodica);
    
    // Cálculo de intereses sobre el bono indexado
    const interesPeriodo = bonoIndexado * tasaEfectivaPeriodica;
    
    // Para bonos con inflación, la cuota se calcula sobre el bono indexado del periodo
    // Recalcular la cuota para los periodos restantes
    const restanteCuotas = nTotalPeriodos - periodoActual + 1;
    const cuotaPeriodo = calculatePayment(bonoIndexado, tasaEfectivaPeriodica, restanteCuotas);
 
//prima final es igual al input de prima
 // let    primaFinal_1 = costos.prima.porcentaje
    // Amortización = Cuota - Interés
    const amortizacionPeriodo = cuotaPeriodo - interesPeriodo;

    let primaValue = 0;
  if (periodoActual === nTotalPeriodos) {
    primaValue = (costos.prima.porcentaje / 100) * bonoIndexado;
  }

  
    // Escudo fiscal sobre el interés
    const escudoFiscal = interesPeriodo * (impuestoRenta / 100);
    
    // Flujos de caja
    const flujoEmisor = -(cuotaPeriodo+ primaValue) ;
    const flujoEmisorConEscudo = -cuotaPeriodo + escudoFiscal - primaValue;
    const flujoBonista = cuotaPeriodo+ primaValue;
    
    // Agregar a la tabla
    tablaAmortizacion.push({
      n: periodoActual,
      fechaProgramada: fechas[i],
      inflacionAnual: inflacionAnual,
      inflacionPeriodica: inflacionPeriodica,
      plazoGracia: 'S', // Sin plazo de gracia
      bono: saldoBono,
      bonoIndexado: bonoIndexado,
      cuponInteres: -interesPeriodo, // Negativo porque es salida
      cuota: -cuotaPeriodo, // Negativo porque es salida
      amortizacion: -amortizacionPeriodo, // Negativo porque es salida
      prima: periodoActual === nTotalPeriodos ? (costos.prima.porcentaje / 100) * bonoIndexado : 0,
      escudo: escudoFiscal,
      flujoEmisor: flujoEmisor,
      flujoEmisorConEscudo: flujoEmisorConEscudo,
      flujoBonista: flujoBonista,
      flujoActualizado: 0, // Se calculará después
      faPorPlazo: 0, // Se calculará después
      factorConvexidad: 0 // Se calculará después
    });
    
    // Actualizar el saldo del bono para el siguiente periodo
    saldoBono = bonoIndexado - amortizacionPeriodo;
    
    // Corrección para evitar errores de redondeo en el último periodo
    if (i === nTotalPeriodos - 1) {
      saldoBono = 0;
    }
  }
  // 6. Cálculo del Precio Actual y VAN según marco conceptual
  // Precio Actual = Valor presente de todos los flujos futuros del bonista (excluyendo periodo 0)
  const flujosBonistaFuturos = tablaAmortizacion
    .filter(row => row.n > 0) // Excluir periodo 0
    .map(row => row.flujoBonista);
  
  // Precio Actual = Σ[CFt / (1+r)^t] donde CFt son los flujos del bonista
  let precioActual = 0;
  for (let i = 0; i < flujosBonistaFuturos.length; i++) {
    precioActual += flujosBonistaFuturos[i] / Math.pow(1 + cokPeriodico, i + 1);
  }
  
  // VAN = -Inversión Inicial + Valor Presente de Flujos Futuros
  // VAN = -P + Σ[VF / (1+r)^n] donde P es la inversión inicial
  const inversionInicial = valorComercial + costesInicialesBonista;
  const utilidadPerdida = precioActual - inversionInicial;
  
  // 7. Cálculo de duración y convexidad según marco conceptual
  let sumatoriaFAxPlazo = 0;
  let sumatoriaFactorConvexidad = 0;
  let sumatoriaFlujoActualizado = 0;
  // Solo considerar periodos futuros (n > 0) para duración y convexidad
  const periodosFuturos = tablaAmortizacion.filter(row => row.n > 0);
  
  periodosFuturos.forEach((row, index) => {
    const t = index + 1; // Periodo (empezando en 1)
    
    // Flujo actualizado usando la fórmula: CFt / (1+r)^t
    const flujoActualizado = row.flujoBonista / Math.pow(1 + cokPeriodico, t);
    
  
    sumatoriaFlujoActualizado += flujoActualizado
 

    row.flujoActualizado = flujoActualizado;
     
    // Para duración: D = Σ[t * CFt / (1+r)^t] / Σ[CFt / (1+r)^t]
    // Numerador: t * CFt / (1+r)^t
    const faPorPlazo = (t * flujoActualizado *frecuenciaCuponDias) / diasXAno;
    row.faPorPlazo = faPorPlazo;
    sumatoriaFAxPlazo += faPorPlazo;
    
    // Para convexidad: C = Σ[t * CFt * (t+1) / (1+r)^(t+2)] / Σ[CFt / (1+r)^t]
    const factorConvexidad = (t * row.flujoActualizado * (t + 1)) 
    row.factorConvexidad = factorConvexidad;
    sumatoriaFactorConvexidad += factorConvexidad;
  });
  
  // Duración = Σ[t * CFt / (1+r)^t] / Σ[CFt / (1+r)^t]  
  const denominadorDuracion = periodosFuturos.reduce((sum, row) => sum + row.flujoActualizado, 0);
  const duracion = sumatoriaFAxPlazo / denominadorDuracion;
  
  // Convexidad = Σ[t * CFt * (t+1) / (1+r)^(t+2)] / Σ[CFt / (1+r)^t]
  const convexidad = sumatoriaFactorConvexidad / (Math.pow(1 + cokPeriodico, 2)  * sumatoriaFlujoActualizado * Math.pow(diasXAno/frecuenciaCuponDias,2));  
  // Duración modificada = D / (1 + r)
  const duracionModificada = duracion / (1 + cokPeriodico);
  
  // 8. Cálculo de TIR y tasas efectivas anuales usando fórmulas del marco conceptual
  
  // TCEA = (CPE/M)^(360/n) - 1
  // Donde: CPE = Costo total del préstamo, M = Monto neto recibido, n = plazo en días
  const plazoTotalDias = nTotalPeriodos * frecuenciaCuponDias;
  
  // Para emisor sin escudo fiscal (solo flujos futuros)
  const costoTotalEmisor = tablaAmortizacion
    .filter(row => row.n > 0)
    .reduce((sum, row) => sum + Math.abs(row.flujoEmisor), 0);
  const montoNetoRecibidoEmisor = valorComercial - costesInicialesEmisor;
  const tceaEmisor = Math.pow(costoTotalEmisor / montoNetoRecibidoEmisor, 360 / plazoTotalDias) - 1;
  
  // Para emisor con escudo fiscal (solo flujos futuros)
  const costoTotalEmisorConEscudo = tablaAmortizacion
    .filter(row => row.n > 0)
    .reduce((sum, row) => sum + Math.abs(row.flujoEmisorConEscudo), 0);
  const tceaEmisorConEscudo = Math.pow(costoTotalEmisorConEscudo / montoNetoRecibidoEmisor, 360 / plazoTotalDias) - 1;
  
  // TREA = (VF/M)^(360/n) - 1
  // Donde: VF = Valor futuro recibido, M = Monto invertido, n = días del periodo
  const valorFuturoRecibidoBonista = tablaAmortizacion
    .filter(row => row.n > 0)
    .reduce((sum, row) => sum + row.flujoBonista, 0);
  const montoInvertidoBonista = valorComercial + costesInicialesBonista;
  const treaBonista = Math.pow(valorFuturoRecibidoBonista / montoInvertidoBonista, 360 / plazoTotalDias) - 1;
  
  // 9. Resultados finales
  // Calcular inflación periódica promedio de los períodos con inflación
  const inflacionPeriodicaPromedio = Math.pow(1 + (inflacionAnual / 100), frecuenciaCuponDias / diasXAno) - 1;
  
  return {
    nPeriodosPorAno,
    nTotalPeriodos,
    diasCapitalizacion,
    tasaEfectivaPeriodica,
    cokPeriodico,
    inflacionPeriodica: inflacionPeriodicaPromedio,
    costesInicialesEmisor,
    costesInicialesBonista,
    precioActual,
    utilidadPerdida,
    duracion,
    convexidad,
    duracionModificada,
    total: duracion + convexidad,
    tceaEmisor,
    tceaEmisorConEscudo,
    treaBonista,
    tablaAmortizacion
  };
}

/**
 * Calcula los días de capitalización según la fórmula de Excel:
 * =SI(E10="Diaria";1;SI(E10="Quincenal";15;SI(E10="Mensual";30;SI(E10="Bimestral";60;SI(E10="Trimestral";90;SI(E10="Cuatrimestral";120;SI(E10="Semestral";180;360)))))))
 * @param frecuenciaCuponDias Frecuencia del cupón en días
 * @returns Días de capitalización según la frecuencia
 */
export function calcularDiasCapitalizacion(frecuenciaCuponDias: number): number {
  switch (frecuenciaCuponDias) {
    case 1:
      return 1;     // Diaria
    case 15:
      return 15;    // Quincenal
    case 30:
      return 30;    // Mensual
    case 60:
      return 60;    // Bimestral
    case 90:
      return 90;    // Trimestral
    case 120:
      return 120;   // Cuatrimestral
    case 180:
      return 180;   // Semestral
    default:
      return 360;   // Anual (por defecto)
  }
}