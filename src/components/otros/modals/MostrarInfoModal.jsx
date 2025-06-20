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

  return (
    <div
        
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
      {items.map((item, idx) => (
        <div
          key={idx}
          style={{ marginBottom: 12, borderBottom: '1px solid black', paddingBottom: 8 }}
        >
          <div><strong>Tipo:</strong> {item.tipo}</div>
          <div><strong>Título:</strong> {item.titulo}</div>
          <div><strong>Descripción:</strong> {item.descripcion}</div>
          <div style={{ marginTop: 6 }}>
            <button
              onClick={() => onEdit(item)}
              style={{
                marginRight: 8,
                backgroundColor: '#0d6efd',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                padding: '4px 8px',
                cursor: 'pointer',
              }}
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(item)}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                padding: '4px 8px',
                cursor: 'pointer',
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MostrarInfoModal;