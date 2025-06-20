import React from 'react';

const MostrarInfoModal = ({
  visible,
  items = [],
  day,
  position = { x: 0, y: 0 },
  onMouseEnter,
  onMouseLeave,
  onEdit,
  onDelete,
}) => {
  if (!visible) return null;

  const objetivos = items.filter(item => item.tipo === 'obketivo');
  const eventos = items.filter(item => item.tipo === 'evento');

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ pointerEvents: 'auto' }}>
      <h3>Día {day}</h3>

      {objetivos.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ borderBottom: '1px solid #00bcd4', paddingBottom: '4px' }}>
          Objetivos
        </h4>
        {objetivos.map((o, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <strong>{o.titulo}</strong><br />
            <small>{o.descripcion}</small><br />
            <button onClick={() => onEdit(o)} style={{ marginRight: '8px' }}>Editar</button>
            <button onClick={() => onDelete(o)}>Eliminar</button>
          </div>
        ))}
      </div>
    )}

    {eventos.length > 0 && (
            <div>
              <h4 style={{ borderBottom: '1px solid #ff6b6b', paddingBottom: '4px' }}>
                Eventos
              </h4>
              {eventos.map((e, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <strong>{e.titulo}</strong><br />
                  <small>{e.descripcion}</small><br />
                  <button onClick={() => onEdit(e)} style={{ marginRight: '8px' }}>Editar</button>
                  <button onClick={() => onDelete(e)}>Eliminar</button>
                </div>
              ))}
            </div>
          )}

          {objetivos.length === 0 && eventos.length === 0 && (
            <p>No hay objetivos ni eventos para este día.</p>
          )}
        </div>
      );
    };

export default MostrarInfoModal;