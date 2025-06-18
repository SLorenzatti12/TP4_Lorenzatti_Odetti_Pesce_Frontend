import React from 'react';
import { Link } from 'react-router-dom';
import { useMes } from '../../../contexs/MesContext';

export function Iterante({ day, cant, elementos = [] }) {
  const { setSemanaSeleccionada } = useMes();
  const days = ['lu', 'ma', 'mi', 'ju', 'vi', 'sa', 'do'];

  const normalizedDay = day.toLowerCase();
  const startIndex = days.findIndex(d => d === normalizedDay);
  if (startIndex === -1) return <p style={{ color: 'red' }}>Día inválido: "{day}"</p>;

  const getPosition = (i) => days[(startIndex + i) % 7];
  const getSemana = (i) => Math.floor((startIndex + i) / 7);

  return (
    <>
      {Array.from({ length: cant }, (_, i) => {
        const semana = getSemana(i);
        const diaSemana = getPosition(i);
        const dayNumber = i + 1;

        const itemsToday = elementos.filter(e => e.day === dayNumber);
        const tooltipText = itemsToday.length
          ? itemsToday.map(e => `${e.tipo.toUpperCase()}: ${e.titulo} - ${e.descripcion}`).join('\n')
          : '';

        const classes = [
          `mes_${diaSemana}`,
          `S${semana}`,
          itemsToday.length ? 'tiene_popup' : '',
          ...new Set(itemsToday.map(e => e.tipo))
        ].join(' ');

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
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <span>{dayNumber}</span>
            </Link>
          </React.Fragment>
        );
      })}
    </>
  );
}

export default Iterante;