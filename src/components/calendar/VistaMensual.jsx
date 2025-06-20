import React, { useRef, useEffect, useState } from 'react';
import { useMes } from '../../../contexs/MesContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/calendario_mensual.css';
import Iterante from '../otros/IteranteMensual';
import SelectorDelMes from '../otros/SelectorDelMes';
import CrearObjetivoModal from '../otros/modals/CrearObjetivoModal';
import CrearEventoModal from '../otros/modals/CrearEventoModal';
import MostrarInfoModal from '../otros/modals/MostrarInfoModal';
import ModalEdicion from '../otros/modals/ModalEditar';
import { usePlanificacion } from '../../../contexs/PlanificacionContext';

const VistaMensual = () => {
  const { mesSeleccionado, setCantSemanas } = useMes();
  const { objetivos, eventos, fetchAll } = usePlanificacion();

  const now = new Date();
  const year = now.getFullYear();
  const navigate = useNavigate();
  const gridRef = useRef(null);

  const [modalAbierto, setModalAbierto] = useState(null);
  const [mostrarOpciones, setMostrarOpciones] = useState(false);

  const [hoverModalVisible, setHoverModalVisible] = useState(false);
  const [hoverModalItems, setHoverModalItems] = useState([]);
  const [hoverModalDay, setHoverModalDay] = useState(null);
  const [hoverModalPos, setHoverModalPos] = useState({ x: 0, y: 0 });
  
  const hoverTimeoutRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  
  const hoverModalRef = useRef(null);

  // Ajuste para que el modal no se salga de la pantalla verticalmente
  useEffect(() => {
    if (hoverModalVisible && hoverModalRef.current) {
      const rect = hoverModalRef.current.getBoundingClientRect();
      const margen = 10;
      if (rect.bottom > window.innerHeight) {
        const diferencia = rect.bottom - window.innerHeight;
        setHoverModalPos(pos => ({
          x: pos.x,
          y: Math.max(margen, pos.y - diferencia)
        }));
      }
    }
  }, [hoverModalVisible, hoverModalPos]);

  // Cuando el mouse entra al día o al modal, cancelamos timeout y marcamos hover activo
  const handleDayHover = (items, dayNumber, e) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovering(true);
    setHoverModalItems(items);
    setHoverModalDay(dayNumber);
    setHoverModalPos({ x: e.clientX + 10, y: e.clientY + 10 });
    setHoverModalVisible(true);
  };

  // Cuando el mouse sale del día, comenzamos timeout para ocultar si no está en modal
  const handleDayLeave = () => {
    setIsHovering(false);
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isHovering) setHoverModalVisible(false);
    }, 800);
  };

  // Cuando el mouse entra al modal cancelamos timeout y marcamos hover activo
  const handleModalMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovering(true);
  };

  // Cuando el mouse sale del modal comenzamos timeout para ocultar si no está en día
  const handleModalMouseLeave = () => {
    setIsHovering(false);
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isHovering) setHoverModalVisible(false);
    }, 800);
  };

  // Eliminar item
  const handleDelete = async (item) => {
    if (!item || !item.tipo || !item.id) return;
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
      fetchAll?.();
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  const daysInMonth = new Date(year, mesSeleccionado + 1, 0).getDate();
  const firstDay = new Date(year, mesSeleccionado, 1);
  const firstD = ['lu', 'ma', 'mi', 'ju', 'vi', 'sa', 'do'][firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1];

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  useEffect(() => {
    if (gridRef.current) {
      const styles = window.getComputedStyle(gridRef.current);
      const rowCount = styles.gridTemplateRows.split(' ').length - 1;
      setCantSemanas(rowCount);
    }
  }, [mesSeleccionado]);

  const handleClick = () => navigate(-1);

  const getItemsForMonth = () => {
    const items = [];

    objetivos?.forEach(obj => {
      items.push({
        day: new Date(obj.fecha_limite).getDate(),
        tipo: 'objetivo',
        titulo: obj.titulo,
        descripcion: obj.descripcion,
        id: obj.id,
        completado: obj.completado,
        TareaId: obj.TareaId ?? null
      });
    });

    eventos?.forEach(evt => {
      items.push({
        day: new Date(evt.fecha).getDate(),
        tipo: 'evento',
        titulo: evt.titulo,
        descripcion: evt.descripcion,
        id: evt.id,
        tareaId: evt.tareaId ?? null
      });
    });

    return items;
  };

  const [itemEdicion, setItemEdicion] = useState(null);

  return (
    <div className="vista-mensual-container">
      <div className="barra">
        <button className="btn btn-outline-primary boton-control" onClick={handleClick}>←</button>
        <SelectorDelMes />
        <div style={{ position: 'relative' }}>
          <button className="btn btn-success boton-control" onClick={() => setMostrarOpciones(prev => !prev)}>+</button>
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
          onDayHover={handleDayHover}
          onDayLeave={handleDayLeave}
        />
      </div>

      {hoverModalVisible && (
        <div
          ref={hoverModalRef}
          className="modal-hover"
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
            items={hoverModalItems}
            day={hoverModalDay}
            position={hoverModalPos}
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
          onSuccess={fetchAll}
        />
      )}

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