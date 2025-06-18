import React, { useState } from 'react';
import axios from 'axios';
import '../../../styles/modal.css';

const CrearTareaModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha_limite: '',
  });

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
      const token = localStorage.getItem('token'); // o donde tengas tu token guardado

      const response = await axios.post(
        'http://localhost:3000/api/tasks',
        {
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          fecha_limite: formData.fecha_limite,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Tarea creada:', response.data);
      onClose(); // cerrar modal al terminar
    } catch (error) {
      console.error('Error al crear tarea:', error.response?.data || error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="modal-form">
        <h2 style={{ textAlign: 'center' }}>Registrar Tarea</h2>
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={formData.titulo}
          style={{ textAlign: 'center' }}
          onChange={handleChange}
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          style={{ textAlign: 'center' }}
          onChange={handleChange}
        />
        <input
          type="date"
          name="fecha_limite"
          value={formData.fecha_limite}
          style={{ textAlign: 'center' }}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-primary">Guardar</button>
        <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default CrearTareaModal;