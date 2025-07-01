import { createClient } from "@/utils/supabase/client";
import { Bono, Pago, Configuracion, ValoracionBono } from "@/app/core/interfaces";

export class BonosService {
  private supabase = createClient();

  // Crear un nuevo bono
  async createBono(bono: Omit<Bono, "id_bono">): Promise<Bono | null> {
    try {
      const { data, error } = await this.supabase
        .from('bonos')
        .insert([bono])
        .select()
        .single();

      if (error) {
        console.error("Error creating bono:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error creating bono:", error);
      return null;
    }
  }

  // Obtener todos los bonos de un usuario
  async getBonosByUserId(userId: string): Promise<Bono[]> {
    try {
      const { data, error } = await this.supabase
        .from('bonos')
        .select('*')
        .eq('usuario_id', userId);

      if (error) {
        console.error("Error getting bonos:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error getting bonos:", error);
      return [];
    }
  }

  // Obtener un bono por ID
  async getBonoById(bonoId: string): Promise<Bono | null> {
    try {
      const { data, error } = await this.supabase
        .from('bonos')
        .select('*')
        .eq('id_bono', bonoId)
        .single();

      if (error) {
        console.error("Error getting bono:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error getting bono:", error);
      return null;
    }
  }

  // Actualizar un bono
  async updateBono(bonoId: string, updates: Partial<Bono>): Promise<Bono | null> {
    try {
      const { data, error } = await this.supabase
        .from('bonos')
        .update(updates)
        .eq('id_bono', bonoId)
        .select()
        .single();

      if (error) {
        console.error("Error updating bono:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error updating bono:", error);
      return null;
    }
  }

  // Eliminar un bono
  async deleteBono(bonoId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('bonos')
        .delete()
        .eq('id_bono', bonoId);

      if (error) {
        console.error("Error deleting bono:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting bono:", error);
      return false;
    }
  }

  // Crear configuración para un bono
  async createConfiguracion(configuracion: Omit<Configuracion, "id_configuracion">): Promise<Configuracion | null> {
    try {
      const { data, error } = await this.supabase
        .from('configuraciones')
        .insert([configuracion])
        .select()
        .single();

      if (error) {
        console.error("Error creating configuracion:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error creating configuracion:", error);
      return null;
    }
  }

  // Obtener configuración de un bono
  async getConfiguracionByBonoId(bonoId: string): Promise<Configuracion | null> {
    try {
      const { data, error } = await this.supabase
        .from('configuraciones')
        .select('*')
        .eq('bono_id', bonoId)
        .single();

      if (error) {
        console.error("Error getting configuracion:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error getting configuracion:", error);
      return null;
    }
  }

  // Crear pago para un bono
  async createPago(pago: Omit<Pago, "id_pago">): Promise<Pago | null> {
    try {
      const { data, error } = await this.supabase
        .from('pagos')
        .insert([pago])
        .select()
        .single();

      if (error) {
        console.error("Error creating pago:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error creating pago:", error);
      return null;
    }
  }

  // Obtener pagos de un bono
  async getPagosByBonoId(bonoId: string): Promise<Pago[]> {
    try {
      const { data, error } = await this.supabase
        .from('pagos')
        .select('*')
        .eq('bono_id', bonoId)
        .order('fecha_pago', { ascending: true });

      if (error) {
        console.error("Error getting pagos:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error getting pagos:", error);
      return [];
    }
  }

  // Crear valoración para un bono
  async createValoracion(valoracion: Omit<ValoracionBono, "id_valoracion">): Promise<ValoracionBono | null> {
    try {
      const { data, error } = await this.supabase
        .from('valoracion_bonos')
        .insert([valoracion])
        .select()
        .single();

      if (error) {
        console.error("Error creating valoracion:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error creating valoracion:", error);
      return null;
    }
  }

  // Obtener valoración de un bono
  async getValoracionByBonoId(bonoId: string): Promise<ValoracionBono | null> {
    try {
      const { data, error } = await this.supabase
        .from('valoracion_bonos')
        .select('*')
        .eq('bono_id', bonoId)
        .single();

      if (error) {
        console.error("Error getting valoracion:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error getting valoracion:", error);
      return null;
    }
  }

  // Obtener bono completo con todas sus relaciones
  async getBonoCompleto(bonoId: string) {
    try {
      const [bono, configuracion, pagos, valoracion] = await Promise.all([
        this.getBonoById(bonoId),
        this.getConfiguracionByBonoId(bonoId),
        this.getPagosByBonoId(bonoId),
        this.getValoracionByBonoId(bonoId)
      ]);

      return {
        bono,
        configuracion,
        pagos,
        valoracion
      };
    } catch (error) {
      console.error("Error getting bono completo:", error);
      return null;
    }
  }
}
