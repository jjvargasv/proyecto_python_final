import React, { createContext, useContext, useState, useCallback } from "react";

const AlertaGlobalContext = createContext();

export function useAlertaGlobal() {
  return useContext(AlertaGlobalContext);
}

export function AlertaGlobalProvider({ children }) {
  const [alerta, setAlerta] = useState(null);

  // Muestra una alerta global durante X segundos
  const mostrarAlerta = useCallback((tipo, mensaje, duracion = 4000) => {
    setAlerta({ tipo, mensaje });
    if (duracion > 0) {
      setTimeout(() => setAlerta(null), duracion);
    }
  }, []);

  // Cierra la alerta manualmente
  const cerrarAlerta = useCallback(() => setAlerta(null), []);

  return (
    <AlertaGlobalContext.Provider value={{ alerta, mostrarAlerta, cerrarAlerta }}>
      {children}
    </AlertaGlobalContext.Provider>
  );
}
