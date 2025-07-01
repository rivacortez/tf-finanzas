"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Tipo para las cuotas del cronograma
type PaymentRow = {
  number: number;
  date: string;
  principal: number;
  interest: number;
  insurance: number;
  commission: number;
  total: number;
  balance: number;
  itf: number;
};

type PaymentScheduleProps = {
  schedule: PaymentRow[];
  currency: string;
};

export default function PaymentSchedule({ schedule, currency }: PaymentScheduleProps) {
  // Formatear valores monetarios
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Calcular totales
  const totals = schedule.reduce(
    (acc, row) => {
      acc.principal += row.principal;
      acc.interest += row.interest;
      acc.insurance += row.insurance;
      acc.commission += row.commission;
      acc.total += row.total;
      acc.itf += row.itf;
      return acc;
    },
    { principal: 0, interest: 0, insurance: 0, commission: 0, total: 0, itf: 0 }
  );

  // Determinar el símbolo de la moneda
  const currencySymbol = currency === "PEN" ? "S/ " : "US$ ";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">Capital Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-green-700 dark:text-green-400">
              {currencySymbol}{formatCurrency(totals.principal)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Intereses Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
              {currencySymbol}{formatCurrency(totals.interest)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">Seguro + Comisiones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
              {currencySymbol}{formatCurrency(totals.insurance + totals.commission)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary/10 dark:bg-primary/20 border-primary/20 dark:border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary dark:text-primary">Monto Total Pagado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-primary dark:text-primary">
              {currencySymbol}{formatCurrency(totals.total)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cronograma de Pagos</CardTitle>
          <CardDescription>
            Método francés con cuotas constantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">N°</TableHead>
                  <TableHead>Fecha de Pago</TableHead>
                  <TableHead className="text-right">Capital</TableHead>
                  <TableHead className="text-right">Intereses</TableHead>
                  <TableHead className="text-right">Seguro</TableHead>
                  <TableHead className="text-right">Comisión</TableHead>
                  <TableHead className="text-right">ITF</TableHead>
                  <TableHead className="text-right bg-primary/5">Cuota Total</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((row) => (
                  <TableRow key={row.number}>
                    <TableCell className="text-center font-medium">{row.number}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell className="text-right">{currencySymbol}{formatCurrency(row.principal)}</TableCell>
                    <TableCell className="text-right">{currencySymbol}{formatCurrency(row.interest)}</TableCell>
                    <TableCell className="text-right">{currencySymbol}{formatCurrency(row.insurance)}</TableCell>
                    <TableCell className="text-right">{currencySymbol}{formatCurrency(row.commission)}</TableCell>
                    <TableCell className="text-right">{currencySymbol}{formatCurrency(row.itf)}</TableCell>
                    <TableCell className="text-right font-medium bg-primary/5">
                      {currencySymbol}{formatCurrency(row.total)}
                    </TableCell>
                    <TableCell className="text-right">{currencySymbol}{formatCurrency(row.balance)}</TableCell>
                  </TableRow>
                ))}
                
                {/* Fila de totales */}
                <TableRow className="bg-gray-50 dark:bg-gray-800 font-medium">
                  <TableCell colSpan={2}>Totales</TableCell>
                  <TableCell className="text-right">{currencySymbol}{formatCurrency(totals.principal)}</TableCell>
                  <TableCell className="text-right">{currencySymbol}{formatCurrency(totals.interest)}</TableCell>
                  <TableCell className="text-right">{currencySymbol}{formatCurrency(totals.insurance)}</TableCell>
                  <TableCell className="text-right">{currencySymbol}{formatCurrency(totals.commission)}</TableCell>
                  <TableCell className="text-right">{currencySymbol}{formatCurrency(totals.itf)}</TableCell>
                  <TableCell className="text-right bg-primary/5">
                    {currencySymbol}{formatCurrency(totals.total)}
                  </TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-lg p-4">
        <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">
          Información importante sobre el cronograma
        </h3>
        <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-1 list-disc pl-4">
          <li>
            Este cronograma es referencial y podría variar según las condiciones específicas de tu bono .
          </li>
          <li>
            La TCEA (Tasa de Costo Efectivo Anual) incluye todos los costos asociados: intereses, seguros y comisiones.
          </li>
          <li>
            Las fechas de pago pueden variar según los días hábiles bancarios.
          </li>
          <li>
            Consulta los términos y condiciones completos antes de firmar tu contrato de bono .
          </li>
        </ul>
      </div>
    </div>
  );
}