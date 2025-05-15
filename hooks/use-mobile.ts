"use client";

import { useEffect, useState } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Función para verificar el tamaño de la pantalla
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Verificar inicialmente
    checkMobile();

    // Añadir listener para cambios en el tamaño de la ventana
    window.addEventListener("resize", checkMobile);

    // Limpiar el listener al desmontar
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return isMobile;
}
