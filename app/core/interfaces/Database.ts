export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          username: string;
          first_name: string | null;
          last_name: string | null;
          phone_number: string | null;
          address: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          username: string;
          first_name?: string | null;
          last_name?: string | null;
          phone_number?: string | null;
          address?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          username?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone_number?: string | null;
          address?: string | null;
        };
      };
      roles: {
        Row: {
          id: string;
          role: string;
        };
        Insert: {
          id: string;
          role: string;
        };
        Update: {
          id?: string;
          role?: string;
        };
      };
      users_roles: {
        Row: {
          user_id: string;
          role_id: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          role_id: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          role_id?: string;
          updated_at?: string;
        };
      };
      bonos: {
        Row: {
          id_bono: string;
          monto: number;
          tipo_tasa: string;
          plazo: number;
          tasa_interes: number;
          fecha_emision: string;
          usuario_id: string;
        };
        Insert: {
          id_bono: string;
          monto: number;
          tipo_tasa: string;
          plazo: number;
          tasa_interes: number;
          fecha_emision: string;
          usuario_id: string;
        };
        Update: {
          id_bono?: string;
          monto?: number;
          tipo_tasa?: string;
          plazo?: number;
          tasa_interes?: number;
          fecha_emision?: string;
          usuario_id?: string;
        };
      };
      configuraciones: {
        Row: {
          id_configuracion: string;
          bono_id: string;
          moneda: string;
          tipo_tasa: string;
          capitalizacion: string;
        };
        Insert: {
          id_configuracion: string;
          bono_id: string;
          moneda: string;
          tipo_tasa: string;
          capitalizacion: string;
        };
        Update: {
          id_configuracion?: string;
          bono_id?: string;
          moneda?: string;
          tipo_tasa?: string;
          capitalizacion?: string;
        };
      };
      pagos: {
        Row: {
          id_pago: string;
          fecha_pago: string;
          monto_pago: number;
          bono_id: string;
          tipo_pago: string;
        };
        Insert: {
          id_pago: string;
          fecha_pago: string;
          monto_pago: number;
          bono_id: string;
          tipo_pago: string;
        };
        Update: {
          id_pago?: string;
          fecha_pago?: string;
          monto_pago?: number;
          bono_id?: string;
          tipo_pago?: string;
        };
      };
      valoracion_bonos: {
        Row: {
          id_valoracion: string;
          trea: number;
          tcea: number;
          duracion: number;
          convexidad: number;
          bono_id: string;
        };
        Insert: {
          id_valoracion: string;
          trea: number;
          tcea: number;
          duracion: number;
          convexidad: number;
          bono_id: string;
        };
        Update: {
          id_valoracion?: string;
          trea?: number;
          tcea?: number;
          duracion?: number;
          convexidad?: number;
          bono_id?: string;
        };
      };
    };
  };
}
