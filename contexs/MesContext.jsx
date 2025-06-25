import { createContext, useContext, useState } from 'react';

const MesContext = createContext();

export const MesProvider = ({ children }) => {
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
  const [semanaSeleccionada, setSemanaSeleccionada] = useState(null);
  const [cantSemanas, setCantSemanas] = useState(null);
  return (
    <MesContext.Provider value={{
      mesSeleccionado,
      setMesSeleccionado,
      semanaSeleccionada,
      setSemanaSeleccionada, 
      cantSemanas, 
      setCantSemanas
    }}>
      {children}
    </MesContext.Provider>
  );
};

export const useMes = () => useContext(MesContext);