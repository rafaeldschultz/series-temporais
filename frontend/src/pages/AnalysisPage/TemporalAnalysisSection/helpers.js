export const getNumLagsList = () => {
  const list = [];
  for (let i = 3; i <= 30; i += 3) {
    list.push({ value: i, label: i.toString() });
  }

  // Add the cases for 45 and 90
  list.push({ value: 45, label: "45" });
  list.push({ value: 90, label: "90" });
  return list;
};

export const getAlphaList = () => {
  const list = [];
  for (let i = 1; i <= 10; i += 1) {
    const value = i / 10;
    list.push({ value: value, label: value.toLocaleString("pt-BR") });
  }

  return list;
};
