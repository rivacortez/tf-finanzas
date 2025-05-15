"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Calculator } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

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
      // Verificar que el período de gracia no sea mayor que el plazo
      if (data.graceType !== "none" && data.gracePeriod >= data.term) {
        form.setError("gracePeriod", {
          type: "manual",
          message: "El período de gracia no puede ser mayor o igual al plazo total"
        });
        return;
      }
      
      // Verificar que la tasa sea razonable (menor a 100%)
      if (data.rateValue > 100) {
        form.setError("rateValue", {
          type: "manual",
          message: "La tasa parece demasiado alta, verifica el valor ingresado"
        });
        return;
      }
      
      // Si es tasa nominal, asegurarse de que haya un período de capitalización
      if (data.rateType === "nominal" && !data.capitalization) {
        data.capitalization = "monthly"; // Valor por defecto
      }
      
      // Codificar datos para pasar en URL
      const encodedData = encodeURIComponent(JSON.stringify(data));
      
      // Navegar a la página de resultados con los datos
      router.push(`/simulator/results?data=${encodedData}`);
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      // Mostrar un mensaje de error general
      alert("Ocurrió un error al procesar el formulario. Por favor, verifica los datos e intenta nuevamente.");
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-2 bg-gradient-to-br from-white to-slate-100 dark:from-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary p-2">
              <Calculator className="h-7 w-7" />
            </span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Simulador de Bonos Educativos</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-lg">
            Simula un bono educativo con el método francés vencido ordinario (cuotas constantes)
          </p>
        </div>
        <Card className="shadow-xl rounded-2xl bg-white/90 dark:bg-zinc-900/80 border border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="font-semibold">Parámetros del Bono</span>
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Ingresa los detalles para calcular el cronograma de pagos e indicadores
            </CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6 flex gap-2 bg-primary/5 rounded-lg p-1">
                  <TabsTrigger value="basic" className="transition-all data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-3 py-1.5">Datos Básicos</TabsTrigger>
                  <TabsTrigger value="rate" className="transition-all data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-3 py-1.5">Tasa de Interés</TabsTrigger>
                  <TabsTrigger value="grace" className="transition-all data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-3 py-1.5">Período de Gracia</TabsTrigger>
                  <TabsTrigger value="additional" className="transition-all data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-3 py-1.5">Adicionales</TabsTrigger>
                </TabsList>
                {/* Datos Básicos */}
                <TabsContent value="basic" className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Monto del Bono</Label>
                      <div className="flex gap-2">
                        <Input
                          id="amount"
                          type="number"
                          placeholder="10,000"
                          {...form.register("amount")}
                          className="focus:ring-2 focus:ring-primary/40 rounded-lg"
                        />
                        <Select 
                          onValueChange={(value) => form.setValue("currency", value as "PEN" | "USD")}
                          defaultValue={form.getValues("currency")}
                        >
                          <SelectTrigger className="w-[100px] rounded-lg">
                            <SelectValue placeholder="Moneda" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PEN">S/ (PEN)</SelectItem>
                            <SelectItem value="USD">$ (USD)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {form.formState.errors.amount && (
                        <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="term">Plazo (en meses)</Label>
                      <Input
                        id="term"
                        type="number"
                        placeholder="24"
                        {...form.register("term")}
                        className="focus:ring-2 focus:ring-primary/40 rounded-lg"
                      />
                      {form.formState.errors.term && (
                        <p className="text-sm text-red-500">{form.formState.errors.term.message}</p>
                      )}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="startDate">Fecha de Inicio</Label>
                      <DatePicker 
                        date={form.getValues("startDate")}
                        setDate={(date) => date && form.setValue("startDate", date)}
                      />
                      {form.formState.errors.startDate && (
                        <p className="text-sm text-red-500">{form.formState.errors.startDate.message}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
                {/* Tasa de Interés */}
                <TabsContent value="rate" className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label>Tipo de Tasa</Label>
                    <RadioGroup 
                      defaultValue={form.getValues("rateType")}
                      onValueChange={(value) => form.setValue("rateType", value as "effective" | "nominal")}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="effective" id="effective" />
                        <Label htmlFor="effective">Tasa Efectiva Anual (TEA)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nominal" id="nominal" />
                        <Label htmlFor="nominal">Tasa Nominal Anual (TNA)</Label>
                      </div>
                    </RadioGroup>
                    {form.formState.errors.rateType && (
                      <p className="text-sm text-red-500">{form.formState.errors.rateType.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <Label htmlFor="rateValue">Valor de la Tasa (%)</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoIcon className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ingrese el valor en porcentaje (Ej: 12 para 12%)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="rateValue"
                        type="number"
                        step="0.01"
                        placeholder="12.00"
                        {...form.register("rateValue")}
                        className="focus:ring-2 focus:ring-primary/40 rounded-lg"
                      />
                      {form.formState.errors.rateValue && (
                        <p className="text-sm text-red-500">{form.formState.errors.rateValue.message}</p>
                      )}
                    </div>
                    {watchRateType === "nominal" && (
                      <div className="space-y-2">
                        <Label htmlFor="capitalization">Período de Capitalización</Label>
                        <Select 
                          onValueChange={(value) => form.setValue("capitalization", value as FormValues["capitalization"])}
                          defaultValue={form.getValues("capitalization") || "monthly"}
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Mensual</SelectItem>
                            <SelectItem value="bimonthly">Bimestral</SelectItem>
                            <SelectItem value="quarterly">Trimestral</SelectItem>
                            <SelectItem value="biannual">Semestral</SelectItem>
                            <SelectItem value="annual">Anual</SelectItem>
                          </SelectContent>
                        </Select>
                        {form.formState.errors.capitalization && (
                          <p className="text-sm text-red-500">{form.formState.errors.capitalization.message}</p>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
                {/* Período de Gracia */}
                <TabsContent value="grace" className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label>Tipo de Período de Gracia</Label>
                    <RadioGroup 
                      defaultValue={form.getValues("graceType")}
                      onValueChange={(value) => form.setValue("graceType", value as "none" | "partial" | "total")}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="none" />
                        <Label htmlFor="none">Sin período de gracia</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="partial" id="partial" />
                        <Label htmlFor="partial">Período de gracia parcial (solo pago de intereses)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="total" id="total" />
                        <Label htmlFor="total">Período de gracia total (no hay pagos, intereses se capitalizan)</Label>
                      </div>
                    </RadioGroup>
                    {form.formState.errors.graceType && (
                      <p className="text-sm text-red-500">{form.formState.errors.graceType.message}</p>
                    )}
                  </div>
                  {watchGraceType !== "none" && (
                    <div className="space-y-2">
                      <Label htmlFor="gracePeriod">Duración del Período de Gracia (meses)</Label>
                      <Input
                        id="gracePeriod"
                        type="number"
                        placeholder="3"
                        {...form.register("gracePeriod")}
                        className="focus:ring-2 focus:ring-primary/40 rounded-lg"
                      />
                      {form.formState.errors.gracePeriod && (
                        <p className="text-sm text-red-500">{form.formState.errors.gracePeriod.message}</p>
                      )}
                    </div>
                  )}
                </TabsContent>
                {/* Adicionales */}
                <TabsContent value="additional" className="space-y-4 animate-fade-in">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="insurance">Seguro de Desgravamen</Label>
                        <p className="text-sm text-muted-foreground">0.05% mensual sobre saldo</p>
                      </div>
                      <Switch
                        id="insurance"
                        checked={form.getValues("insurance")}
                        onCheckedChange={(checked) => form.setValue("insurance", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="commission">Comisión por Servicio</Label>
                        <p className="text-sm text-muted-foreground">S/ 9.00 por cuota</p>
                      </div>
                      <Switch
                        id="commission"
                        checked={form.getValues("commission")}
                        onCheckedChange={(checked) => form.setValue("commission", checked)}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setActiveTab("basic");
                  }}
                  className="rounded-lg"
                >
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
                    className="rounded-lg"
                  >
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
                  className="rounded-lg"
                >
                  Siguiente
                </Button>
              ) : (
                <Button type="submit" className="rounded-lg">Calcular</Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}