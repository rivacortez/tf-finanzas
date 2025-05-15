"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Esquema de validación con Zod
const formSchema = z.object({
  amount: z.coerce
    .number()
    .min(1000, "El monto mínimo es S/ 1,000")
    .max(100000, "El monto máximo es S/ 100,000"),
  currency: z.enum(["PEN", "USD"], {
    required_error: "Selecciona una moneda",
  }),
  term: z.coerce
    .number()
    .min(6, "El plazo mínimo es 6 meses")
    .max(60, "El plazo máximo es 60 meses"),
  rateType: z.enum(["effective", "nominal"], {
    required_error: "Selecciona un tipo de tasa",
  }),
  rateValue: z.coerce
    .number()
    .min(0.01, "La tasa debe ser mayor a 0.01%")
    .max(70, "La tasa máxima es 70%"),
  capitalization: z.enum(["monthly", "bimonthly", "quarterly", "biannual", "annual"], {
    required_error: "Selecciona un periodo de capitalización",
  }).optional().nullable(),
  gracePeriod: z.coerce
    .number()
    .min(0, "El periodo de gracia no puede ser negativo")
    .max(12, "El periodo de gracia máximo es 12 meses"),
  graceType: z.enum(["none", "total", "partial"], {
    required_error: "Selecciona un tipo de gracia",
  }),
  startDate: z.date({
    required_error: "La fecha de inicio es requerida",
  }),
  insurance: z.boolean().default(true),
  commission: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export default function BondForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Valores predeterminados del formulario
  const defaultValues: Partial<FormValues> = {
    amount: 10000,
    currency: "PEN",
    term: 24,
    rateType: "effective",
    rateValue: 12,
    capitalization: "monthly",
    gracePeriod: 0,
    graceType: "none",
    startDate: new Date(),
    insurance: true,
    commission: true,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    try {
      console.log("Datos del formulario:", values);
      // Aquí se enviarían los datos al servidor para calcular el cronograma
      // Simulamos una espera de 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redireccionar o mostrar resultados
      router.push(`/simulator/results?data=${encodeURIComponent(JSON.stringify(values))}`);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const watchRateType = form.watch("rateType");
  const watchGraceType = form.watch("graceType");

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Datos del Bono Educativo</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Monto y Moneda */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="10000" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moneda</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar moneda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PEN">Soles (S/)</SelectItem>
                      <SelectItem value="USD">Dólares (US$)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Plazo */}
          <FormField
            control={form.control}
            name="term"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plazo (en meses)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="24" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tipo de Tasa y Valor */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="rateType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Tasa</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="effective">Efectiva</SelectItem>
                      <SelectItem value="nominal">Nominal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rateValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor de Tasa (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="12.00" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Capitalización (solo si es tasa nominal) */}
          {watchRateType === "nominal" && (
            <FormField
              control={form.control}
              name="capitalization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Periodo de Capitalización</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar periodo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">Mensual</SelectItem>
                      <SelectItem value="bimonthly">Bimestral</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="biannual">Semestral</SelectItem>
                      <SelectItem value="annual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Requerido solo para tasas nominales
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Periodo de Gracia */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="graceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Gracia</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Sin gracia</SelectItem>
                      <SelectItem value="total">Gracia total</SelectItem>
                      <SelectItem value="partial">Gracia parcial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {watchGraceType !== "none" && (
              <FormField
                control={form.control}
                name="gracePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Periodo de Gracia (meses)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                        disabled={watchGraceType === "none"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Fecha de Inicio */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Inicio</FormLabel>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Opciones adicionales */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Opciones adicionales</h3>
            
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="insurance"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Incluir seguro de desgravamen (0.05%)
                    </FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="commission"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Incluir comisiones (S/ 9.00 por cuota)
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-primary text-white hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Calculando..." : "Calcular Cronograma"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 