import React from 'react';

export function Iterante({ day, cant }) {
    const days = ['lu', 'ma', 'mi', 'ju', 'vi', 'sa', 'do'];
    let previous;
    let fila = 2;

    const getPosition = () => {
        if (previous === undefined) {
            previous = days.findIndex((d) => d === day);
            return day;
        } else {
            if (previous === 6) {
                previous = 0;
            } else {
                previous++;
            }
            return days[previous];
        }
    };

    const renderInicioSemana = () => {
        if (fila === 2 || previous === 6) {
            fila++;
            return true;
        }
        return false;
    };

    return (
        <>
            {Array.from({ length: cant }, (_, i) => (
                <React.Fragment key={`grupo-${i}`}>
                    {renderInicioSemana() && (
                        <span className={`S${fila - 2}`}>S{fila - 2}</span>
                    )}
                    <span className={`${getPosition()} S${fila - 2}`}>
                        {i + 1}
                    </span>
                </React.Fragment>
            ))}
        </>
    );
}

export default Iterante;
