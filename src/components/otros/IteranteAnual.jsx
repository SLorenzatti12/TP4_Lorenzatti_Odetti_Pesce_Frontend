export function IteranteAnual({day, cant}) {
    const days = ['lu', 'ma', 'mi', 'ju', 'vi', 'sa', 'do'];
    let previous;
    let fila = 2;

    const getPosition = () => {
        if (previous === undefined) {
            previous = days.findIndex((d)=> d === day);
            return day;

        }
        else
        {
            if (previous === 6) {
                previous = 0;
            }
            else
            {
                previous ++; 
            }
            return days[previous];

        }
    }

    /*const renderInicioSemana = () => {
        if (fila===2 || previous === 6) {
            fila ++;
            return true;
        }
    }*/

    return (
        <>
            {
                Array.from({length: cant}, (_, i)=> (
                        <>
                            { /*renderInicioSemana() && <span key={40+i} className={` S${fila-2}`}>S{fila-2}</span> */}
                            <span key={i} className={getPosition()/* + ` S${fila-2} tiene_popup`*/}>{i+1}</span>
                        </>
                    )
                )
            }
        </>
    )
}

export default IteranteAnual;