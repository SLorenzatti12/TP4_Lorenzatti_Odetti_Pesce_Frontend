import React, { useState, useRef, useEffect } from 'react';
import '../../styles/vista_semanal.css';
import { useMes } from '../../../contexs/MesContext';
import { useNavigate } from 'react-router-dom';
import { usePlanificacion } from '../../../contexs/PlanificacionContext';

import CrearObjetivoModal from '../otros/modals/CrearObjetivoModal';
import CrearEventoModal from '../otros/modals/CrearEventoModal';

const dias = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D'];
const horas = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const VistaSemanal = () => {
  const { semanaSeleccionada, cantSemanas, setSemanaSeleccionada, mesSeleccionado } = useMes();
  const { eventos, objetivos } = usePlanificacion();
  const navigate = useNavigate();

  const contenedorRef = useRef(null);
  const timeoutRef = useRef(null);

  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [menuCoords, setMenuCoords] = useState({ x: 0, y: 0 });
  const [celdaInfo, setCeldaInfo] = useState({ dia: null, hora: null });

  const [showCrearEvento, setShowCrearEvento] = useState(false);
  const [showCrearObjetivo, setShowCrearObjetivo] = useState(false);
  const [fechaEventoPredefinida, setFechaEventoPredefinida] = useState(null);

  const handleCeldaClick = (e, dia, hora) => {
    const rect = e.target.getBoundingClientRect();
    const contenedorRect = contenedorRef.current.getBoundingClientRect();
    const offset = 8;
    const menuWidth = 160;

    const isNearRightEdge = rect.right + menuWidth + offset > window.innerWidth;
    const x = isNearRightEdge
      ? rect.left - contenedorRect.left - menuWidth - offset
      : rect.right - contenedorRect.left + offset;
    const y = rect.top - contenedorRect.top + offset;

    setMenuCoords({ x, y });
    setCeldaInfo({ dia, hora });
    setMostrarOpciones(true);
  };

  useEffect(() => {
    if (mostrarOpciones) {
      timeoutRef.current = setTimeout(() => setMostrarOpciones(false), 3000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [mostrarOpciones]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setMostrarOpciones(false);
      }
    };

    if (mostrarOpciones) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [mostrarOpciones]);

  const calcularFechaDesdeCelda = (dia, hora) => {
    const hoy = new Date();
    const primerDiaDelMes = new Date(hoy.getFullYear(), mesSeleccionado, 1);
    const primerLunes = new Date(primerDiaDelMes);
    const diaDeSemana = (primerDiaDelMes.getDay() + 6) % 7;
    primerLunes.setDate(primerDiaDelMes.getDate() - diaDeSemana);

    const diasDesdeInicio = semanaSeleccionada * 7 + dia;
    const fecha = new Date(primerLunes);
    fecha.setDate(primerLunes.getDate() + diasDesdeInicio);
    fecha.setHours(hora, 0, 0, 0);

    return fecha;
  };

  const eventosEnCelda = (dia, hora) =>
    eventos.filter(ev => {
      const fecha = new Date(ev.fecha);
      const localFecha = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
      const d = (localFecha.getDay() + 6) % 7;
      const h = localFecha.getHours();
      return d === dia && h === hora;
    });

  const objetivosEnCelda = (dia, hora) =>
    objetivos.filter(obj => {
      const fecha = new Date(obj.fecha_limite);
      fecha.setHours(23, 0, 0, 0);
      const localFecha = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
      const d = (localFecha.getDay() + 6) % 7;
      return d === dia && hora === 23;
    });

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

              return (
                <div
                  key={`celda-${rowIndex}-${colIndex}`}
                  className="celda-dia"
                  onClick={(e) => handleCeldaClick(e, colIndex, rowIndex)}
                  style={{ position: 'relative' }}
                >
                  {eventosCelda.map((ev, idx) => (
                    <div
                      key={`ev-${idx}`}
                      title={ev.titulo}
                      style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: 'green',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: `${4 + idx * 12}px`,
                        right: '4px'
                      }}
                    />
                  ))}

                  {objetivosCelda.map((obj, idx) => (
                    <div
                      key={`obj-${idx}`}
                      title={obj.titulo}
                      style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: 'red',
                        borderRadius: '50%',
                        position: 'absolute',
                        bottom: `${4 + idx * 12}px`,
                        right: '4px'
                      }}
                    />
                  ))}
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

      {showCrearEvento && (
        <CrearEventoModal
          onClose={() => setShowCrearEvento(false)}
          fechaInicial={fechaEventoPredefinida}
        />
      )}
      {showCrearObjetivo && <CrearObjetivoModal onClose={() => setShowCrearObjetivo(false)} />}
    </>
  );
};

export default VistaSemanal;