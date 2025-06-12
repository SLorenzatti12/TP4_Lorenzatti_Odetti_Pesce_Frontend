import React from 'react';
import '../../styles/vista_semanal.css';

const dias = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D'];
const horas = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

const VistaSemanal = () => {
  return (
    <div className="vista_semanal">
      <div className="celda-vacia"></div>
      {dias.map((dia, i) => (
        <div key={`dia-${i}`} className="encabezado-dia">{dia}</div>
      
      ))}
      {horas.map((hora, rowIndex) => (
        <React.Fragment key={`fila-${rowIndex}`}>
          <div className="hora">{hora}</div>
          {Array.from({ length: 7 }, (_, colIndex) => (
            <div key={`celda-${rowIndex}-${colIndex}`} className="celda-dia"></div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default VistaSemanal;
