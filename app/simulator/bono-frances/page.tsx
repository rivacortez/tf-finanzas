"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CorporateBondInput, CorporateBondResults, calcularBonoFrances } from '@/lib/finance/bond-calculator';
import { CheckCircle, Calculator, AlertCircle } from 'lucide-react';

// Valores por defecto basados en la imagen compartida
const defaultValues: CorporateBondInput = {
  valorNominal: 10000.00,
  valorComercial: 10250.00,
  nDeAnos: 5,
  frecuenciaCuponDias: 180, // Semestral
  diasXAno: 360,
  tipoTasaInteres: "Efectiva",
  tasaInteresAnual: 7.5, // 7.5%
  tasaDescuento: 4.5, // 4.5%
  impuestoRenta: 30, // 30%
  fechaEmision: "2025-06-01", // 01/06/2025
  inflacionAnual: 3.5, // 3.5%
  costos: {
    prima: { porcentaje: 1.0, aplicaA: 'Emisor' }, // 1.00%
    estructuracion: { porcentaje: 0.45, aplicaA: 'Emisor' }, // 0.45%
    colocacion: { porcentaje: 0.25, aplicaA: 'Emisor' }, // 0.25%
    flotacion: { porcentaje: 0.15, aplicaA: 'Ambos' }, // 0.15%
    cavali: { porcentaje: 0.50, aplicaA: 'Ambos' } // 0.50%
  }
};

export default function BonoCorporativoPage() {
  const [input, setInput] = useState<CorporateBondInput>(defaultValues);
  const [results, setResults] = useState<CorporateBondResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAlreadyCalculatedModal, setShowAlreadyCalculatedModal] = useState(false);
  
  // Estados para conversión de monedas
  const [montoConvertir, setMontoConvertir] = useState<number>(1000);
  const [tipoCambio, setTipoCambio] = useState<number>(3.75); // Tipo de cambio por defecto
  const [monedaOrigen, setMonedaOrigen] = useState<'PEN' | 'USD'>('PEN');
  const [montoConvertido, setMontoConvertido] = useState<number>(0);

  // Función para prevenir entrada de caracteres no numéricos
  const preventNonNumericInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permitir teclas de navegación y control
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    
    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey || e.metaKey) {
      return;
    }
    
    // Permitir teclas de navegación
    if (allowedKeys.includes(e.key)) {
      return;
    }
    
    // Permitir punto decimal (solo uno)
    if (e.key === '.' && !e.currentTarget.value.includes('.')) {
      return;
    }
    
    // Permitir solo números
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Función para validar el pegado de texto
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    
    // Validar que el texto pegado solo contenga números y punto decimal
    const numericRegex = /^\d*\.?\d*$/;
    if (!numericRegex.test(pastedText)) {
      e.preventDefault();
    }
  };

  // Función para crear propiedades comunes de campos numéricos
  const getNumericInputProps = (min: string = "0", step: string = "0.01", max?: string) => ({
    type: "number" as const,
    min,
    step,
    ...(max && { max }),
    pattern: "[0-9]*\\.?[0-9]*",
    className: "bg-gray-100 dark:bg-gray-700",
    onKeyDown: preventNonNumericInput,
    onPaste: handlePaste
  });

  const handleInputChange = (field: string, value: string | number) => {
    // Lista de campos que deben ser números positivos
    const positiveNumberFields = ['valorNominal', 'valorComercial', 'nDeAnos', 'tasaInteresAnual', 'tasaDescuento', 'impuestoRenta'];
    
    // Si es un campo de tipo string (input), validar estrictamente
    if (typeof value === 'string') {
      // Permitir campos vacíos
      if (value.trim() === '') {
        setInput((prevInput) => ({
          ...prevInput,
          [field]: ''
        }));
        return;
      }
      
      // Validar que solo contenga números, punto decimal y opcionalmente signo menos
      const numericRegex = /^-?\d*\.?\d*$/;
      if (!numericRegex.test(value)) {
        return; // No actualizar si contiene caracteres inválidos
      }
      
      // Convertir a número y validar
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) {
        return; // No actualizar si no es un número válido
      }
      
      // Validar que no sea negativo para campos que deben ser positivos
      if (numericValue < 0 && positiveNumberFields.includes(field)) {
        return; // No actualizar si el valor es negativo
      }
      
      // Validar rangos específicos
      if (field === 'impuestoRenta' && (numericValue < 0 || numericValue > 100)) {
        return; // Impuesto debe estar entre 0 y 100
      }
      
      setInput((prevInput) => ({
        ...prevInput,
        [field]: numericValue
      }));
    } else {
      // Para valores ya numéricos (selects, etc.)
      setInput((prevInput) => ({
        ...prevInput,
        [field]: value
      }));
    }
  };

  const handleCostChange = (costType: string, field: 'porcentaje' | 'aplicaA', value: string | number) => {
    if (field === 'porcentaje') {
      // Si es un campo de tipo string (input), validar estrictamente
      if (typeof value === 'string') {
        // Permitir campos vacíos
        if (value.trim() === '') {
          setInput((prevInput) => ({
            ...prevInput,
            costos: {
              ...prevInput.costos,
              [costType]: {
                ...prevInput.costos[costType as keyof typeof prevInput.costos],
                [field]: ''
              }
            }
          }));
          return;
        }
        
        // Validar que solo contenga números y punto decimal
        const numericRegex = /^\d*\.?\d*$/;
        if (!numericRegex.test(value)) {
          return; // No actualizar si contiene caracteres inválidos
        }
        
        // Convertir a número y validar
        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) {
          return; // No actualizar si no es un número válido
        }
        
        // Validar que el porcentaje esté entre 0 y 100
        if (numericValue < 0 || numericValue > 100) {
          return; // No actualizar si el valor está fuera del rango válido
        }
        
        setInput((prevInput) => ({
          ...prevInput,
          costos: {
            ...prevInput.costos,
            [costType]: {
              ...prevInput.costos[costType as keyof typeof prevInput.costos],
              [field]: numericValue
            }
          }
        }));
      } else {
        // Para valores ya numéricos
        setInput((prevInput) => ({
          ...prevInput,
          costos: {
            ...prevInput.costos,
            [costType]: {
              ...prevInput.costos[costType as keyof typeof prevInput.costos],
              [field]: value
            }
          }
        }));
      }
    } else {
      // Para campos no numéricos como 'aplicaA'
      setInput((prevInput) => ({
        ...prevInput,
        costos: {
          ...prevInput.costos,
          [costType]: {
            ...prevInput.costos[costType as keyof typeof prevInput.costos],
            [field]: value
          }
        }
      }));
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // Aseguramos que la fecha sea válida y la formateamos como YYYY-MM-DD
      try {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        setInput((prevInput) => ({
          ...prevInput,
          fechaEmision: formattedDate
        }));
      } catch (error) {
        console.error("Error al formatear la fecha:", error);
      }
    }
  };

  // Función para convertir monedas según el marco conceptual: M2 = M1 * T
  const convertirMoneda = useCallback(() => {
    if (monedaOrigen === 'PEN') {
      // Convertir de PEN a USD: USD = PEN / T
      setMontoConvertido(montoConvertir / tipoCambio);
    } else {
      // Convertir de USD a PEN: PEN = USD * T
      setMontoConvertido(montoConvertir * tipoCambio);
    }
  }, [montoConvertir, tipoCambio, monedaOrigen]);

  // Función para intercambiar monedas
  const intercambiarMonedas = () => {
    setMonedaOrigen(monedaOrigen === 'PEN' ? 'USD' : 'PEN');
    setMontoConvertir(montoConvertido);
  };

  // Actualizar conversión automáticamente cuando cambian los valores
  useEffect(() => {
    convertirMoneda();
  }, [convertirMoneda]);

  const handleCalculate = () => {
    // Si ya hay resultados, mostrar modal de ya calculado
    if (results) {
      setShowAlreadyCalculatedModal(true);
      return;
    }

    setIsCalculating(true);
    
    // Simular un delay para mostrar el loading
    setTimeout(() => {
      try {
        const calculatedResults = calcularBonoFrances(input);
        setResults(calculatedResults);
        setShowSuccessModal(true);
      } catch (error) {
        console.error("Error al calcular el bono:", error);
        // Aquí podrías mostrar un mensaje de error al usuario
      } finally {
        setIsCalculating(false);
      }
    }, 1500); // 1.5 segundos de loading
  };

  const handleRecalculate = () => {
    setResults(null);
    setShowAlreadyCalculatedModal(false);
    // Ejecutar el cálculo inmediatamente
    handleCalculate();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 2) => {
    return new Intl.NumberFormat('es-PE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };

  // Función para obtener el nombre de la frecuencia según los días
  const obtenerNombreFrecuencia = (dias: number): string => {
    switch (dias) {
      case 1: return 'Diaria';
      case 15: return 'Quincenal';
      case 30: return 'Mensual';
      case 60: return 'Bimestral';
      case 90: return 'Trimestral';
      case 120: return 'Cuatrimestral';
      case 180: return 'Semestral';
      case 360: return 'Anual';
      default: return 'Personalizada';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Calculadora de Bonos Corporativos - Método Francés</h1>
      
      <Tabs defaultValue="datos">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="datos">Datos del Bono</TabsTrigger>
          <TabsTrigger value="costos">Costos Iniciales</TabsTrigger>
          <TabsTrigger value="conversiones">Conversiones</TabsTrigger>
          <TabsTrigger value="resultados" disabled={!results}>Resultados</TabsTrigger>
          <TabsTrigger value="tabla" disabled={!results}>Tabla de Amortización</TabsTrigger>
        </TabsList>
        
        <TabsContent value="datos">
          <Card>
            <CardHeader>
              <CardTitle>Datos del Bono</CardTitle>
              <CardDescription>Ingresa los datos principales del bono corporativo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="valorNominal">Valor Nominal</Label>
                  <Input
                    id="valorNominal"
                    {...getNumericInputProps()}
                    value={input.valorNominal}
                    onChange={(e) => handleInputChange('valorNominal', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valorComercial">Valor Comercial</Label>
                  <Input
                    id="valorComercial"
                    {...getNumericInputProps()}
                    value={input.valorComercial}
                    onChange={(e) => handleInputChange('valorComercial', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nDeAnos">N° de Años</Label>
                  <Input
                    id="nDeAnos"
                    {...getNumericInputProps("0", "0.5")}
                    value={input.nDeAnos}
                    onChange={(e) => handleInputChange('nDeAnos', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frecuenciaCupon">Frecuencia del Cupón</Label>
                  <Select 
                    value={input.frecuenciaCuponDias.toString()} 
                    onValueChange={(value) => handleInputChange('frecuenciaCuponDias', parseInt(value))}
                  >
                    <SelectTrigger className="bg-gray-100 dark:bg-gray-700">
                      <SelectValue placeholder="Selecciona la frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Diaria (1 día)</SelectItem>
                      <SelectItem value="15">Quincenal (15 días)</SelectItem>
                      <SelectItem value="30">Mensual (30 días)</SelectItem>
                      <SelectItem value="60">Bimestral (60 días)</SelectItem>
                      <SelectItem value="90">Trimestral (90 días)</SelectItem>
                      <SelectItem value="120">Cuatrimestral (120 días)</SelectItem>
                      <SelectItem value="180">Semestral (180 días)</SelectItem>
                      <SelectItem value="360">Anual (360 días)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diasXAno">Días por Año</Label>
                  <Select 
                    value={input.diasXAno.toString()} 
                    onValueChange={(value) => handleInputChange('diasXAno', parseInt(value))}
                  >
                    <SelectTrigger className="bg-gray-100 dark:bg-gray-700">
                      <SelectValue placeholder="Selecciona los días por año" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="360">360 días</SelectItem>
                      <SelectItem value="365">365 días</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipoTasaInteres">Tipo de Tasa de Interés</Label>
                  <Select 
                    value={input.tipoTasaInteres} 
                    onValueChange={(value) => handleInputChange('tipoTasaInteres', value)}
                  >
                    <SelectTrigger className="bg-gray-100 dark:bg-gray-700">
                      <SelectValue placeholder="Selecciona el tipo de tasa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Efectiva">Efectiva</SelectItem>
                      <SelectItem value="Nominal">Nominal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tasaInteresAnual">Tasa de Interés Anual (%)</Label>
                  <Input
                    id="tasaInteresAnual"
                    {...getNumericInputProps()}
                    value={input.tasaInteresAnual}
                    onChange={(e) => handleInputChange('tasaInteresAnual', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tasaDescuento">Tasa Anual de Descuento (COK) (%)</Label>
                  <Input
                    id="tasaDescuento"
                    {...getNumericInputProps()}
                    value={input.tasaDescuento}
                    onChange={(e) => handleInputChange('tasaDescuento', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="impuestoRenta">Impuesto a la Renta (%)</Label>
                  <Input
                    id="impuestoRenta"
                    {...getNumericInputProps("0", "0.01", "100")}
                    value={input.impuestoRenta}
                    onChange={(e) => handleInputChange('impuestoRenta', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaEmision">Fecha de Emisión</Label>
                  <DatePicker
                    date={input.fechaEmision ? new Date(input.fechaEmision) : undefined}
                    setDate={handleDateChange}
                    placeholder="Seleccionar fecha"
                    className="bg-gray-100 dark:bg-gray-700"
                  />
                </div>


              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleCalculate} 
                disabled={isCalculating}
                className="ml-auto shadow-lg hover:shadow-xl transition-shadow"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Calculando...
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4 mr-2" />
                    Calcular Bono
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="costos">
          <Card>
            <CardHeader>
              <CardTitle>Costos Iniciales</CardTitle>
              <CardDescription>Define los costos iniciales y a quién se le aplican</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Concepto</TableHead>
                      <TableHead>Porcentaje (%)</TableHead>
                      <TableHead>Aplica a</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Prima</TableCell>
                      <TableCell>
                        <Input
                          {...getNumericInputProps("0", "0.01", "100")}
                          value={input.costos.prima.porcentaje}
                          onChange={(e) => handleCostChange('prima', 'porcentaje', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={input.costos.prima.aplicaA} 
                          onValueChange={(value) => handleCostChange('prima', 'aplicaA', value as 'Emisor' | 'Bonista' | 'Ambos')}
                        >
                          <SelectTrigger className="bg-gray-100 dark:bg-gray-700">
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Emisor">Emisor</SelectItem>
                            <SelectItem value="Bonista">Bonista</SelectItem>
                            <SelectItem value="Ambos">Ambos</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Estructuración</TableCell>
                      <TableCell>
                        <Input
                          {...getNumericInputProps("0", "0.01", "100")}
                          value={input.costos.estructuracion.porcentaje}
                          onChange={(e) => handleCostChange('estructuracion', 'porcentaje', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={input.costos.estructuracion.aplicaA} 
                          onValueChange={(value) => handleCostChange('estructuracion', 'aplicaA', value as 'Emisor' | 'Bonista' | 'Ambos')}
                        >
                          <SelectTrigger className="bg-gray-100 dark:bg-gray-700">
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Emisor">Emisor</SelectItem>
                            <SelectItem value="Bonista">Bonista</SelectItem>
                            <SelectItem value="Ambos">Ambos</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Colocación</TableCell>
                      <TableCell>
                        <Input
                          {...getNumericInputProps("0", "0.01", "100")}
                          value={input.costos.colocacion.porcentaje}
                          onChange={(e) => handleCostChange('colocacion', 'porcentaje', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={input.costos.colocacion.aplicaA} 
                          onValueChange={(value) => handleCostChange('colocacion', 'aplicaA', value as 'Emisor' | 'Bonista' | 'Ambos')}
                        >
                          <SelectTrigger className="bg-gray-100 dark:bg-gray-700">
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Emisor">Emisor</SelectItem>
                            <SelectItem value="Bonista">Bonista</SelectItem>
                            <SelectItem value="Ambos">Ambos</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Flotación</TableCell>
                      <TableCell>
                        <Input
                          {...getNumericInputProps("0", "0.01", "100")}
                          value={input.costos.flotacion.porcentaje}
                          onChange={(e) => handleCostChange('flotacion', 'porcentaje', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={input.costos.flotacion.aplicaA} 
                          onValueChange={(value) => handleCostChange('flotacion', 'aplicaA', value as 'Emisor' | 'Bonista' | 'Ambos')}
                        >
                          <SelectTrigger className="bg-gray-100 dark:bg-gray-700">
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Emisor">Emisor</SelectItem>
                            <SelectItem value="Bonista">Bonista</SelectItem>
                            <SelectItem value="Ambos">Ambos</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>CAVALI</TableCell>
                      <TableCell>
                        <Input
                          {...getNumericInputProps("0", "0.01", "100")}
                          value={input.costos.cavali.porcentaje}
                          onChange={(e) => handleCostChange('cavali', 'porcentaje', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={input.costos.cavali.aplicaA} 
                          onValueChange={(value) => handleCostChange('cavali', 'aplicaA', value as 'Emisor' | 'Bonista' | 'Ambos')}
                        >
                          <SelectTrigger className="bg-gray-100 dark:bg-gray-700">
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Emisor">Emisor</SelectItem>
                            <SelectItem value="Bonista">Bonista</SelectItem>
                            <SelectItem value="Ambos">Ambos</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleCalculate} 
                disabled={isCalculating}
                className="ml-auto shadow-lg hover:shadow-xl transition-shadow"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Calculando...
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4 mr-2" />
                    Calcular Bono
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversiones">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversión de Monedas</CardTitle>
                <CardDescription>Convierte entre Soles (PEN) y Dólares (USD)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoCambio">Tipo de Cambio (PEN por USD)</Label>
                    <Input
                      id="tipoCambio"
                      {...getNumericInputProps("0", "0.0001")}
                      value={tipoCambio}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Validar que solo contenga números y punto decimal
                        const numericRegex = /^\d*\.?\d*$/;
                        if (value === '' || numericRegex.test(value)) {
                          const numericValue = parseFloat(value) || 0;
                          if (numericValue >= 0) setTipoCambio(numericValue);
                        }
                      }}
                      placeholder="Ej: 3.75"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="monedaOrigen">Moneda de Origen</Label>
                    <Select 
                      value={monedaOrigen} 
                      onValueChange={(value) => setMonedaOrigen(value as 'PEN' | 'USD')}
                    >
                      <SelectTrigger className="bg-gray-100 dark:bg-gray-700">
                        <SelectValue placeholder="Selecciona moneda" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PEN">Soles (PEN)</SelectItem>
                        <SelectItem value="USD">Dólares (USD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="montoConvertir">Monto a Convertir</Label>
                    <Input
                      id="montoConvertir"
                      {...getNumericInputProps()}
                      value={montoConvertir}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Validar que solo contenga números y punto decimal
                        const numericRegex = /^\d*\.?\d*$/;
                        if (value === '' || numericRegex.test(value)) {
                          const numericValue = parseFloat(value) || 0;
                          if (numericValue >= 0) setMontoConvertir(numericValue);
                        }
                      }}
                      placeholder="Ingresa el monto"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={intercambiarMonedas}
                      variant="outline" 
                      className="w-full"
                    >
                      🔄 Intercambiar Monedas
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resultado de la Conversión</CardTitle>
                <CardDescription>Fórmula aplicada: M2 = M1 × T</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {monedaOrigen === 'PEN' ? 'Convertir a USD' : 'Convertir a PEN'}
                    </div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {monedaOrigen === 'PEN' 
                        ? `$${montoConvertido.toFixed(2)} USD`
                        : `S/ ${montoConvertido.toFixed(2)} PEN`
                      }
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Detalles del Cálculo:</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {monedaOrigen === 'PEN' ? (
                        <>
                          <div>Fórmula: USD = PEN ÷ Tipo de Cambio</div>
                          <div>Cálculo: {montoConvertir.toFixed(2)} ÷ {tipoCambio.toFixed(4)} = {montoConvertido.toFixed(2)}</div>
                        </>
                      ) : (
                        <>
                          <div>Fórmula: PEN = USD × Tipo de Cambio</div>
                          <div>Cálculo: {montoConvertir.toFixed(2)} × {tipoCambio.toFixed(4)} = {montoConvertido.toFixed(2)}</div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <div className="font-medium mb-1">Donde:</div>
                      <div>• M1 = Moneda base ({monedaOrigen})</div>
                      <div>• M2 = Moneda convertida ({monedaOrigen === 'PEN' ? 'USD' : 'PEN'})</div>
                      <div>• T = Tipo de cambio ({tipoCambio.toFixed(4)})</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Tabla de Conversiones Rápidas</CardTitle>
              <CardDescription>Conversiones comunes al tipo de cambio actual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Soles (PEN)</TableHead>
                      <TableHead className="text-center">Dólares (USD)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[100, 500, 1000, 5000, 10000, 50000].map((monto) => (
                      <TableRow key={monto}>
                        <TableCell className="text-center font-medium">
                          S/ {monto.toLocaleString('es-PE')}
                        </TableCell>
                        <TableCell className="text-center">
                          ${(monto / tipoCambio).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Tipo de cambio utilizado: S/ {tipoCambio.toFixed(4)} por USD
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resultados">
          {results && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estructuración del Bono</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Frecuencia del cupón</TableCell>
                        <TableCell className="bg-blue-100 dark:bg-blue-900/50 text-right">{input.frecuenciaCuponDias} días</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Días capitalización</TableCell>
                        <TableCell className="bg-blue-100 dark:bg-blue-900/50 text-right">{Math.round(results.diasCapitalizacion)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>N° Periodos por Año</TableCell>
                        <TableCell className="bg-blue-100 dark:bg-blue-900/50 text-right">{results.nPeriodosPorAno}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>N° Total de Periodos</TableCell>
                        <TableCell className="bg-blue-100 dark:bg-blue-900/50 text-right">{results.nTotalPeriodos}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Tasa efectiva anual</TableCell>
                        <TableCell className="bg-blue-100 dark:bg-blue-900/50 text-right">{formatPercent(input.tasaInteresAnual / 100)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Tasa efectiva {obtenerNombreFrecuencia(input.frecuenciaCuponDias)}</TableCell>
                        <TableCell className="bg-blue-100 dark:bg-blue-900/50 text-right">{formatPercent(results.tasaEfectivaPeriodica)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>COK {obtenerNombreFrecuencia(input.frecuenciaCuponDias)}</TableCell>
                        <TableCell className="bg-blue-100 dark:bg-blue-900/50 text-right">{formatPercent(results.cokPeriodico)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Costos Iniciales</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Costes Iniciales Emisor</TableCell>
                        <TableCell className="bg-blue-100 dark:bg-blue-900/50 text-right">{formatCurrency(results.costesInicialesEmisor)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Costes Iniciales Bonista</TableCell>
                        <TableCell className="bg-blue-100 dark:bg-blue-900/50 text-right">{formatCurrency(results.costesInicialesBonista)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Precio Actual y Utilidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Precio Actual</TableCell>
                        <TableCell className="bg-blue-100 dark:bg-blue-900/50 text-right">{formatCurrency(results.precioActual)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Utilidad / Pérdida</TableCell>
                        <TableCell className={`text-right ${results.utilidadPerdida >= 0 ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                          {formatCurrency(results.utilidadPerdida)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Ratios de Decisión</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Duración (años)</TableCell>
                        <TableCell className="bg-blue-100 dark:bg-blue-900/50 text-right">{formatNumber(results.duracion)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Convexidad</TableCell>
                        <TableCell className="bg-blue-100 dark:bg-blue-900/50 text-right">{formatNumber(results.convexidad)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell className="bg-blue-100 dark:bg-blue-900/50 text-right">{formatNumber(results.total)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Duración modificada</TableCell>
                        <TableCell className="bg-blue-100 dark:bg-blue-900/50 text-right">{formatNumber(results.duracionModificada)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Indicadores de Rentabilidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Indicador</TableHead>
                        <TableHead className="text-right">Sin Escudo</TableHead>
                        <TableHead className="text-right">Con Escudo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>TCEA Emisor</TableCell>
                        <TableCell className="bg-blue-100 dark:bg-blue-900/50 text-right">{formatPercent(results.tceaEmisor)}</TableCell>
                        <TableCell className="bg-blue-100 dark:bg-blue-900/50 text-right">{formatPercent(results.tceaEmisorConEscudo)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>TREA Bonista</TableCell>
                        <TableCell colSpan={2} className="bg-blue-100 dark:bg-blue-900/50 text-right">{formatPercent(results.treaBonista)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="tabla">
          {results && (
            <Card>
              <CardHeader>
                <CardTitle>Tabla de Amortización</CardTitle>
                <CardDescription>Detalle del cronograma de pagos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>N°</TableHead>
                        <TableHead>Fecha Programada</TableHead>
                        <TableHead>Inflación Anual</TableHead>
                        <TableHead>Inflación {obtenerNombreFrecuencia(input.frecuenciaCuponDias)}</TableHead>
                        <TableHead>Plazo de Gracia</TableHead>
                        <TableHead>Bono</TableHead>
                        <TableHead>Bono Indexado</TableHead>
                        <TableHead>Cupón (Interés)</TableHead>
                        <TableHead>Cuota</TableHead>
                        <TableHead>Amort.</TableHead>
                        <TableHead>Prima</TableHead>
                        <TableHead>Escudo</TableHead>
                        <TableHead>Flujo Emisor</TableHead>
                        <TableHead>Flujo Emisor c/Escudo</TableHead>
                        <TableHead>Flujo Bonista</TableHead>
                        <TableHead>Flujo Act.</TableHead>
                        <TableHead>FA x Plazo</TableHead>
                        <TableHead>p/Convexidad</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.tablaAmortizacion.map((row) => (
                        <TableRow key={row.n}>
                          <TableCell>{row.n}</TableCell>
                          <TableCell>{row.fechaProgramada}</TableCell>
                          <TableCell className="text-right">{formatPercent(row.inflacionAnual / 100)}</TableCell>
                          <TableCell className="text-right">{formatPercent(row.inflacionPeriodica)}</TableCell>
                          <TableCell className="text-center">{row.plazoGracia}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.bono)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.bonoIndexado)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(Math.abs(row.cuponInteres))}</TableCell>
                          <TableCell className="text-right">{formatCurrency(Math.abs(row.cuota))}</TableCell>
                          <TableCell className="text-right">{formatCurrency(Math.abs(row.amortizacion))}</TableCell>
                          <TableCell className="text-right">{formatCurrency(Math.abs(row.prima))}</TableCell>
                          <TableCell className="text-right">{formatCurrency(Math.abs(row.escudo))}</TableCell>
                          <TableCell className="text-right">{formatCurrency(Math.abs(row.flujoEmisor))}</TableCell>
                          <TableCell className="text-right">{formatCurrency(Math.abs(row.flujoEmisorConEscudo))}</TableCell>
                          <TableCell className="text-right">{formatCurrency(Math.abs(row.flujoBonista))}</TableCell>
                          <TableCell className="text-right">{formatCurrency(Math.abs(row.flujoActualizado))}</TableCell>
                          <TableCell className="text-right">{formatNumber(row.faPorPlazo, 2)}</TableCell>
                          <TableCell className="text-right">{formatNumber(row.factorConvexidad, 2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de éxito */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              ¡Bono Calculado Exitosamente!
            </DialogTitle>
            <DialogDescription>
              El cálculo del bono corporativo se ha completado correctamente. 
              Puedes revisar los resultados en las pestañas &quot;Resultados&quot; y &quot;Tabla de Amortización&quot;.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowSuccessModal(false)}
            >
              Continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de ya calculado */}
      <Dialog open={showAlreadyCalculatedModal} onOpenChange={setShowAlreadyCalculatedModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Bono Ya Calculado
            </DialogTitle>
            <DialogDescription>
              El bono ya ha sido calculado con los datos actuales. 
              ¿Deseas recalcular con los mismos datos o modificar los parámetros?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowAlreadyCalculatedModal(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleRecalculate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Recalcular
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-8 flex justify-center">
        <Button 
          size="lg" 
          className="px-8 shadow-lg hover:shadow-xl transition-shadow" 
          onClick={handleCalculate} 
          disabled={isCalculating}
        >
          {isCalculating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Calculando...
            </>
          ) : (
            <>
              <Calculator className="h-4 w-4 mr-2" />
              Calcular Bono
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
