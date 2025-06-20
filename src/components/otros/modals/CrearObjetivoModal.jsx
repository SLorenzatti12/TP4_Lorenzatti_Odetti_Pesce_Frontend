import React, { useState } from 'react';
import axios from 'axios';
import '../../../styles/modal.css';
import CrearTareaModal from './CrearTareaModal';

const CrearObjetivoModal = ({ onClose, onCreated, initialDate = '' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadLine: initialDate,
    tareaId: null,
  });

  const [showTareaModal, setShowTareaModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:3000/api/goals',
        {
          title: formData.title,
          description: formData.description,
          deadLine: formData.deadLine,
          tareaId: formData.tareaId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Objetivo creado:', response.data);
      onClose();
      onCreated?.();
    } catch (error) {
      console.error('Error al crear objetivo:', error.response?.data || error.message);
      alert('Error: ' + JSON.stringify(error.response?.data));
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <form onSubmit={handleSubmit} className="modal-form">
          <h2 style={{ textAlign: 'center' }}>Registrar Objetivo</h2>

          <input
            type="text"
            name="title"
            placeholder="Título"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Descripción"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="deadLine"
            value={formData.deadLine}
            onChange={handleChange}
            required
          />

          {/* ✅ Mostrar tarea asociada o botón para agregar */}
          <div style={{ marginTop: '10px' }}>
            {formData.tareaId ? (
              <p style={{ color: '#0f0' }}>Tarea asociada: ID {formData.tareaId}</p>
            ) : (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowTareaModal(true)}
              >
                + Asociar Tarea
              </button>
            )}
          </div>

          <div className="modal-botones" style={{ marginTop: '10px' }}>
            <button type="submit" className="btn-primary">Guardar</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>

      {showTareaModal && (
        <CrearTareaModal
          onClose={() => setShowTareaModal(false)}
          onCreated={(tarea) => {
            setFormData(prev => ({
              ...prev,
              tareaId: tarea.id,
              deadLine: tarea.deadLine || prev.deadLine
            }));
            setShowTareaModal(false);
          }}
          initialDate={formData.deadLine}
        />
      )}
    </>
  );
};

export default CrearObjetivoModal;