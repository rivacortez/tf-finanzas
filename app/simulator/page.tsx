"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calculator, TrendingUp, Calendar, DollarSign, Info, Play, RotateCcw, ArrowRight, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useForm, FormProvider, Controller } from "react-hook-form";

import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const tabs = [
  { id: "datos-basicos", label: "Datos Básicos", icon: Calculator },
  { id: "tasa-interes", label: "Tasa de Interés", icon: TrendingUp },
  { id: "periodo-gracia", label: "Período de Gracia", icon: Calendar },
  { id: "adicionales", label: "Adicionales", icon: Info },
];

type BondFormType = {
  monto: string;
  currency: "PEN" | "USD";
  plazo: string;
  fechaInicio: Date;
  rateType: "effective" | "nominal";
  rateValue: string;
  capitalization?: string;
  graceType: "none" | "total" | "partial";
  gracePeriod?: string;
  insurance: boolean;
  commission: boolean;
};

const defaultValues: BondFormType = {
  monto: "10000",
  currency: "PEN",
  plazo: "24",
  fechaInicio: new Date(),
  rateType: "effective",
  rateValue: "12",
  capitalization: "monthly",
  graceType: "none",
  gracePeriod: "0",
  insurance: false,
  commission: false,
};

const SimulatorPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("datos-basicos");
  const [formError, setFormError] = useState("");
  const methods = useForm<BondFormType>({
    defaultValues,
    mode: "onTouched",
  });
  const { control, handleSubmit, watch, trigger, formState: { errors }, reset } = methods;

  const handleNext = async () => {
    let fieldsToValidate: (keyof BondFormType)[] = [];
    if (activeTab === "datos-basicos") fieldsToValidate = ["monto", "currency", "plazo", "fechaInicio"];
    if (activeTab === "tasa-interes") fieldsToValidate = ["rateType", "rateValue", "capitalization"];
    if (activeTab === "periodo-gracia") fieldsToValidate = ["graceType", "gracePeriod"];
    if (activeTab === "adicionales") fieldsToValidate = ["insurance", "commission"];
    const valid = await trigger(fieldsToValidate);
    if (!valid) {
      setFormError("Corrige los errores antes de continuar");
      return;
    }
    setFormError("");
    const idx = tabs.findIndex(t => t.id === activeTab);
    if (idx < tabs.length - 1) {
      setActiveTab(tabs[idx + 1].id);
    }
  };

  const handlePrev = () => {
    const idx = tabs.findIndex(t => t.id === activeTab);
    if (idx > 0) {
      setActiveTab(tabs[idx - 1].id);
    }
  };

  const handleClear = () => {
    if (window.confirm("¿Seguro que deseas limpiar el formulario?")) {
      reset(defaultValues);
      setActiveTab("datos-basicos");
      setFormError("");
    }
  };

  const onSubmit = (data: BondFormType) => {
    const encodedData = encodeURIComponent(JSON.stringify({
      amount: Number(data.monto),
      currency: data.currency,
      term: Number(data.plazo),
      rateType: data.rateType,
      rateValue: Number(data.rateValue),
      capitalization: data.rateType === "nominal" ? data.capitalization : undefined,
      gracePeriod: data.graceType !== "none" ? Number(data.gracePeriod) : 0,
      graceType: data.graceType,
      startDate: data.fechaInicio.toISOString().slice(0, 10),
      insurance: data.insurance,
      commission: data.commission,
    }));
    router.push(`/simulator/results?data=${encodedData}`);
  };

  const rateType = watch("rateType");
  const graceType = watch("graceType");

  return (
    <FormProvider {...methods}>
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
            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
              {activeTab === 'datos-basicos' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Monto del Bono */}
                    <Controller
                      control={control}
                      name="monto"
                      rules={{
                        required: "El monto es requerido",
                        validate: (v) => !isNaN(Number(v)) && Number(v) > 0 || "El monto debe ser mayor a 0"
                      }}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <label htmlFor="monto" className="block text-sm font-semibold text-gray-900 dark:text-white">Monto del Bono</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <DollarSign className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              id="monto"
                              type="number"
                              min="1"
                              {...field}
                              className="block w-full pl-12 pr-4 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                              placeholder="Ingresa el monto"
                              aria-describedby="monto-help"
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                              <Controller
                                control={control}
                                name="currency"
                                render={({ field: currencyField }) => (
                                  <Select onValueChange={currencyField.onChange} defaultValue={currencyField.value}>
                                    <SelectTrigger className="text-sm text-gray-500 dark:text-gray-400 bg-transparent border-none focus:ring-0">
                                      <SelectValue placeholder="Moneda" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="PEN">S/ (PEN)</SelectItem>
                                      <SelectItem value="USD">$ (USD)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>
                          </div>
                          <p id="monto-help" className="text-sm text-gray-500 dark:text-gray-400">Valor nominal del bono en la moneda seleccionada</p>
                          {errors.monto && <span className="text-red-500 text-xs">{errors.monto.message}</span>}
                        </div>
                      )}
                    />
                    {/* Plazo */}
                    <Controller
                      control={control}
                      name="plazo"
                      rules={{
                        required: "El plazo es requerido",
                        validate: (v) => !isNaN(Number(v)) && Number(v) > 0 || "El plazo debe ser mayor a 0"
                      }}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <label htmlFor="plazo" className="block text-sm font-semibold text-gray-900 dark:text-white">Plazo (dddd meses)</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              id="plazo"
                              type="number"
                              min="1"
                              {...field}
                              className="block w-full pl-12 pr-4 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                              placeholder="24"
                              aria-describedby="plazo-help"
                            />
                          </div>
                          <p id="plazo-help" className="text-sm text-gray-500 dark:text-gray-400">Duración del bono en meses (ej: 24 meses = 2 años)</p>
                          {errors.plazo && <span className="text-red-500 text-xs">{errors.plazo.message}</span>}
                        </div>
                      )}
                    />
                  </div>
                  {/* Fecha de Inicio */}
                  <Controller
                    control={control}
                    name="fechaInicio"
                    rules={{ required: "La fecha de inicio es obligatoria" }}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <label htmlFor="fechaInicio" className="block text-sm font-semibold text-gray-900 dark:text-white">
                          Fecha de Inicio
                        </label>
                        <DatePicker
                          date={field.value}
                          setDate={field.onChange}
                          placeholder="Seleccionar fecha"
                        />
                        {errors.fechaInicio && <span className="text-red-500 text-xs">{errors.fechaInicio.message}</span>}
                      </div>
                    )}
                  />
                </div>
              )}
              {activeTab === 'tasa-interes' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Tipo de Tasa */}
                    <Controller
                      control={control}
                      name="rateType"
                      rules={{ required: "El tipo de tasa es requerido" }}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white">Tipo de Tasa</label>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="effective">Efectiva</SelectItem>
                              <SelectItem value="nominal">Nominal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    {/* Valor de la Tasa */}
                    <Controller
                      control={control}
                      name="rateValue"
                      rules={{
                        required: "La tasa es requerida",
                        validate: (v) => !isNaN(Number(v)) && Number(v) > 0 || "La tasa debe ser mayor a 0"
                      }}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white">Valor de la Tasa (%)</label>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            className="block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                            placeholder="12.00"
                          />
                          {errors.rateValue && <span className="text-red-500 text-xs">{errors.rateValue.message}</span>}
                        </div>
                      )}
                    />
                  </div>
                  {/* Capitalización (solo si es nominal) */}
                  {rateType === "nominal" && (
                    <Controller
                      control={control}
                      name="capitalization"
                      rules={rateType === "nominal" ? { required: "La capitalización es requerida" } : {}}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white">Período de Capitalización</label>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar periodo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Mensual</SelectItem>
                              <SelectItem value="bimonthly">Bimestral</SelectItem>
                              <SelectItem value="quarterly">Trimestral</SelectItem>
                              <SelectItem value="biannual">Semestral</SelectItem>
                              <SelectItem value="annual">Anual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                  )}
                </div>
              )}
              {activeTab === 'periodo-gracia' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Tipo de Gracia */}
                    <Controller
                      control={control}
                      name="graceType"
                      rules={{ required: "El tipo de gracia es requerido" }}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white">Tipo de Gracia</label>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Sin gracia</SelectItem>
                              <SelectItem value="total">Gracia total</SelectItem>
                              <SelectItem value="partial">Gracia parcial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    {/* Período de Gracia (solo si aplica) */}
                    {graceType !== "none" && (
                      <Controller
                        control={control}
                        name="gracePeriod"
                        rules={graceType ? {
                            required: "El período de gracia es requerido",
                            validate: (v) => !isNaN(Number(v)) && Number(v) >= 0 || "El período de gracia debe ser 0 o mayor"
                          } : {}}
                        render={({ field }) => (
                          <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Duración del Período de Gracia (meses)</label>
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              className="block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                              placeholder="0"
                            />
                            {errors.gracePeriod && <span className="text-red-500 text-xs">{errors.gracePeriod.message}</span>}
                          </div>
                        )}
                      />
                    )}
                  </div>
                </div>
              )}
              {activeTab === 'adicionales' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Seguro de Desgravamen */}
                    <Controller
                      control={control}
                      name="insurance"
                      render={({ field }) => (
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="insurance"
                          />
                          <label htmlFor="insurance" className="text-sm font-semibold text-gray-900 dark:text-white">Seguro de Desgravamen</label>
                        </div>
                      )}
                    />
                    {/* Comisión por Servicio */}
                    <Controller
                      control={control}
                      name="commission"
                      render={({ field }) => (
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="commission"
                          />
                          <label htmlFor="commission" className="text-sm font-semibold text-gray-900 dark:text-white">Comisión por Servicio</label>
                        </div>
                      )}
                    />
                  </div>
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
                      disabled={activeTab === 'datos-basicos'}
                      aria-disabled={activeTab === 'datos-basicos'}
                      onClick={handlePrev}
                    >Anterior</button>
                    {/* Botón Calcular solo en el tab 'adicionales' */}
                    {activeTab === 'adicionales' ? (
                      <button
                        type="submit"
                        className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <span>Calcular</span>
                        <Calculator className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        onClick={handleNext}
                      >
                        <span>Siguiente</span>
                        <Play className="h-4 w-4" />
                      </button>
                    )}
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
              <p className="text-xl font-bold text-gray-900 dark:text-white">{watch('currency') === 'USD' ? '$' : 'S/'} {parseInt(watch('monto') || '0').toLocaleString()}</p>
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
              <p className="text-xl font-bold text-gray-900 dark:text-white">{watch('plazo') || '0'} meses</p>
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
    </FormProvider>
  );
};

export default SimulatorPage;