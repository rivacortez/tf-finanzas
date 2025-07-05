"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Calculator, ArrowRight, ArrowLeft, RotateCcw, Sparkles, DollarSign, Calendar, Percent, Clock, Plus, InfoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/ui/navbar";

const formSchema = z.object({
  amount: z.coerce.number().positive("El monto debe ser positivo"),
  currency: z.enum(["PEN", "USD"], {
    required_error: "Selecciona una moneda",
  }),
  term: z.coerce.number().int().positive("El plazo debe ser un número entero positivo"),
  rateType: z.enum(["effective", "nominal"], {
    required_error: "Selecciona el tipo de tasa",
  }),
  rateValue: z.coerce.number().positive("La tasa debe ser positiva"),
  capitalization: z.enum(["monthly", "bimonthly", "quarterly", "biannual", "annual"]).optional(),
  gracePeriod: z.coerce.number().int().min(0, "El período de gracia no puede ser negativo"),
  graceType: z.enum(["none", "partial", "total"], {
    required_error: "Selecciona el tipo de período de gracia",
  }),
  startDate: z.date({
    required_error: "Selecciona una fecha de inicio",
  }),
  insurance: z.boolean().default(false),
  commission: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function SimulatorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 10000,
      currency: "PEN",
      term: 24,
      rateType: "effective",
      rateValue: 12,
      gracePeriod: 0,
      graceType: "none",
      startDate: new Date(),
      insurance: false,
      commission: false,
    },
  });
  
  const watchRateType = form.watch("rateType");
  const watchGraceType = form.watch("graceType");
  
  const onSubmit = (data: FormValues) => {
    try {
      // Validar los datos antes de enviar
      if (data.graceType !== "none" && data.gracePeriod >= data.term) {
        form.setError("gracePeriod", {
          type: "manual",
          message: "El período de gracia no puede ser mayor o igual al plazo total"
        });
        return;
      }
      
      if (data.rateValue > 100) {
        form.setError("rateValue", {
          type: "manual",
          message: "La tasa parece demasiado alta, verifica el valor ingresado"
        });
        return;
      }
      
      if (data.rateType === "nominal" && !data.capitalization) {
        data.capitalization = "monthly";
      }
      
      const encodedData = encodeURIComponent(JSON.stringify(data));
      router.push(`/simulator/results?data=${encodedData}`);
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      alert("Ocurrió un error al procesar el formulario. Por favor, verifica los datos e intenta nuevamente.");
    }
  };

  const tabIcons = {
    basic: DollarSign,
    rate: Percent,
    grace: Clock,
    additional: Plus
  };

  const tabDescriptions = {
    basic: "Configura el monto y plazo del bono",
    rate: "Define la tasa de interés aplicable",
    grace: "Establece períodos de gracia si aplica",
    additional: "Añade seguros y comisiones opcionales"
  };
  
  return (
    <Navbar>
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Simulador de Bonos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Calcula tu cronograma de pagos con el método francés vencido ordinario
          </p>
        </div>

        {/* Indicador de progreso */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Progreso</span>
            <Badge variant="secondary" className="text-xs">
              {activeTab === "basic" && "1/4"} 
              {activeTab === "rate" && "2/4"} 
              {activeTab === "grace" && "3/4"} 
              {activeTab === "additional" && "4/4"}
            </Badge>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ 
                width: activeTab === "basic" ? "25%" : 
                       activeTab === "rate" ? "50%" : 
                       activeTab === "grace" ? "75%" : "100%" 
              }}
            ></div>
          </div>
        </div>

        <Card>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b p-6">
                  <TabsList className="grid w-full grid-cols-4">
                    {Object.entries(tabIcons).map(([key, Icon]) => (
                      <TabsTrigger 
                        key={key}
                        value={key} 
                        className="flex items-center gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {key === "basic" && "Básicos"}
                          {key === "rate" && "Tasa"}
                          {key === "grace" && "Gracia"}
                          {key === "additional" && "Extras"}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {/* Datos Básicos */}
                  <TabsContent value="basic" className="space-y-6 mt-0">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Información Básica</h3>
                      <p className="text-gray-600 dark:text-gray-400">{tabDescriptions.basic}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            Monto del Bono
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-3">
                            <div className="flex-1">
                              <Input
                                id="amount"
                                type="number"
                                placeholder="10,000"
                                {...form.register("amount")}
                                className="h-10"
                              />
                            </div>
                            <Select 
                              onValueChange={(value) => form.setValue("currency", value as "PEN" | "USD")}
                              defaultValue={form.getValues("currency")}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PEN">PEN</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {form.formState.errors.amount && (
                            <p className="text-sm text-red-500 mt-2">
                              {form.formState.errors.amount.message}
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            Plazo del Bono
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="relative">
                            <Input
                              id="term"
                              type="number"
                              placeholder="24"
                              {...form.register("term")}
                              className="h-10 pr-16"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                              meses
                            </span>
                          </div>
                          {form.formState.errors.term && (
                            <p className="text-sm text-red-500 mt-2">
                              {form.formState.errors.term.message}
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="md:col-span-2">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            Fecha de Inicio
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <DatePicker 
                            date={form.getValues("startDate")}
                            setDate={(date) => date && form.setValue("startDate", date)}
                          />
                          {form.formState.errors.startDate && (
                            <p className="text-sm text-red-500 mt-2">
                              {form.formState.errors.startDate.message}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Tasa de Interés */}
                  <TabsContent value="rate" className="space-y-6 mt-0">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Configuración de Tasa</h3>
                      <p className="text-gray-600 dark:text-gray-400">{tabDescriptions.rate}</p>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Percent className="h-5 w-5 text-primary" />
                          Tipo de Tasa
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup 
                          defaultValue={form.getValues("rateType")}
                          onValueChange={(value) => form.setValue("rateType", value as "effective" | "nominal")}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                          <Label
                            htmlFor="effective"
                            className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted transition-colors"
                          >
                            <RadioGroupItem value="effective" id="effective" />
                            <div>
                              <div className="font-medium">Tasa Efectiva Anual</div>
                              <div className="text-sm text-muted-foreground">TEA - Más precisa</div>
                            </div>
                          </Label>
                          <Label
                            htmlFor="nominal"
                            className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted transition-colors"
                          >
                            <RadioGroupItem value="nominal" id="nominal" />
                            <div>
                              <div className="font-medium">Tasa Nominal Anual</div>
                              <div className="text-sm text-muted-foreground">TNA - Requiere capitalización</div>
                            </div>
                          </Label>
                        </RadioGroup>
                        {form.formState.errors.rateType && (
                          <p className="text-sm text-red-500 mt-2">{form.formState.errors.rateType.message}</p>
                        )}
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Percent className="h-5 w-5 text-primary" />
                            Valor de la Tasa
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Ingrese el valor en porcentaje (Ej: 12 para 12%)</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="relative">
                            <Input
                              id="rateValue"
                              type="number"
                              step="0.01"
                              placeholder="12.00"
                              {...form.register("rateValue")}
                              className="h-10 pr-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                          </div>
                          {form.formState.errors.rateValue && (
                            <p className="text-sm text-red-500 mt-2">{form.formState.errors.rateValue.message}</p>
                          )}
                        </CardContent>
                      </Card>

                      {watchRateType === "nominal" && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Clock className="h-5 w-5 text-primary" />
                              Capitalización
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Select 
                              onValueChange={(value) => form.setValue("capitalization", value as FormValues["capitalization"])}
                              defaultValue={form.getValues("capitalization") || "monthly"}
                            >
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder="Seleccionar período" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="monthly">Mensual</SelectItem>
                                <SelectItem value="bimonthly">Bimestral</SelectItem>
                                <SelectItem value="quarterly">Trimestral</SelectItem>
                                <SelectItem value="biannual">Semestral</SelectItem>
                                <SelectItem value="annual">Anual</SelectItem>
                              </SelectContent>
                            </Select>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>

                  {/* Período de Gracia */}
                  <TabsContent value="grace" className="space-y-6 mt-0">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Período de Gracia</h3>
                      <p className="text-gray-600 dark:text-gray-400">{tabDescriptions.grace}</p>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />
                          Tipo de Período de Gracia
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup 
                          defaultValue={form.getValues("graceType")}
                          onValueChange={(value) => form.setValue("graceType", value as "none" | "partial" | "total")}
                          className="space-y-4"
                        >
                          <Label
                            htmlFor="none"
                            className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted transition-colors"
                          >
                            <RadioGroupItem value="none" id="none" className="mt-1" />
                            <div>
                              <div className="font-medium">Sin período de gracia</div>
                              <div className="text-sm text-muted-foreground">Pagos regulares desde el inicio</div>
                            </div>
                          </Label>
                          <Label
                            htmlFor="partial"
                            className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted transition-colors"
                          >
                            <RadioGroupItem value="partial" id="partial" className="mt-1" />
                            <div>
                              <div className="font-medium">Período de gracia parcial</div>
                              <div className="text-sm text-muted-foreground">Solo pago de intereses durante la gracia</div>
                            </div>
                          </Label>
                          <Label
                            htmlFor="total"
                            className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted transition-colors"
                          >
                            <RadioGroupItem value="total" id="total" className="mt-1" />
                            <div>
                              <div className="font-medium">Período de gracia total</div>
                              <div className="text-sm text-muted-foreground">Sin pagos, intereses se capitalizan</div>
                            </div>
                          </Label>
                        </RadioGroup>
                        {form.formState.errors.graceType && (
                          <p className="text-sm text-red-500 mt-2">{form.formState.errors.graceType.message}</p>
                        )}
                      </CardContent>
                    </Card>

                    {watchGraceType !== "none" && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Duración del Período
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="relative">
                            <Input
                              id="gracePeriod"
                              type="number"
                              placeholder="3"
                              {...form.register("gracePeriod")}
                              className="h-10 pr-16"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                              meses
                            </span>
                          </div>
                          {form.formState.errors.gracePeriod && (
                            <p className="text-sm text-red-500 mt-2">{form.formState.errors.gracePeriod.message}</p>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  {/* Adicionales */}
                  <TabsContent value="additional" className="space-y-6 mt-0">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Costos Adicionales</h3>
                      <p className="text-gray-600 dark:text-gray-400">{tabDescriptions.additional}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                              <Sparkles className="h-5 w-5 text-primary" />
                              Seguro de Desgravamen
                            </CardTitle>
                            <Switch
                              id="insurance"
                              checked={form.getValues("insurance")}
                              onCheckedChange={(checked) => form.setValue("insurance", checked)}
                            />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              Protege a tu familia en caso de fallecimiento o invalidez total
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              0.05% mensual sobre saldo
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                              <DollarSign className="h-5 w-5 text-primary" />
                              Comisión por Servicio
                            </CardTitle>
                            <Switch
                              id="commission"
                              checked={form.getValues("commission")}
                              onCheckedChange={(checked) => form.setValue("commission", checked)}
                            />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              Costo administrativo por procesamiento de cada cuota
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              S/ 9.00 por cuota
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>

            {/* Footer */}
            <CardFooter className="border-t p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between w-full">
                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      form.reset();
                      setActiveTab("basic");
                    }}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Limpiar
                  </Button>
                  {activeTab !== "basic" && (
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={() => {
                        const tabs = ["basic", "rate", "grace", "additional"];
                        const currentIndex = tabs.indexOf(activeTab);
                        if (currentIndex > 0) {
                          setActiveTab(tabs[currentIndex - 1]);
                        }
                      }}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                  )}
                </div>
                {activeTab !== "additional" ? (
                  <Button 
                    type="button"
                    onClick={() => {
                      const tabs = ["basic", "rate", "grace", "additional"];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1]);
                      }
                    }}
                    className="gap-2"
                  >
                    Siguiente
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="gap-2 min-w-[140px]"
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Calculando...
                      </>
                    ) : (
                      <>
                        <Calculator className="h-4 w-4" />
                        Calcular
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Tips informativos */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <InfoIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium mb-1">Método Francés</h4>
                  <p className="text-xs text-muted-foreground">
                    Cuotas constantes con amortización creciente e intereses decrecientes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Percent className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium mb-1">Tasa Efectiva</h4>
                  <p className="text-xs text-muted-foreground">
                    Recomendada para cálculos más precisos y transparentes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium mb-1">Período de Gracia</h4>
                  <p className="text-xs text-muted-foreground">
                    Opcional para diferir pagos al inicio del préstamo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium mb-1">Costos Adicionales</h4>
                  <p className="text-xs text-muted-foreground">
                    Incluye seguros y comisiones para un cálculo completo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer informativo */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Los cálculos son referenciales y pueden variar según las condiciones específicas de cada entidad financiera.
          </p>
        </div>
      </div>
    </Navbar>
  );
}