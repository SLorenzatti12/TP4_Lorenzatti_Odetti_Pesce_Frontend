import React, { useState, useRef, useEffect } from 'react';
import '../../styles/vista_semanal.css';
import { useMes } from '../../../contexs/MesContext';
import { useNavigate } from 'react-router-dom';
import { usePlanificacion } from '../../../contexs/PlanificacionContext';

import CrearObjetivoModal from '../otros/modals/CrearObjetivoModal';
import CrearEventoModal from '../otros/modals/CrearEventoModal';
import MostrarInfoModal from '../otros/modals/MostrarInfoModal';
import ModalEdicion from '../otros/modals/ModalEditar';

const dias = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D'];
const horas = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const VistaSemanal = () => {
  const { semanaSeleccionada, cantSemanas, setSemanaSeleccionada, mesSeleccionado } = useMes();
  const { eventos, objetivos, fetchAll } = usePlanificacion();
  const navigate = useNavigate();

  const contenedorRef = useRef(null);
  const hoverModalRef = useRef(null);

  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [menuCoords, setMenuCoords] = useState({ x: 0, y: 0 });
  const [celdaInfo, setCeldaInfo] = useState({ dia: null, hora: null });
  const [showCrearEvento, setShowCrearEvento] = useState(false);
  const [showCrearObjetivo, setShowCrearObjetivo] = useState(false);
  const [fechaEventoPredefinida, setFechaEventoPredefinida] = useState(null);
  const [fechaObjetivoPredefinida, setFechaObjetivoPredefinida] = useState(null);
  const [hoverModalVisible, setHoverModalVisible] = useState(false);
  const [hoverModalItems, setHoverModalItems] = useState([]);
  const [hoverModalPos, setHoverModalPos] = useState({ x: 0, y: 0 });
  const [itemEdicion, setItemEdicion] = useState(null);

  const primerDiaSemana = (() => {
    const primerDiaDelMes = new Date(new Date().getFullYear(), mesSeleccionado, 1);
    const diaDeSemana = (primerDiaDelMes.getDay() + 6) % 7;
    const primerLunes = new Date(primerDiaDelMes);
    primerLunes.setDate(primerDiaDelMes.getDate() - diaDeSemana);
    primerLunes.setHours(0, 0, 0, 0);
    return new Date(primerLunes.setDate(primerLunes.getDate() + semanaSeleccionada * 7));
  })();

  const ultimoDiaSemana = new Date(primerDiaSemana);
  ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 7);

  const calcularFechaDesdeCelda = (dia, hora) => {
    const primerDiaDelMes = new Date(new Date().getFullYear(), mesSeleccionado, 1);
    const diaDeSemana = (primerDiaDelMes.getDay() + 6) % 7;
    const primerLunes = new Date(primerDiaDelMes);
    primerLunes.setDate(primerDiaDelMes.getDate() - diaDeSemana);
    primerLunes.setHours(0, 0, 0, 0);
    const fechaBase = new Date(primerLunes);
    fechaBase.setDate(primerLunes.getDate() + semanaSeleccionada * 7 + dia);
    fechaBase.setHours(hora, 0, 0, 0);
    return fechaBase;
  };

  const handleCeldaClick = (e, dia, hora) => {
    const rect = e.target.getBoundingClientRect();
    const contenedorRect = contenedorRef.current.getBoundingClientRect();
    const offset = 8;
    const menuWidth = 160;
    const isNearRightEdge = rect.right + menuWidth + offset > window.innerWidth;
    const x = isNearRightEdge ? rect.left - contenedorRect.left - menuWidth - offset : rect.right - contenedorRect.left + offset;
    const y = rect.top - contenedorRect.top + offset;
    setMenuCoords({ x, y });
    setCeldaInfo({ dia, hora });
    setMostrarOpciones(true);
  };

  const handleCeldaHover = (e, dia, hora) => {
    const eventosCelda = eventosEnCelda(dia, hora).map(e => ({ ...e, tipo: 'evento' }));
    const objetivosCelda = objetivosEnCelda(dia, hora).map(o => ({ ...o, tipo: 'objetivo' }));
    const items = [...eventosCelda, ...objetivosCelda];
    if (items.length === 0) return;
    const x = e.clientX + 10;
    const y = e.clientY + 10;
    setHoverModalItems(items);
    setHoverModalPos({ x, y });
    setHoverModalVisible(true);
  };

  const handleHoverLeave = () => {
    setHoverModalVisible(false);
  };

  // Opcional: para evitar que el modal desaparezca si pasas mouse sobre él
  const handleHoverModalMouseEnter = () => setHoverModalVisible(true);
  const handleHoverModalMouseLeave = () => setHoverModalVisible(false);

  const handleDelete = async (item) => {
    const endpoint = item.tipo === 'evento' ? 'events' : 'goals';
    const token = localStorage.getItem('token');
    const confirmed = window.confirm(`¿Eliminar ${item.tipo}?`);
    if (!confirmed) return;
    try {
      const res = await fetch(`http://localhost:3000/api/${endpoint}/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Error al eliminar');
      fetchAll?.();
      setHoverModalVisible(false);
    } catch (e) {
      alert(e.message);
    }
  };

  const eventosEnCelda = (dia, hora) =>
    eventos.filter(ev => {
      const fecha = new Date(ev.fecha);
      const d = (fecha.getDay() + 6) % 7;
      const h = fecha.getHours();
      return (
        d === dia &&
        h === hora &&
        fecha >= primerDiaSemana &&
        fecha < ultimoDiaSemana
      );
    });

  const objetivosEnCelda = (dia, hora) =>
    objetivos.filter(obj => {
      const fecha = new Date(obj.fecha_limite);
      fecha.setDate(fecha.getDate() + 1);
      fecha.setHours(23, 0, 0, 0);
      const d = (fecha.getDay() + 6) % 7;
      return (
        d === dia &&
        hora === 23 &&
        fecha >= primerDiaSemana &&
        fecha < ultimoDiaSemana
      );
    });

  // Efecto para corregir que el modal hover no se salga por abajo
  useEffect(() => {
    if (hoverModalVisible && hoverModalRef.current) {
      const rect = hoverModalRef.current.getBoundingClientRect();
      const margen = 10;
      if (rect.bottom > window.innerHeight) {
        const diferencia = rect.bottom - window.innerHeight;
        // Ajustar para que el modal suba lo necesario, pero que no quede menor que margen
        setHoverModalPos(pos => ({
          x: pos.x,
          y: Math.max(margen, pos.y - diferencia)
        }));
      }
    }
  }, [hoverModalVisible, hoverModalPos]);

  return (
    <>
      <div className="barra" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        <button className="btn btn-outline-primary boton-control" onClick={() => navigate(-1)}>←</button>
        <select
          value={semanaSeleccionada}
          className='selector-del-mes'
          onChange={(e) => setSemanaSeleccionada(Number(e.target.value))}
        >
          {Array.from({ length: cantSemanas }, (_, i) => (
            <option key={i} value={i}>Semana {i + 1}</option>
          ))}
        </select>
      </div>

      <h1 className="text-center text-primary">
        Semana {semanaSeleccionada + 1} de {monthNames[mesSeleccionado]}
      </h1>

      <div className="vista_semanal" ref={contenedorRef} style={{ position: 'relative' }}>
        <div className="celda-vacia"></div>
        {dias.map((dia, i) => (
          <div key={`dia-${i}`} className="encabezado-dia">{dia}</div>
        ))}

        {horas.map((hora, rowIndex) => (
          <React.Fragment key={`fila-${rowIndex}`}>
            <div className="hora">{hora}</div>
            {Array.from({ length: 7 }, (_, colIndex) => {
              const eventosCelda = eventosEnCelda(colIndex, rowIndex);
              const objetivosCelda = objetivosEnCelda(colIndex, rowIndex);
              const evento = eventosCelda[0];
              const objetivo = objetivosCelda[0];

              let backgroundColor = '';
              if (objetivo) backgroundColor = objetivo.completado ? 'green' : 'red';
              else if (evento) backgroundColor = 'blue';

              let circleBackgroundColor = '';

              if (objetivo) circleBackgroundColor = objetivo.TareaId != null ? 'goldenrod' : 'white';
              else if (evento) circleBackgroundColor = evento.tareaId != null ? 'goldenrod' : 'white';

              return (
                <div
                  key={`celda-${rowIndex}-${colIndex}`}
                  className="celda-dia"
                  onClick={(e) => handleCeldaClick(e, colIndex, rowIndex)}
                  onMouseEnter={(e) => handleCeldaHover(e, colIndex, rowIndex)}
                  onMouseLeave={handleHoverLeave}
                  style={{ position: 'relative', backgroundColor, transition: 'background-color 0.3s' }}
                >
                  {evento && (
                    <div
                      title="Evento"
                      style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: circleBackgroundColor,
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                      }}
                    />
                  )}
                  {objetivo && (
                    <div
                      title="Objetivo"
                      style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: circleBackgroundColor,
                        borderRadius: '50%',
                        position: 'absolute',
                        bottom: '4px',
                        right: '4px',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}

        {mostrarOpciones && (
          <div
            style={{
              position: 'absolute',
              top: menuCoords.y,
              left: menuCoords.x,
              backgroundColor: '#fff',
              color: 'black',
              border: '1px solid #ccc',
              borderRadius: '6px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              padding: '0.5rem',
              zIndex: 999,
              minWidth: '160px',
              cursor: 'default'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              onClick={() => {
                const fecha = calcularFechaDesdeCelda(celdaInfo.dia, celdaInfo.hora);
                setFechaEventoPredefinida(fecha);
                setMostrarOpciones(false);
                setShowCrearEvento(true);
              }}
              style={{ padding: '6px 10px', cursor: 'pointer' }}
            >
              Crear evento
            </div>
            <div
              onClick={() => {
                const fecha = calcularFechaDesdeCelda(celdaInfo.dia, celdaInfo.hora);
                setFechaObjetivoPredefinida(fecha);
                setMostrarOpciones(false);
                setShowCrearObjetivo(true);
              }}
              style={{ padding: '6px 10px', cursor: 'pointer' }}
            >
              Crear objetivo
            </div>
          </div>
        )}
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
            cursor: 'default',
          }}
          onMouseEnter={handleHoverModalMouseEnter}
          onMouseLeave={handleHoverModalMouseLeave}
        >
          <MostrarInfoModal
            items={hoverModalItems}
            onEdit={(item) => setItemEdicion(item)}
            onDelete={handleDelete}
            onSuccess={fetchAll}
          />
        </div>
      )}

      {itemEdicion && (
        <ModalEdicion item={itemEdicion} onClose={() => setItemEdicion(null)} onSuccess={fetchAll} />
      )}

      {showCrearEvento && (
        <CrearEventoModal
          onClose={() => {
            setShowCrearEvento(false);
            fetchAll();
          }}
          fechaInicial={fechaEventoPredefinida}
          onSuccess={fetchAll}
        />
      )}

      {showCrearObjetivo && (
        <CrearObjetivoModal
          onClose={() => {
            setShowCrearObjetivo(false);
            fetchAll();
          }}
          fechaInicial={fechaObjetivoPredefinida}
          onSuccess={fetchAll}
        />
      )}
    </>
  );
};

export default VistaSemanal;