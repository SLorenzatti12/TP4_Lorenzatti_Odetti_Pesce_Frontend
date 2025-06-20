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
    <div
        id='modal-info'
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
            position: 'fixed',
            top: position.y + 5,
            left: position.x + 5,
            backgroundColor: 'white',
            color: 'black',
            padding: 20,
            borderRadius: 8,
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            maxWidth: 350,
            maxHeight: '70vh',
            overflowY: 'auto',
            zIndex: 10000,
            pointerEvents: 'auto',
            fontSize: 14,
        }
    }
    >
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