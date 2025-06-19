import React from 'react';

export function IteranteAnual({ day, cant, elementos = [], onDayHover, onDayLeave }) {
  const days = ['lu', 'ma', 'mi', 'ju', 'vi', 'sa', 'do'];
  let previous;

  const getPosition = () => {
    if (previous === undefined) {
      previous = days.findIndex(d => d === day);
      return day;
    }
    previous = (previous + 1) % 7;
    return days[previous];
  };

  return (
    <>
      {Array.from({ length: cant }, (_, i) => {
        const dayNumber = i + 1;
        const positionClass = getPosition();
        const itemsToday = elementos.filter(e => e.day === dayNumber);

        const tipos = [...new Set(itemsToday.map(e => e.tipo))];

        let tipoClass = '';
        if (tipos.includes('objetivo') && tipos.includes('evento')) {
          tipoClass = 'objetivo_evento';
        } else if (tipos.includes('objetivo')) {
          tipoClass = 'solo_objetivo';
        } else if (tipos.includes('evento')) {
          tipoClass = 'solo_evento';
        }

        const classes = [
          positionClass,
          itemsToday.length ? 'tiene_popup_anual' : '',
          tipoClass
        ].join(' ');

        return (
          <span
            key={i}
            className={classes}
            style={{ position: 'relative', cursor: itemsToday.length ? 'pointer' : 'default' }}
            onMouseEnter={(e) => {
              if (itemsToday.length) onDayHover?.(itemsToday, dayNumber, e);
            }}
            onMouseLeave={() => onDayLeave?.()}
          >
            {dayNumber}
          </span>
        );
      })}
    </>
  );
}

export default IteranteAnual;