import React, { useRef, useEffect, useState } from 'react';
import { useMes } from '../../../contexs/MesContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/calendario_mensual.css';
import Iterante from '../otros/IteranteMensual';
import SelectorDelMes from '../otros/SelectorDelMes';
import CrearObjetivoModal from '../otros/modals/CrearObjetivoModal';
import CrearEventoModal from '../otros/modals/CrearEventoModal';
import { usePlanificacion } from '../../../contexs/PlanificacionContext';

const VistaMensual = () => {
  const { mesSeleccionado, setCantSemanas } = useMes();
  const { objetivos, eventos, fetchAll } = usePlanificacion();

  const now = new Date();
  const year = now.getFullYear();
  const navigate = useNavigate();
  const gridRef = useRef(null);

  const [modalAbierto, setModalAbierto] = useState(null); // 'objetivo' | 'evento' | null
  const [mostrarOpciones, setMostrarOpciones] = useState(false);

  const daysInMonth = new Date(year, mesSeleccionado + 1, 0).getDate();
  const firstDay = new Date(year, mesSeleccionado, 1);
  const firstD = ['lu', 'ma', 'mi', 'ju', 'vi', 'sa', 'do'][firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1];

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  useEffect(() => {
    if (gridRef.current) {
      const styles = window.getComputedStyle(gridRef.current);
      const rowCount = styles.gridTemplateRows.split(' ').length - 1;
      setCantSemanas(rowCount);
    }
  }, [mesSeleccionado]);

  const handleClick = () => {
    navigate(-1);
  };

  const getItemsForMonth = () => {
    const items = [];

    objetivos?.forEach(obj => {
      const fecha = new Date(obj.fecha_limite.split('T')[0] + 'T12:00:00');
      if (fecha.getFullYear() === year && fecha.getMonth() === mesSeleccionado) {
        items.push({
          day: fecha.getDate(),
          tipo: 'objetivo',
          titulo: obj.titulo,
          descripcion: obj.descripcion
        });
      }
    });

    eventos?.forEach(evt => {
      const fecha = new Date(evt.fecha.split('T')[0] + 'T12:00:00');
      if (fecha.getFullYear() === year && fecha.getMonth() === mesSeleccionado) {
        items.push({
          day: fecha.getDate(),
          tipo: 'evento',
          titulo: evt.titulo,
          descripcion: evt.descripcion
        });
      }
    });

    return items;
  };

  return (
    <div className="vista-mensual-container">
      <div className="barra">
        <button className="btn btn-outline-primary boton-control" onClick={handleClick}>←</button>
        <SelectorDelMes />
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-success boton-control"
            onClick={() => setMostrarOpciones(prev => !prev)}
          >+</button>

          {mostrarOpciones && (
            <div className="opciones-popup">
              <button className="btn btn-outline-light w-100 mb-2" onClick={() => { setModalAbierto('objetivo'); setMostrarOpciones(false); }}>Objetivo</button>
              <button className="btn btn-outline-light w-100" onClick={() => { setModalAbierto('evento'); setMostrarOpciones(false); }}>Evento</button>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-center text-primary">{monthNames[mesSeleccionado]}</h2>

      <div className="calendario-mensual" ref={gridRef}>
        <span></span>
        <span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sá</span><span>Do</span>
        <Iterante
          day={firstD}
          cant={daysInMonth}
          elementos={getItemsForMonth()}
        />
      </div>

      {modalAbierto === 'objetivo' && (
        <div className="modal-overlay">
          <CrearObjetivoModal onClose={() => { setModalAbierto(null); fetchAll(); }} />
        </div>
      )}

      {modalAbierto === 'evento' && (
        <div className="modal-overlay">
          <CrearEventoModal onClose={() => { setModalAbierto(null); fetchAll(); }} />
        </div>
      )}
    </div>
  );
};

export default VistaMensual;