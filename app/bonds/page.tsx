'use client';
import React, { useState } from 'react';
import { Calculator, TrendingUp, Calendar, DollarSign, Info, Play, RotateCcw, ArrowRight, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Tipado explícito para los tabs y formData
interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface FormData {
  monto: string;
  plazo: string;
  fechaInicio: string;
}

const tabs: Tab[] = [
  { id: 'datos-basicos', label: 'Datos Básicos', icon: Calculator },
  { id: 'tasa-interes', label: 'Tasa de Interés', icon: TrendingUp },
  { id: 'periodo-gracia', label: 'Período de Gracia', icon: Calendar },
  { id: 'adicionales', label: 'Adicionales', icon: Info }
];

const BondSimulator = () => {
  const [activeTab, setActiveTab] = useState<string>('datos-basicos');
  const [formData, setFormData] = useState<FormData>({
    monto: '10000',
    plazo: '24',
    fechaInicio: '2025-07-01'
  });
  const [formError, setFormError] = useState<string>('');

  // Validación simple para feedback inmediato
  const validateForm = (data: FormData) => {
    if (!data.monto || isNaN(Number(data.monto)) || Number(data.monto) <= 0) {
      return 'El monto debe ser un número mayor a 0';
    }
    if (!data.plazo || isNaN(Number(data.plazo)) || Number(data.plazo) <= 0) {
      return 'El plazo debe ser un número mayor a 0';
    }
    if (!data.fechaInicio) {
      return 'Selecciona una fecha de inicio';
    }
    return '';
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setFormError('');
  };

  const handleClear = () => {
    if (window.confirm('¿Seguro que deseas limpiar el formulario?')) {
      setFormData({ monto: '', plazo: '', fechaInicio: '' });
      setFormError('');
    }
  };

  const handleNext = () => {
    const error = validateForm(formData);
    if (error) {
      setFormError(error);
      return;
    }
    // Lógica para avanzar al siguiente paso
    // Aquí podrías cambiar de tab o navegar a resultados
    setActiveTab('tasa-interes');
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center justify-center rounded-full bg-green-500 p-2">
            <Calculator className="h-7 w-7 text-white" />
          </span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Simulador de Bonos</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
          Simula un bono con el método francés vencido ordinario (cuotas constantes)
        </p>
        <nav className="flex items-center space-x-2 mt-6" aria-label="Progreso del simulador">
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-600">Datos Básicos</span>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
          <div className="flex items-center space-x-1">
            <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            </div>
            <span className="text-sm text-gray-500">Configuración</span>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
          <div className="flex items-center space-x-1">
            <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
            <span className="text-sm text-gray-400">Resultados</span>
          </div>
        </nav>
      </div>
      <Card className="w-full max-w-3xl mx-auto mb-8 p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row w-full">
          {/* Sidebar Navigation */}
          <aside className="md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Parámetros del Bono</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Ingresa los detalles para calcular el cronograma de pagos e indicadores</p>
            <nav className="space-y-2" aria-label="Navegación de parámetros">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      isActive
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-green-600 dark:text-green-400' : ''}`} />
                    <span className="font-medium">{tab.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>
          {/* Main Form Area */}
          <section className="flex-1 p-8 flex flex-col justify-center">
            <form autoComplete="off" onSubmit={e => { e.preventDefault(); handleNext(); }}>
              {activeTab === 'datos-basicos' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Monto del Bono */}
                    <div className="space-y-3">
                      <label htmlFor="monto" className="block text-sm font-semibold text-gray-900 dark:text-white">Monto del Bono</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="monto"
                          name="monto"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={formData.monto}
                          onChange={e => handleInputChange('monto', e.target.value.replace(/[^0-9]/g, ''))}
                          className={`block w-full pl-12 pr-4 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all duration-200 ${formError && formError.includes('monto') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                          placeholder="Ingresa el monto"
                          aria-invalid={!!formError && formError.includes('monto')}
                          aria-describedby="monto-help"
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          <select className="text-sm text-gray-500 dark:text-gray-400 bg-transparent border-none focus:ring-0" aria-label="Moneda">
                            <option>S/ (PEN)</option>
                            <option>$ (USD)</option>
                          </select>
                        </div>
                      </div>
                      <p id="monto-help" className="text-sm text-gray-500 dark:text-gray-400">Valor nominal del bono en la moneda seleccionada</p>
                    </div>
                    {/* Plazo */}
                    <div className="space-y-3">
                      <label htmlFor="plazo" className="block text-sm font-semibold text-gray-900 dark:text-white">Plazo (en meses)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="plazo"
                          name="plazo"
                          type="number"
                          min="1"
                          value={formData.plazo}
                          onChange={e => handleInputChange('plazo', e.target.value.replace(/[^0-9]/g, ''))}
                          className={`block w-full pl-12 pr-4 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all duration-200 ${formError && formError.includes('plazo') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                          placeholder="24"
                          aria-invalid={!!formError && formError.includes('plazo')}
                          aria-describedby="plazo-help"
                        />
                      </div>
                      <p id="plazo-help" className="text-sm text-gray-500 dark:text-gray-400">Duración del bono en meses (ej: 24 meses = 2 años)</p>
                    </div>
                  </div>
                  {/* Fecha de Inicio */}
                  <div className="space-y-3">
                    <label htmlFor="fechaInicio" className="block text-sm font-semibold text-gray-900 dark:text-white">Fecha de Inicio</label>
                    <div className="relative max-w-md">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="fechaInicio"
                        name="fechaInicio"
                        type="date"
                        value={formData.fechaInicio}
                        onChange={e => handleInputChange('fechaInicio', e.target.value)}
                        className={`block w-full pl-12 pr-4 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all duration-200 ${formError && formError.includes('fecha') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                        aria-invalid={!!formError && formError.includes('fecha')}
                        aria-describedby="fecha-help"
                      />
                    </div>
                    <p id="fecha-help" className="text-sm text-gray-500 dark:text-gray-400">Fecha de emisión del bono</p>
                  </div>
                  {/* Info Card */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">Sistema de Amortización Francés</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Este simulador utiliza el método francés con cuotas constantes, donde cada pago mensual incluye capital e intereses en proporciones variables.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab !== 'datos-basicos' && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Configuración Avanzada</h3>
                  <p className="text-gray-600 dark:text-gray-400">Contenido de {tabs.find(tab => tab.id === activeTab)?.label} próximamente</p>
                </div>
              )}
              {formError && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm" role="alert">{formError}</div>
              )}
              <div className="bg-gray-50 dark:bg-gray-700/50 px-8 py-6 border-t border-gray-200 dark:border-gray-600 mt-8 -mx-8">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center space-x-2 px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-xl"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Limpiar</span>
                  </button>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      className="px-8 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled
                      aria-disabled="true"
                    >Anterior</button>
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <span>Siguiente</span>
                      <Play className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </section>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mx-auto">
        <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Capital</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">S/ {parseInt(formData.monto || '0').toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Plazo</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formData.plazo || '0'} meses</p>
            </div>
          </div>
        </Card>
        <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Método</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">Francés</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default BondSimulator;