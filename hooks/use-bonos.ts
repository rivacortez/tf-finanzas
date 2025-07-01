import { useState, useEffect } from 'react';
import { BonosService } from '@/app/services/bonos.service';
import { Bono, Pago, Configuracion, ValoracionBono } from '@/app/core/interfaces';
import { useAuth } from '@/app/context/AuthContext';

export const useBonos = () => {
  const [bonos, setBonos] = useState<Bono[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const bonosService = new BonosService();

  const fetchBonos = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userBonos = await bonosService.getBonosByUserId(user.id);
      setBonos(userBonos);
    } catch (err) {
      setError('Error al cargar los bonos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonos();
  }, [user]);

  const createBono = async (bonoData: Omit<Bono, "id_bono">) => {
    if (!user) return null;
    
    try {
      const newBono = await bonosService.createBono({
        ...bonoData,
        usuario_id: user.id
      });
      
      if (newBono) {
        setBonos(prev => [...prev, newBono]);
      }
      
      return newBono;
    } catch (err) {
      setError('Error al crear el bono');
      console.error(err);
      return null;
    }
  };

  const updateBono = async (bonoId: string, updates: Partial<Bono>) => {
    try {
      const updatedBono = await bonosService.updateBono(bonoId, updates);
      
      if (updatedBono) {
        setBonos(prev => prev.map(bono => 
          bono.id_bono === bonoId ? updatedBono : bono
        ));
      }
      
      return updatedBono;
    } catch (err) {
      setError('Error al actualizar el bono');
      console.error(err);
      return null;
    }
  };

  const deleteBono = async (bonoId: string) => {
    try {
      const success = await bonosService.deleteBono(bonoId);
      
      if (success) {
        setBonos(prev => prev.filter(bono => bono.id_bono !== bonoId));
      }
      
      return success;
    } catch (err) {
      setError('Error al eliminar el bono');
      console.error(err);
      return false;
    }
  };

  return {
    bonos,
    loading,
    error,
    createBono,
    updateBono,
    deleteBono,
    refetch: fetchBonos
  };
};

export const useBono = (bonoId: string | null) => {
  const [bono, setBono] = useState<Bono | null>(null);
  const [configuracion, setConfiguracion] = useState<Configuracion | null>(null);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [valoracion, setValoracion] = useState<ValoracionBono | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bonosService = new BonosService();

  const fetchBonoCompleto = async () => {
    if (!bonoId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await bonosService.getBonoCompleto(bonoId);
      
      if (data) {
        setBono(data.bono);
        setConfiguracion(data.configuracion);
        setPagos(data.pagos);
        setValoracion(data.valoracion);
      }
    } catch (err) {
      setError('Error al cargar el bono');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonoCompleto();
  }, [bonoId]);

  const createConfiguracion = async (configData: Omit<Configuracion, "id_configuracion">) => {
    if (!bonoId) return null;
    
    try {
      const newConfig = await bonosService.createConfiguracion({
        ...configData,
        bono_id: bonoId
      });
      
      if (newConfig) {
        setConfiguracion(newConfig);
      }
      
      return newConfig;
    } catch (err) {
      setError('Error al crear la configuración');
      console.error(err);
      return null;
    }
  };

  const createPago = async (pagoData: Omit<Pago, "id_pago">) => {
    if (!bonoId) return null;
    
    try {
      const newPago = await bonosService.createPago({
        ...pagoData,
        bono_id: bonoId
      });
      
      if (newPago) {
        setPagos(prev => [...prev, newPago]);
      }
      
      return newPago;
    } catch (err) {
      setError('Error al crear el pago');
      console.error(err);
      return null;
    }
  };

  const createValoracion = async (valoracionData: Omit<ValoracionBono, "id_valoracion">) => {
    if (!bonoId) return null;
    
    try {
      const newValoracion = await bonosService.createValoracion({
        ...valoracionData,
        bono_id: bonoId
      });
      
      if (newValoracion) {
        setValoracion(newValoracion);
      }
      
      return newValoracion;
    } catch (err) {
      setError('Error al crear la valoración');
      console.error(err);
      return null;
    }
  };

  return {
    bono,
    configuracion,
    pagos,
    valoracion,
    loading,
    error,
    createConfiguracion,
    createPago,
    createValoracion,
    refetch: fetchBonoCompleto
  };
};
