import { useMes } from '../../../contexs/MesContext';

const SelectorDelMes = () => {
  const { mesSeleccionado, setMesSeleccionado } = useMes();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const today = new Date();
  const currentMonthIndex = today.getMonth();

  const options = [];

  for (let i = 11; i > currentMonthIndex; i--) {
    options.push({ value: i, label: monthNames[i] });
  }

  options.push({ value: currentMonthIndex, label: monthNames[currentMonthIndex] });

  for (let i = currentMonthIndex - 1; i >= 0; i--) {
    options.push({ value: i, label: monthNames[i] });
  }

  const handleChange = (e) => {
    setMesSeleccionado(Number(e.target.value));
  };

  return (
    <select
      className="form-select selector-del-mes"
      value={mesSeleccionado}
      onChange={handleChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} style={{textAlign:'center'}}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectorDelMes;