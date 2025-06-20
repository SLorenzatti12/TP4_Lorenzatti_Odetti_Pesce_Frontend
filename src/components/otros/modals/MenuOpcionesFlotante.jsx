// components/otros/modals/MenuOpcionesFlotante.jsx
import React, { useEffect, useRef } from 'react';

const MenuOpcionesFlotante = ({ x, y, onClose, onCrearEvento, onCrearObjetivo }) => {
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '6px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        padding: '10px',
        zIndex: 999,
      }}
    >
      <div
        style={{ padding: '8px', cursor: 'pointer' }}
        onClick={onCrearEvento}
      >
        Crear evento
      </div>
      <div
        style={{ padding: '8px', cursor: 'pointer' }}
        onClick={onCrearObjetivo}
      >
        Crear objetivo
      </div>
    </div>
  );
};

export default MenuOpcionesFlotante;