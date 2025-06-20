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

        const tieneTarea = itemsToday.some(e => e.tareaId != null || e.TareaID != null);

        const objetivosPendientes = itemsToday.filter(e => e.tipo === 'objetivo' && !e.completado);
        const objetivosCompletados = itemsToday.filter(e => e.tipo === 'objetivo' && e.completado);
        const eventos = itemsToday.filter(e => e.tipo === 'evento');

        const tienePendientes = objetivosPendientes.length > 0;
        const tieneCompletados = objetivosCompletados.length > 0;
        const tieneEventos = eventos.length > 0;

        let tipoClass = '';

        if (tienePendientes && tieneCompletados && tieneEventos) {
          tipoClass = 'objetivo_pendiente_completado_evento';
        } else if (tienePendientes && tieneCompletados) {
          tipoClass = 'objetivo_pendiente_completado';
        } else if (tienePendientes && tieneEventos) {
          tipoClass = 'objetivo_pendiente_evento';
        } else if (tieneCompletados && tieneEventos) {
          tipoClass = 'objetivo_completado_evento';
        } else if (tienePendientes) {
          tipoClass = 'objetivo_pendiente';
        } else if (tieneCompletados) {
          tipoClass = 'objetivo_completado';
        } else if (tieneEventos) {
          tipoClass = 'solo_evento';
        }

        const textoClase = tieneTarea ? 'tiene_tarea' : '';

        const classes = [
          positionClass,
          itemsToday.length ? 'tiene_popup_anual' : '',
          tipoClass,
          textoClase
        ].join(' ').trim();

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