const SelectorDelMes = () => {
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
  options.push({ value: currentMonthIndex, label: monthNames[currentMonthIndex], selected: true });
  for (let i = currentMonthIndex - 1; i >= 0; i--) {
    options.push({ value: i, label: monthNames[i] });
  }

  return (
    <select
      className="form-select selector-del-mes"
      defaultValue={currentMonthIndex}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectorDelMes;