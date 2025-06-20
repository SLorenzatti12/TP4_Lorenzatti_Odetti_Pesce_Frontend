import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../styles/modal.css';
import CrearTareaModal from './CrearTareaModal';

const CrearEventoModal = ({ onClose, fechaInicial }) => {
  const now = new Date();
  const localDatetime = now.toISOString().slice(0,16);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    beginDate: localDatetime,
    duration: '',
    place: '',
    tareaId: '',
  });

  const [tareas, setTareas] = useState([]);
  const [showTareaModal, setShowTareaModal] = useState(false);

  useEffect(() => {
    if (fechaInicial) {
      const localFecha = new Date(fechaInicial.getTime() - fechaInicial.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setFormData(prev => ({ ...prev, beginDate: localFecha }));
    }
  }, [fechaInicial]);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTareas(res.data);
      } catch (err) {
        console.error('Error al obtener tareas:', err.response?.data || err.message);
      }
    };
    fetchTareas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const durationNumber = Number(formData.duration);
    if (isNaN(durationNumber) || durationNumber <= 0) {
      alert('La duración debe ser un número mayor que cero');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/events',
        {
          title: formData.title,
          description: formData.description,
          beginDate: formData.beginDate,
          duration: durationNumber,
          place: formData.place,
          tareaId: formData.tareaId || null
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
    <>
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
            type="datetime-local"
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

          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowTareaModal(true)}
          >
            Agregar Tarea
          </button>

          <button type="submit" className="btn-primary">Guardar</button>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
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

export default CrearEventoModal;