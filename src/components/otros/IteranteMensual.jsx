import React from 'react';
import { Link } from 'react-router-dom';
import { useMes } from '../../../contexs/MesContext';

export function Iterante({ day, cant, elementos = [], onDayHover, onDayLeave }) {
  const { setSemanaSeleccionada } = useMes();
  const days = ['lu', 'ma', 'mi', 'ju', 'vi', 'sa', 'do'];

  const normalizedDay = day.toLowerCase();
  const startIndex = days.findIndex(d => d === normalizedDay);
  if (startIndex === -1) return <p style={{ color: 'red' }}>Día inválido: "{day}"</p>;

  const getPosition = (i) => days[(startIndex + i) % 7];
  const getSemana = (i) => Math.floor((startIndex + i) / 7);

  const tieneTarea = (items) => items.some(e => e.tareaId != null || e.TareaId != null);

  return (
    <>
      {Array.from({ length: cant }, (_, i) => {
        const semana = getSemana(i);
        const diaSemana = getPosition(i);
        const dayNumber = i + 1;

        const itemsToday = elementos.filter(e => e.day === dayNumber);
        const hayTarea = tieneTarea(itemsToday);

        const tooltipText = itemsToday.length
          ? itemsToday.map(e => `${e.tipo.toUpperCase()}: ${e.titulo} - ${e.descripcion}`).join('\n')
          : '';

        const clasesBase = [
          `mes_${diaSemana}`,
          `S${semana}`,
          itemsToday.length ? 'tiene_popup' : '',
        ];

        itemsToday.forEach(e => {
          if (e.tipo === 'evento') {
            clasesBase.push('evento');
          } else if (e.tipo === 'objetivo') {
            clasesBase.push(e.completado ? 'objetivo-completado' : 'objetivo-pendiente');
          }
        });

        const classes = clasesBase.join(' ');

        const handleMouseEnter = (e) => {
          if (onDayHover && itemsToday.length > 0) {
            onDayHover(itemsToday, dayNumber, e);
          }
        };

        const handleMouseLeave = () => {
          if (onDayLeave) onDayLeave();
        };

        return (
          <React.Fragment key={`dia-${i}`}>
            {i === 0 || diaSemana === 'lu' ? (
              <Link
                to="/dashboard/semanal"
                onClick={() => setSemanaSeleccionada(semana)}
                className={`S${semana}`}
              >
                <span>S{semana + 1}</span>
              </Link>
            ) : null}

            <Link
              to="/dashboard/semanal"
              onClick={() => setSemanaSeleccionada(semana)}
              title={tooltipText}
              className={classes}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <span
                style={{
                  width: '100%',
                  height: '100%',
                  background: hayTarea
                    ? 'linear-gradient(to top right, rgba(218, 165, 32, 0.3), rgba(253, 245, 166, 0.3))'
                    : undefined,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {dayNumber}
              </span>
            </Link>
          </React.Fragment>
        );
      })}
    </>
  );
}

export default Iterante;
