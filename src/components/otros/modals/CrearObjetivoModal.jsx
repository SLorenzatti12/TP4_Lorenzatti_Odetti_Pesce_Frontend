import React, { useState } from 'react';
import axios from 'axios';
import '../../../styles/modal.css';
import CrearTareaModal from './CrearTareaModal';

const CrearObjetivoModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadLine: '',
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
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Objetivo creado:', response.data);
      onClose();
    } catch (error) {
      console.error('Error al crear objetivo:', error.response?.data || error.message);
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
            style={{ textAlign: 'center' }}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Descripción"
            value={formData.description}
            style={{ textAlign: 'center' }}
            onChange={handleChange}
          />
          <input
            type="date"
            name="deadLine"
            value={formData.deadLine}
            style={{ textAlign: 'center' }}
            onChange={handleChange}
          />
          <button type="submit" className="btn-primary">
            Guardar
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowTareaModal(true)}
            style={{ marginLeft: '10px' }}
          >
            Agregar Tarea
          </button>

          <button type="button" className="btn-secondary" onClick={onClose} style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        </form>
      </div>
      
      {showTareaModal && 
        <CrearTareaModal
          onClose={() => setShowTareaModal(false)}
          onCreate={(tarea) => {
            setFormData(prev => ({ ...prev, tareaId: tarea.id }));
            setShowTareaModal(false);
          }}
        />
      }
    </>
  );
};

export default CrearObjetivoModal;