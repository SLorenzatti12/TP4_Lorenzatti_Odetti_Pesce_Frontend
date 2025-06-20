import React from 'react';
import { usePlanificacion } from '../../../../contexs/PlanificacionContext';

const MostrarInfoModal = ({ items, tareas: tareasProp, ...props }) => {
  const { tareas: tareasCtx } = usePlanificacion();
  const tareas = tareasProp || tareasCtx;

  const handleCheck = async (id, check) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/goals/${id}/check?check=${check}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || 'Error al actualizar el objetivo');
      }

      alert(`Objetivo marcado como ${check ? 'completado' : 'pendiente'}`);
      props.onSuccess?.();
    } catch (error) {
      alert('Error al actualizar: ' + error.message);
    }
  };

  return (
    <div>
      {items.map((item, index) => {
        const tareaId = item.tareaId || item.TareaId || item.tareaID;
        const tarea = tareas?.find(t => Number(t.id) === Number(tareaId));

        return (
          <div
            key={index}
            style={{
              backgroundColor: item.tipo === 'evento' ? '#445' : '#265',
              padding: '8px',
              borderRadius: '6px',
              marginBottom: '6px',
              opacity: item.tipo === 'objetivo' && item.completado ? 0.6 : 1,
            }}
          >
            <div style={{ fontWeight: 'bold' }}>
              {item.tipo === 'evento' ? '📅 Evento' : '🎯 Objetivo'}
              {item.tipo === 'objetivo' && item.completado && (
                <span style={{ marginLeft: '8px', color: '#0f0' }}>(Completado)</span>
              )}
            </div>
            <div>{item.titulo}</div>
            <div style={{ fontSize: '0.85em', color: '#ccc' }}>{item.descripcion}</div>

            {/* ✅ Mostrar tarea asociada si existe */}
            {tarea && (
              <div
                style={{
                  marginTop: '6px',
                  padding: '6px',
                  backgroundColor: '#111',
                  borderRadius: '4px',
                }}
              >
                <div style={{ color: '#ffd700', fontWeight: 'bold' }}>🛠 Tarea asociada</div>
                <div style={{ fontSize: '0.9em', color: '#eee' }}>{tarea.titulo}</div>
                <div style={{ fontSize: '0.8em', color: '#aaa' }}>{tarea.descripcion}</div>
              </div>
            )}

            <div style={{ marginTop: '6px' }}>
              <button onClick={() => props.onEdit(item)} style={{ marginRight: '5px' }}>Editar</button>
              <button onClick={() => props.onDelete(item)} style={{ marginRight: '5px' }}>Eliminar</button>
              {item.tipo === 'objetivo' && !item.completado && (
                <button onClick={() => handleCheck(item.id, true)} style={{ backgroundColor: 'green', color: 'white' }}>
                  ✅ Completar
                </button>
              )}
              {item.tipo === 'objetivo' && item.completado && (
                <button onClick={() => handleCheck(item.id, false)} style={{ backgroundColor: 'gray', color: 'white' }}>
                  ❌ Desmarcar
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MostrarInfoModal;