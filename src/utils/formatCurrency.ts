export const formattedCurrency = (value: number) => {
  return new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' }).format(value);
};

export default formattedCurrency;
