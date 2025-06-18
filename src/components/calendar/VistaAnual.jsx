import React, { useState } from 'react';
import { useMes } from '../../../contexs/MesContext';
import '../../styles/calendario_anual.css';
import IteranteAnual from '../otros/IteranteAnual';
import CrearObjetivoModal from '../otros/modals/CrearObjetivoModal';
import CrearEventoModal from '../otros/modals/CrearEventoModal';
import { usePlanificacion } from '../../../contexs/PlanificacionContext';
import { useNavigate } from 'react-router-dom';

export const VistaAnual = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { setMesSeleccionado } = useMes();
  const [showMenu, setShowMenu] = useState(false);
  const [showObjetivoModal, setShowObjetivoModal] = useState(false);
  const [showEventoModal, setShowEventoModal] = useState(false);
  const { objetivos, tareas, eventos, fetchAll } = usePlanificacion();
  const navigate = useNavigate();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const getFirstDayOfMonth = (index) => {
    const days = ['do', 'lu', 'ma', 'mi', 'ju', 'vi', 'sa'];
    return days[new Date(selectedYear, index, 1).getDay()];
  };

  const handleMonthClick = (index) => {
    setMesSeleccionado(index);
    navigate('/dashboard/mensual');
  };

  const getItemsForMonth = (monthIndex) => {
    const items = [];

    objetivos?.forEach(obj => {
      const fecha = new Date(obj.fecha_limite);
      if (fecha.getFullYear() === selectedYear && fecha.getMonth() === monthIndex) {
        items.push({
        day: fecha.getDate(),
        tipo: 'objetivo',
        titulo: obj.titulo,
        descripcion: obj.descripcion
        });
      }
    });

    tareas?.forEach(tarea => {
      if (!tarea.fecha_limite) return;
        const fecha = new Date(tarea.fecha_limite);
        if (fecha.getFullYear() === selectedYear && fecha.getMonth() === monthIndex) {
          items.push({
            day: fecha.getDate(),
            tipo: 'tarea',
            titulo: tarea.titulo,
            descripcion: tarea.descripcion
          });
        }
    });

    eventos?.forEach(evento => {
      const fecha = new Date(evento.fecha);
      if (fecha.getFullYear() === selectedYear && fecha.getMonth() === monthIndex) {
        items.push({
          day: fecha.getDate(),
          tipo: 'evento',
          titulo: evento.titulo,
          descripcion: evento.descripcion
        });
      }
    });

    return items;
  };

  const handleSelectOption = (option) => {
    setShowMenu(false);
    if (option === 'objetivo') setShowObjetivoModal(true);
    if (option === 'evento') setShowEventoModal(true);
  };

  return (
    <>
      <div className="barra" style={{ position: 'relative' }}>
        <select
          value={selectedYear}
          className="selector-del-mes"
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {Array.from({ length: 5 }, (_, i) => {
            const yearOption = currentYear - 2 + i;
            return (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            );
          })}
        </select>

        {/* Botón + que abre menú */}
        <div style={{ display: 'inline-block', position: 'relative' }}>
          <button className="btn btn-success boton-control" onClick={() => setShowMenu(!showMenu)}>+</button>

          {showMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '110%',
                backgroundColor: '#222',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                zIndex: 1000,
                minWidth: '140px',
              }}
            >
              <button
                onClick={() => handleSelectOption('objetivo')}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Crear Objetivo
              </button>
              <button
                onClick={() => handleSelectOption('evento')}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Crear Evento
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="calendario_anual">
        {monthNames.map((month, index) => (
          <div key={index} className="mes" onClick={() => handleMonthClick(index)}>
            <div className="nombre_mes">{month} {selectedYear}</div>
            <div className="dias_semana">
              <span>L</span><span>Ma</span><span>Mi</span><span>J</span><span>V</span><span>S</span><span>D</span>
              <IteranteAnual
                day={getFirstDayOfMonth(index)}
                cant={new Date(selectedYear, index + 1, 0).getDate()}
                elementos={getItemsForMonth(index)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modales */}
      {showObjetivoModal && (
        <div className="modal-overlay">
          <CrearObjetivoModal
            onClose={() => {
              setShowObjetivoModal(false);
              fetchAll(); // recarga datos al cerrar modal
            }}
          />
        </div>
      )}

      {showEventoModal && (
        <div className="modal-overlay">
          <CrearEventoModal
            onClose={() => {
              setShowEventoModal(false);
              fetchAll(); // recarga datos al cerrar modal
            }}
          />
        </div>
      )}
    </>
  );
};

export default VistaAnual;