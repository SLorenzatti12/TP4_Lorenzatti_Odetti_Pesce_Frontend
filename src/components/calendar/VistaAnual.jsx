import React from 'react';
import '../../styles/calendario_anual.css';
import IteranteAnual from '../otros/IteranteAnual';

export const VistaAnual = () => {
    const year = new Date().getFullYear();
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const getFirstDayOfMonth = (index) => {
        const days = ['do', 'lu', 'ma', 'mi', 'ju', 'vi', 'sa'];
        return days[new Date(year, index, 1).getDay()];
    };

    return (
        <div className="calendario_anual">
            {monthNames.map((month, index) => (
                <div key={index} className="mes">
                    <div className="nombre_mes">{month}</div>
                    <div className="dias_semana">
                        <span>L</span><span>Ma</span><span>Mi</span><span>J</span><span>V</span><span>S</span><span>D</span>
                        <IteranteAnual day={getFirstDayOfMonth(index)} cant={new Date(year, index + 1, 0).getDate()} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VistaAnual;
