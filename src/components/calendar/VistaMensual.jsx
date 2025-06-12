import React, { useEffect, useState } from 'react';
import '../../styles/calendario_mensual.css';

import Iterante from '../otros/IteranteMensual';
import SelectorDelMes from '../otros/SelectorDelMes'

const VistaMensual = ()=> {
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
    let firstD;
    switch (firstDay.toDateString().substring(0,3)) {
        case 'Mon':
            console.log('es lunes');
            firstD = 'lu';
            break;
        case 'Tue':
            console.log('es martes');
            firstD = 'ma';
            break;
        case 'Wed':
            console.log('es miercoles');
            firstD = 'mi';
            break;
        case 'Thu':
            console.log('es jueves');
            firstD = 'ju';
            break;
        case 'Fri':
            console.log('es viernes');
            firstD = 'vi';
            break;
        case 'Sat':
            console.log('es sabado');
            firstD = 'sa';
            break;
        case 'Sun':
            console.log('es domingo');
            firstD = 'do';
            break;
        default:
            console.log(firstDay.toDateString().substring(0,3));
            break;
    }

    return (
        <div>
            <div className='barra'>
                <button>{"<-"}</button>
                <span>
                    <SelectorDelMes/>
                    <button>+</button>
                </span>
            </div>

            <h2>
                {monthNames[month]}
            </h2>

            <div className='calendario-mensual'>
                <span></span><span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sá</span><span>Do</span>
                <Iterante day={firstD} cant={daysInMonth}/>
            </div>
        </div>
    )
}

export default VistaMensual;