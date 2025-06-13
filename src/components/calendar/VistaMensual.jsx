import React, { useState } from 'react';
import '../../styles/calendario_mensual.css';
import Iterante from '../otros/IteranteMensual';
import SelectorDelMes from '../otros/SelectorDelMes';

const VistaMensual = () => {
  const [days, setDays] = useState([]);

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDay = new Date(year, month, 1);
  const firstD = ['lu', 'ma', 'mi', 'ju', 'vi', 'sa', 'do'][firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1];

  return (
    <div className="vista-mensual-container">
        {/* BARRA CON BOOTSTRAP */}
        <div className="barra">
            <button className="btn btn-outline-primary boton-control">←</button>
            <SelectorDelMes />
            <button className="btn btn-success boton-control">+</button>
        </div>




      <h2 className="text-center text-primary">{monthNames[month]}</h2>

      <div className="calendario-mensual">
        <span></span>
        <span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sá</span><span>Do</span>
        <Iterante day={firstD} cant={daysInMonth} />
      </div>
    </div>
  );
};

export default VistaMensual;