// contexs/PlanificacionContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const PlanificacionContext = createContext();

export const PlanificacionProvider = ({ children }) => {
  const [objetivos, setObjetivos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [recordatorios, setRecordatorios] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchAll = async () => {
    try {
      const [objRes, evRes, taRes, reRes, caRes] = await Promise.all([
        axios.get('http://localhost:3000/api/goals', config),       // Aquí agrego objetivos
        axios.get('http://localhost:3000/api/events', config),
        axios.get('http://localhost:3000/api/tasks', config),
        axios.get('http://localhost:3000/api/reminders', config),
        axios.get('http://localhost:3000/api/categories', config)
      ]);
      setObjetivos(objRes.data);
      setEventos(evRes.data);
      setTareas(taRes.data);
      setRecordatorios(reRes.data);
      setCategorias(caRes.data);
      console.log(eventos);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <PlanificacionContext.Provider
      value={{ objetivos, eventos, tareas, recordatorios, categorias, fetchAll }}
    >
      {children}
    </PlanificacionContext.Provider>
  );
};

export const usePlanificacion = () => useContext(PlanificacionContext);