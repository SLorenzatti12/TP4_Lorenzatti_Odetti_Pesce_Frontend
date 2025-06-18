import React from 'react';
import '../../styles/vista_semanal.css';
import { useMes } from '../../../contexs/MesContext';
import { useNavigate } from 'react-router-dom';

const dias = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D'];
const horas = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const VistaSemanal = () => {
  const { semanaSeleccionada, cantSemanas, setSemanaSeleccionada, mesSeleccionado } = useMes();

  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="barra">
        <button className="btn btn-outline-primary boton-control" onClick={() => handleClick()}>←</button>
        <select value={semanaSeleccionada} className='selector-del-mes' onChange={(e) => setSemanaSeleccionada(Number(e.target.value))}>
          {Array.from({ length: cantSemanas }, (_, i) => (
            <option key={i} value={i}>Semana {i + 1}</option>
          ))}
        </select>
        <button className="btn btn-success boton-control">+</button>
      </div>

      <h1 className="text-center text-primary">
        Semana {(semanaSeleccionada+1) ?? '-'} de {monthNames[mesSeleccionado]}
      </h1>
      
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
    </>
  );
};

export default VistaSemanal;