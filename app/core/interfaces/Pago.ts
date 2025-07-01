export interface Pago {
  id_pago: string;
  fecha_pago: Date;
  monto_pago: number;
  tipo_pago: string;
  bono_id: string;
}