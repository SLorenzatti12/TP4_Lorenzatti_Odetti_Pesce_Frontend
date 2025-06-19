import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../styles/modal.css';

const ModalEditarTarea = ({ tarea, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadLine: '',
    priority: 1
  });

  useEffect(() => {
    if (tarea) {
      setFormData({
        title: tarea.titulo || '',
        description: tarea.descripcion || '',
        deadLine: tarea.fechaLimite ? tarea.fechaLimite.split('T')[0] : '',
        priority: tarea.prioridad || 1,
      });
    }
  }, [tarea]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'priority' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const response = await axios.put(
        `http://localhost:3000/api/tasks/${tarea.id}`,
        {
          title: formData.title,
          description: formData.description,
          deadLine: formData.deadLine,
          priority: formData.priority
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Tarea actualizada:', response.data);
      if (onUpdated) onUpdated(response.data);
      onClose();
    } catch (error) {
      console.error('Error al actualizar tarea:', error.response?.data || error.message);
      alert('Error: ' + JSON.stringify(error.response?.data));
    }
  };

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="modal-form">
        <h2 style={{ textAlign: 'center' }}>Editar Tarea</h2>

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

        <label htmlFor="priority">Prioridad:</label>
        <select
          name="priority"
          id="priority"
          value={formData.priority}
          onChange={handleChange}
          required
        >
          <option value={1}>1 (Baja)</option>
          <option value={2}>2 (Media)</option>
          <option value={3}>3 (Alta)</option>
        </select>

        <button type="submit" className="btn-primary">Guardar</button>
        <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default ModalEditarTarea;