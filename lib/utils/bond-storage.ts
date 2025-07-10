import { CorporateBondInput, CorporateBondResults } from '@/lib/finance/bond-calculator';

export interface BondHistoryItem {
  id: string;
  timestamp: number;
  input: CorporateBondInput;
  results: CorporateBondResults;
  name?: string;
}

const BOND_HISTORY_KEY = 'tf_bond_history';
const MAX_HISTORY_ITEMS = 10; // Máximo 10 bonos en el historial

// Función para verificar si localStorage está disponible
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// Función para obtener datos de localStorage
function getLocalStorageItem(key: string): string | null {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
}

// Función para establecer datos en localStorage
function setLocalStorageItem(key: string, value: string): void {
  if (!isLocalStorageAvailable()) return;
  
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('Error setting localStorage:', error);
    throw new Error('No se pudo guardar en el almacenamiento local');
  }
}

// Función para eliminar datos de localStorage
function removeLocalStorageItem(key: string): void {
  if (!isLocalStorageAvailable()) return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

// Obtener el historial de bonos desde localStorage
export function getBondHistory(): BondHistoryItem[] {
  try {
    const storageValue = getLocalStorageItem(BOND_HISTORY_KEY);
    if (!storageValue) return [];
    
    const history = JSON.parse(storageValue) as BondHistoryItem[];
    
    // Validar que sea un array válido
    if (!Array.isArray(history)) return [];
    
    // Ordenar por timestamp descendente (más reciente primero)
    return history.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error parsing bond history from localStorage:', error);
    return [];
  }
}

// Guardar un nuevo bono en el historial
export function saveBondToHistory(
  input: CorporateBondInput, 
  results: CorporateBondResults,
  name?: string
): string {
  try {
    if (!isLocalStorageAvailable()) {
      throw new Error('LocalStorage no está disponible');
    }
    
    const currentHistory = getBondHistory();
    
    // Crear nuevo item
    const newBond: BondHistoryItem = {
      id: generateBondId(),
      timestamp: Date.now(),
      input: { ...input },
      results: { ...results },
      name
    };
    
    // Agregar al inicio del array y limitar a MAX_HISTORY_ITEMS
    const updatedHistory = [newBond, ...currentHistory].slice(0, MAX_HISTORY_ITEMS);
    
    // Guardar en localStorage
    setLocalStorageItem(BOND_HISTORY_KEY, JSON.stringify(updatedHistory));
    
    console.log('Bono guardado en localStorage:', newBond.id);
    return newBond.id;
  } catch (error) {
    console.error('Error saving bond to history:', error);
    throw new Error('No se pudo guardar el bono en el historial');
  }
}

// Eliminar un bono específico del historial
export function removeBondFromHistory(bondId: string): void {
  try {
    const currentHistory = getBondHistory();
    const updatedHistory = currentHistory.filter(bond => bond.id !== bondId);
    
    if (updatedHistory.length === 0) {
      removeLocalStorageItem(BOND_HISTORY_KEY);
    } else {
      setLocalStorageItem(BOND_HISTORY_KEY, JSON.stringify(updatedHistory));
    }
    
    console.log('Bono eliminado del historial:', bondId);
  } catch (error) {
    console.error('Error removing bond from history:', error);
    throw new Error('No se pudo eliminar el bono del historial');
  }
}

// Limpiar todo el historial
export function clearBondHistory(): void {
  try {
    removeLocalStorageItem(BOND_HISTORY_KEY);
    console.log('Historial de bonos limpiado');
  } catch (error) {
    console.error('Error clearing bond history:', error);
    throw new Error('No se pudo limpiar el historial');
  }
}

// Obtener un bono específico por ID
export function getBondById(bondId: string): BondHistoryItem | null {
  try {
    const history = getBondHistory();
    return history.find(bond => bond.id === bondId) || null;
  } catch (error) {
    console.error('Error getting bond by ID:', error);
    return null;
  }
}

// Generar ID único para el bono
function generateBondId(): string {
  return `bond_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Verificar si hay espacio para más bonos
export function canSaveMoreBonds(): boolean {
  const currentHistory = getBondHistory();
  return currentHistory.length < MAX_HISTORY_ITEMS;
}

// Obtener estadísticas del historial
export function getHistoryStats() {
  const history = getBondHistory();
  
  return {
    totalBonds: history.length,
    maxCapacity: MAX_HISTORY_ITEMS,
    hasSpace: history.length < MAX_HISTORY_ITEMS,
    oldestBond: history.length > 0 ? Math.min(...history.map(b => b.timestamp)) : null,
    newestBond: history.length > 0 ? Math.max(...history.map(b => b.timestamp)) : null
  };
}
