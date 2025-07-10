"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, Eye, Download, Calculator, Calendar, DollarSign } from 'lucide-react';
import { CorporateBondInput, CorporateBondResults } from '@/lib/finance/bond-calculator';
import { getBondHistory, clearBondHistory, removeBondFromHistory, getHistoryStats } from '@/lib/utils/bond-storage';

interface BondHistoryItem {
  id: string;
  timestamp: number;
  input: CorporateBondInput;
  results: CorporateBondResults;
  name?: string;
}

export default function BondsHistoryPage() {
  const [bondHistory, setBondHistory] = useState<BondHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState(getHistoryStats());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const loadBondHistory = () => {
      try {
        const history = getBondHistory();
        console.log('Historial cargado desde localStorage:', history.length, 'bonos');
        setBondHistory(history);
        setStats(getHistoryStats());
      } catch (error) {
        console.error('Error loading bond history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBondHistory();
  }, [mounted]);

  const handleViewDetails = (bond: BondHistoryItem) => {
    // Aquí podrías abrir un modal con más detalles o navegar a una página específica
    console.log('Ver detalles del bono:', bond);
    // Por ahora, simplemente mostramos un alert con información básica
    alert(`Detalles del Bono:
    
Valor Nominal: ${formatCurrency(bond.input.valorNominal)}
Valor Comercial: ${formatCurrency(bond.input.valorComercial)}
Tasa de Interés: ${bond.input.tasaInteresAnual}%
Duración: ${bond.input.nDeAnos} años
Calculado: ${formatDate(bond.timestamp)}`);
  };

  const handleExportBond = (bond: BondHistoryItem) => {
    // Crear un objeto con los datos para exportar
    const exportData = {
      id: bond.id,
      timestamp: bond.timestamp,
      fecha_calculo: formatDate(bond.timestamp),
      input: bond.input,
      results: bond.results,
      name: bond.name
    };

    // Convertir a JSON y crear un blob para descargar
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Crear un enlace de descarga
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bono_${bond.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteBond = (id: string) => {
    try {
      removeBondFromHistory(id);
      setBondHistory(prev => prev.filter(bond => bond.id !== id));
      setStats(getHistoryStats());
      console.log('Bono eliminado de la UI:', id);
    } catch (error) {
      console.error('Error deleting bond:', error);
    }
  };

  const handleClearAll = () => {
    try {
      clearBondHistory();
      setBondHistory([]);
      setStats(getHistoryStats());
      console.log('Historial limpiado desde la UI');
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  // Función para agregar datos de prueba (solo para desarrollo)
  const addTestBond = () => {
    const testInput: CorporateBondInput = {
      valorNominal: 10000,
      valorComercial: 10250,
      nDeAnos: 5,
      frecuenciaCuponDias: 180,
      diasXAno: 360,
      tipoTasaInteres: "Efectiva",
      tasaInteresAnual: 7.5,
      tasaDescuento: 4.5,
      impuestoRenta: 30,
      fechaEmision: "2025-01-10",
      inflacionAnual: 3.5,
      costos: {
        prima: { porcentaje: 1.0, aplicaA: 'Emisor' },
        estructuracion: { porcentaje: 0.45, aplicaA: 'Emisor' },
        colocacion: { porcentaje: 0.25, aplicaA: 'Emisor' },
        flotacion: { porcentaje: 0.15, aplicaA: 'Ambos' },
        cavali: { porcentaje: 0.50, aplicaA: 'Ambos' }
      }
    };

    const testResults: CorporateBondResults = {
      diasCapitalizacion: 180,
      nPeriodosPorAno: 2,
      nTotalPeriodos: 10,
      tasaPeriodicaEfectiva: 0.0367,
      tasaPeriodicaDescuento: 0.0222,
      cuponNominal: 375,
      cuponReal: 375,
      rendimientoTotal: 8750,
      valorPresente: 9845.67,
      duracionModificada: 4.32,
      convexidad: 0.0234,
      tablaAmortizacion: []
    };

    try {
      const bondId = saveBondToHistory(testInput, testResults, 'Bono de Prueba');
      const updatedHistory = getBondHistory();
      setBondHistory(updatedHistory);
      setStats(getHistoryStats());
      console.log('Bono de prueba agregado:', bondId);
    } catch (error) {
      console.error('Error adding test bond:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBondTypeLabel = (input: CorporateBondInput) => {
    return `Bono ${input.tipoTasaInteres} - ${input.frecuenciaCuponDias} días`;
  };

  if (loading || !mounted) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Historial de Bonos</h1>
          <p className="text-muted-foreground mt-2">
            Bonos calculados recientemente guardados temporalmente
          </p>
          {stats.totalBonds > 0 && (
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="secondary">
                {stats.totalBonds} de {stats.maxCapacity} bonos
              </Badge>
              {!stats.hasSpace && (
                <Badge variant="destructive">
                  Límite alcanzado
                </Badge>
              )}
              {stats.newestBond && (
                <span className="text-sm text-muted-foreground">
                  Último: {formatDate(stats.newestBond)}
                </span>
              )}
            </div>
          )}
        </div>
        {bondHistory.length > 0 && (
          <Button 
            variant="outline" 
            onClick={handleClearAll}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpiar Todo
          </Button>
        )}
      </div>

      {bondHistory.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calculator className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hay bonos calculados</h3>
            <p className="text-muted-foreground mb-6">
              Los bonos que calcules se guardarán aquí temporalmente para tu consulta
            </p>
            <Button asChild>
              <a href="/simulator/bono-frances">
                <Calculator className="h-4 w-4 mr-2" />
                Calcular Nuevo Bono
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {bondHistory.map((bond) => (
            <Card key={bond.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      {getBondTypeLabel(bond.input)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      Calculado el {formatDate(bond.timestamp)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {bond.input.nDeAnos} años
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBond(bond.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Datos Principales */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Datos Principales
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Valor Nominal:</span>
                        <span className="font-medium">{formatCurrency(bond.input.valorNominal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Valor Comercial:</span>
                        <span className="font-medium">{formatCurrency(bond.input.valorComercial)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Tasa Interés:</span>
                        <span className="font-medium">{bond.input.tasaInteresAnual}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Tasa Descuento:</span>
                        <span className="font-medium">{bond.input.tasaDescuento}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Resultados Clave */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Resultados Principales
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Días Capitalización:</span>
                        <span className="font-medium">{Math.round(bond.results.diasCapitalizacion)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Períodos por Año:</span>
                        <span className="font-medium">{bond.results.nPeriodosPorAno}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Períodos:</span>
                        <span className="font-medium">{bond.results.nTotalPeriodos}</span>
                      </div>
                    </div>
                  </div>

                  {/* Configuración */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Configuración
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Frecuencia Cupón:</span>
                        <span className="font-medium">{bond.input.frecuenciaCuponDias} días</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Días por Año:</span>
                        <span className="font-medium">{bond.input.diasXAno}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Impuesto Renta:</span>
                        <span className="font-medium">{bond.input.impuestoRenta}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Inflación Anual:</span>
                        <span className="font-medium">{bond.input.inflacionAnual}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(bond)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportBond(bond)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                  <Button size="sm" asChild>
                    <a href="/simulator/bono-frances">
                      <Calculator className="h-4 w-4 mr-2" />
                      Recalcular
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
