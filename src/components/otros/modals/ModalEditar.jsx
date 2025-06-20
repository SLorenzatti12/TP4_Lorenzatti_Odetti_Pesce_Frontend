import React, { useState, useEffect } from 'react';
import CrearTareaModal from './CrearTareaModal';
import ModalEditarTarea from './ModalEditarTarea';

const ModalEdicion = ({ item, onClose, onSuccess }) => {
  const isEvento = item.tipo === 'evento';

  const [form, setForm] = useState({
    title: '',
    description: '',
    beginDate: '',
    duration: '',
    place: '',
    deadLine: '',
    tareaId: null,
  });

  const [showTareaModal, setShowTareaModal] = useState(false);
  const [tareaActual, setTareaActual] = useState(null);
  const [isEditingTarea, setIsEditingTarea] = useState(false);

  useEffect(() => {
    if (!item) return;

    setForm({
      title: item.titulo || '',
      description: item.descripcion || '',
      beginDate: item.fecha || '',
      duration: item.duracion_minutos || '',
      place: item.lugar || '',
      deadLine: item.fecha_limite || '',
      tareaId: item.tareaId || null,
      id: item.id || null,
    });
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const endpoint = isEvento
      ? `http://localhost:3000/api/events/${form.id}`
      : `http://localhost:3000/api/goals/${form.id}`;

    const payload = isEvento
      ? {
          title: form.title,
          description: form.description,
          beginDate: form.beginDate,
          duration: Number(form.duration),
          place: form.place,
          tareaId: form.tareaId || null,
        }
      : {
          title: form.title,
          description: form.description,
          deadLine: form.deadLine,
          tareaId: form.tareaId || null,
        };

    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        alert('Error al actualizar: ' + (error.error || (error.errores && error.errores.join(', '))));
        return;
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      alert('Error de red al actualizar');
      console.error(err);
    }
  };

  // Abrir modal editar tarea
  const abrirEditarTarea = () => {
    if (!form.tareaId) return;
    setTareaActual({ id: form.tareaId });
    setIsEditingTarea(true);
    setShowTareaModal(true);
  };

  // Abrir modal crear tarea
  const abrirCrearTarea = () => {
    setTareaActual(null);
    setIsEditingTarea(false);
    setShowTareaModal(true);
  };

  // Al crear o editar tarea actualizamos el tareaId en el form
  const onTareaGuardada = (tarea) => {
    setForm(prev => ({ ...prev, tareaId: tarea.id }));
    setShowTareaModal(false);
    onSuccess?.();
  };

  // Eliminar tarea asociada
  const eliminarTarea = async () => {
    if (!form.tareaId) return;

    if (!window.confirm('¿Seguro que quieres eliminar la tarea asociada?')) return;

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`http://localhost:3000/api/tasks/${form.tareaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        alert('Error al eliminar la tarea: ' + (error.error || JSON.stringify(error)));
        return;
      }

      // Quitamos tareaId del form porque la borramos
      setForm(prev => ({ ...prev, tareaId: null }));
      onSuccess?.();
      alert('Tarea eliminada correctamente');
    } catch (err) {
      alert('Error de red al eliminar la tarea');
      console.error(err);
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-form">
          <h3>Editar {item.tipo}</h3>

          <label>Título</label>
          <input name="title" value={form.title} onChange={handleChange} />

          <label>Descripción</label>
          <textarea name="description" value={form.description} onChange={handleChange} />

          {isEvento ? (
            <>
              <label>Fecha y hora</label>
              <input type="datetime-local" name="beginDate" value={form.beginDate} onChange={handleChange} />

              <label>Duración (minutos)</label>
              <input type="number" name="duration" value={form.duration} onChange={handleChange} />

              <label>Lugar</label>
              <input name="place" value={form.place} onChange={handleChange} />
            </>
          ) : (
            <>
              <label>Fecha límite</label>
              <input type="date" name="deadLine" value={form.deadLine} onChange={handleChange} />
            </>
          )}

          <div style={{ marginTop: 12 }}>
            {form.tareaId ? (
              <>
                <button onClick={abrirEditarTarea} type="button" style={{ marginRight: 8 }}>
                  Editar tarea asociada
                </button>
                <button onClick={eliminarTarea} type="button" style={{ marginRight: 8, backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}>
                  Eliminar tarea asociada
                </button>
              </>
            ) : (
              <button onClick={abrirCrearTarea} type="button" style={{ marginRight: 8 }}>
                Crear tarea asociada
              </button>
            )}
          </div>

            <button className="btn btn-success" onClick={handleSubmit} type="button">
              Guardar
            </button>
            <button className="btn btn-secondary" onClick={onClose} type="button" style={{marginTop: '5px'}}>
              Cancelar
            </button>
        </div>
      </div>

      {showTareaModal && (
        isEditingTarea ? (
          <ModalEditarTarea
            tarea={tareaActual}
            onClose={() => setShowTareaModal(false)}
            onUpdated={onTareaGuardada}
          />
        ) : (
          <CrearTareaModal
            onClose={() => setShowTareaModal(false)}
            onCreated={onTareaGuardada}
          />
        )
      )}
    </>
  );
};

export default ModalEdicion;