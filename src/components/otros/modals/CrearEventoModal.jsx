import React, { useState } from 'react';
import axios from 'axios';
import '../../../styles/modal.css';

const CrearEventoModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    beginDate: '',
    duration: '',
    place: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      // Conversión duration a número para backend
      const durationNumber = Number(formData.duration);
      if (isNaN(durationNumber) || durationNumber <= 0) {
        alert('La duración debe ser un número mayor que cero');
        return;
      }

      const response = await axios.post(
        'http://localhost:3000/api/events',
        {
          title: formData.title,
          description: formData.description,
          beginDate: formData.beginDate,
          duration: durationNumber,
          place: formData.place,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Evento creado:', response.data);
      onClose();
    } catch (error) {
      console.error('Error al crear evento:', error.response?.data || error.message);
      alert('Error al crear evento: ' + JSON.stringify(error.response?.data));
    }
  };

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="modal-form">
        <h2 style={{ textAlign: 'center' }}>Registrar Evento</h2>
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={formData.title}
          onChange={handleChange}
          style={{ textAlign: 'center' }}
          required
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
          style={{ textAlign: 'center' }}
          required
        />
        <input
          type="date"
          name="beginDate"
          value={formData.beginDate}
          onChange={handleChange}
          style={{ textAlign: 'center' }}
          required
        />
        <input
          type="number"
          name="duration"
          placeholder="Duración (minutos)"
          value={formData.duration}
          onChange={handleChange}
          style={{ textAlign: 'center' }}
          min={1}
          required
        />
        <input
          type="text"
          name="place"
          placeholder="Lugar"
          value={formData.place}
          onChange={handleChange}
          style={{ textAlign: 'center' }}
        />
        <button type="submit" className="btn-primary">Guardar</button>
        <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default CrearEventoModal;