import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina clases de Tailwind de manera eficiente, resolviendo conflictos
 * @param inputs Las clases a combinar
 * @returns Las clases combinadas sin conflictos
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}