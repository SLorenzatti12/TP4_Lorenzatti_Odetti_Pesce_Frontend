import React, { useState, useRef, useEffect } from 'react';
import { useMes } from '../../../contexs/MesContext';
import '../../styles/calendario_anual.css';
import IteranteAnual from '../otros/IteranteAnual';
import CrearObjetivoModal from '../otros/modals/CrearObjetivoModal';
import CrearEventoModal from '../otros/modals/CrearEventoModal';
import MostrarInfoModal from '../otros/modals/MostrarInfoModal';
import ModalEdicion from '../otros/modals/ModalEditar';
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
  const [itemEdicion, setItemEdicion] = useState(null);

  const navigate = useNavigate();

  // --- Estados para hover modal ---
  const [hoverModalVisible, setHoverModalVisible] = useState(false);
  const [hoverModalItems, setHoverModalItems] = useState([]);
  const [hoverModalDay, setHoverModalDay] = useState(null);
  const [hoverModalPos, setHoverModalPos] = useState({ x: 0, y: 0 });
  const hoverModalRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  // Ajuste para que el modal no se salga de la pantalla verticalmente
  useEffect(() => {
    if (hoverModalVisible && hoverModalRef.current) {
      const rect = hoverModalRef.current.getBoundingClientRect();
      const margin = 10;
      if (rect.bottom > window.innerHeight) {
        const diff = rect.bottom - window.innerHeight;
        setHoverModalPos(pos => ({
          x: pos.x,
          y: Math.max(margin, pos.y - diff)
        }));
      }
    }
  }, [hoverModalVisible, hoverModalPos]);

  // Manejo del hover para mostrar modal y posicionarlo
  const handleDayHover = (items, dayNumber, e) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovering(true);
    setHoverModalItems(items);
    setHoverModalDay(dayNumber);
    setHoverModalPos({ x: e.clientX + 10, y: e.clientY + 10 });
    setHoverModalVisible(true);
  };

  // Manejo de salida del hover del día
  const handleDayLeave = () => {
    setIsHovering(false);
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isHovering) setHoverModalVisible(false);
    }, 800);
  };

  // Manejo de entrada al modal para cancelar timeout
  const handleModalMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovering(true);
  };

  // Manejo de salida del modal para iniciar timeout
  const handleModalMouseLeave = () => {
    setIsHovering(false);
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isHovering) setHoverModalVisible(false);
    }, 800);
  };

  const handleDelete = async (item) => {
    if (!item || !item.tipo || !item.id) {
      alert('Elemento inválido para eliminar');
      return;
    }
    const endpoint = item.tipo === 'evento' ? 'events' : 'goals';
    const token = localStorage.getItem('token');
    const confirmed = window.confirm(`¿Estás seguro de que querés eliminar este ${item.tipo}?`);
    if (!confirmed) return;
    try {
      const response = await fetch(`http://localhost:3000/api/${endpoint}/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || 'Error desconocido al eliminar');
      }
      alert(`${item.tipo[0].toUpperCase() + item.tipo.slice(1)} eliminado correctamente`);
      setHoverModalVisible(false);
      if (typeof fetchAll === 'function') fetchAll();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar: ' + error.message);
    }
  };

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
      const fecha = new Date(obj.fecha_limite.split('T')[0] + 'T12:00:00');
      if (fecha.getFullYear() === selectedYear && fecha.getMonth() === monthIndex) {
        items.push({
          id: obj.id,
          day: fecha.getDate(),
          tipo: 'objetivo',
          titulo: obj.titulo,
          descripcion: obj.descripcion,
          completado: obj.completado,
          tareaId: obj.TareaId ?? null
        });
      }
    });

    eventos?.forEach(evento => {
      const fecha = new Date(evento.fecha.split('T')[0] + 'T12:00:00');
      if (fecha.getFullYear() === selectedYear && fecha.getMonth() === monthIndex) {
        items.push({
          id: evento.id,
          day: fecha.getDate(),
          tipo: 'evento',
          titulo: evento.titulo,
          descripcion: evento.descripcion,
          tareaId: evento.tareaID ?? null
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
<div className="anio-selector-bar">
  <select
    value={selectedYear}
    className="anio-select"
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

    <div className="anio-bar-spacer"></div> 

  <div style={{ display: 'inline-block', position: 'relative' }}>
    <button className="boton-plus" onClick={() => setShowMenu(!showMenu)} title="Agregar">
      <span style={{ fontSize: "1.5rem", lineHeight: "1" }}>+</span>
    </button>
    {showMenu && (
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: '110%',
          backgroundColor: '#222',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(80,50,160,0.16)',
          zIndex: 1000,
          minWidth: '180px',
          overflow: "hidden"
        }}
      >
        <button
          onClick={() => handleSelectOption('objetivo')}
          style={{
            width: '100%',
            padding: '12px 18px',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            textAlign: 'left',
            fontWeight: 500,
            fontSize: "1rem",
            borderBottom: "1px solid #35336a",
            transition: "background 0.17s"
          }}
          onMouseOver={e => e.currentTarget.style.background='#3f37c950'}
          onMouseOut={e => e.currentTarget.style.background='none'}
        >
          🎯 Crear Objetivo
        </button>
        <button
          onClick={() => handleSelectOption('evento')}
          style={{
            width: '100%',
            padding: '12px 18px',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            textAlign: 'left',
            fontWeight: 500,
            fontSize: "1.05rem",
            transition: "background 0.17s"
          }}
          onMouseOver={e => e.currentTarget.style.background='#3f37c950'}
          onMouseOut={e => e.currentTarget.style.background='none'}
        >
          📅 Crear Evento
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
                onDayHover={handleDayHover}
                onDayLeave={handleDayLeave}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal flotante al pasar el mouse */}
      {hoverModalVisible && (
        <div
          className='modal-hover'
          ref={hoverModalRef}
          style={{
            position: 'fixed',
            top: hoverModalPos.y,
            left: hoverModalPos.x,
            width: '360px',
            backgroundColor: '#333',
            color: 'white',
            borderRadius: '8px',
            padding: '10px',
            zIndex: 2000,
          }}
          onMouseEnter={handleModalMouseEnter}
          onMouseLeave={handleModalMouseLeave}
        >
          <MostrarInfoModal
            visible={hoverModalVisible}
            items={hoverModalItems}
            day={hoverModalDay}
            tareas={tareas}            // paso las tareas para que las muestre
            onMouseEnter={handleModalMouseEnter}
            onMouseLeave={handleModalMouseLeave}
            onEdit={(item) => setItemEdicion(item)}
            onDelete={handleDelete}
            onSuccess={fetchAll}
          />
        </div>
      )}

      {itemEdicion && (
        <ModalEdicion
          item={itemEdicion}
          onClose={() => setItemEdicion(null)}
          onSuccess={fetchAll} // recarga la data
        />
      )}

      {/* Modales para crear */}
      {showObjetivoModal && (
        <div className="modal-overlay">
          <CrearObjetivoModal
            onClose={() => {
              setShowObjetivoModal(false);
              fetchAll();
            }}
          />
        </div>
      )}

      {showEventoModal && (
        <div className="modal-overlay">
          <CrearEventoModal
            onClose={() => {
              setShowEventoModal(false);
              fetchAll();
            }}
          />
        </div>
      )}
    </>
  );
};

export default VistaAnual;