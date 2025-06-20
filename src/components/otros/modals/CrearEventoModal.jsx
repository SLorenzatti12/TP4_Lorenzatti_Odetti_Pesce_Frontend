import React, { useState } from 'react';
import '../../../styles/modal.css';
import CrearTareaModal from './CrearTareaModal';

const CrearEventoModal = ({ onClose, fechaInicial }) => {
  const defaultDate = fechaInicial ? new Date(fechaInicial) : new Date();
  const localDatetime = defaultDate.toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    beginDate: localDatetime,
    duration: 1,
    place: '',
    tareaId: null,
  });

  const [showCrearTarea, setShowCrearTarea] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');

    const payload = {
      title: formData.titulo,
      description: formData.descripcion,
      beginDate: formData.beginDate,
      duration: Number(formData.duration),
      place: formData.place,
    };

    if (formData.tareaId) {
      payload.tareaId = formData.tareaId;
    }

    console.log("Payload enviado:", payload);

    try {
      const res = await fetch('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.errores?.join(' - ') || 'Error al crear evento');
      }

      alert('Evento creado');
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-form">
        <h3>Crear Evento</h3>

        <label>Título:</label>
        <input name="titulo" value={formData.titulo} onChange={handleChange} />

        <label>Descripción:</label>
        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} />

        <label>Fecha y hora:</label>
        <input type="datetime-local" name="beginDate" value={formData.beginDate} onChange={handleChange} />

        <label>Duración (minutos):</label>
        <input type="number" name="duration" value={formData.duration} onChange={handleChange} min={1} />

        <label>Lugar:</label>
        <input name="place" value={formData.place} onChange={handleChange} />

        <div style={{ marginTop: '10px' }}>
          {formData.tareaId ? (
            <p style={{ color: '#0f0' }}>Tarea asociada: ID {formData.tareaId}</p>
          ) : (
            <button type="button" onClick={() => setShowCrearTarea(true)}>
              Asociar Tarea
            </button>
          )}
        </div>

        <div className="modal-botones">
          <button onClick={handleSubmit}>Guardar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>

      {showCrearTarea && (
        <CrearTareaModal
          onClose={() => setShowCrearTarea(false)}
          onCreated={(tarea) => {
            setFormData((prev) => ({
              ...prev,
              tareaId: tarea.id,
              deadLine: tarea.deadLine || prev.deadLine,
            }));
            setShowCrearTarea(false);
          }}
          initialDate={formData.beginDate}
        />
      )}
    </div>
  );
};

export default CrearEventoModal;