/**
 * Retorna a data de exatamente uma semana atrás em GMT 0.
 */
export const getDateTimeOneWeekAgo = (): Date => {
  const now = new Date();
  // Subtrair 7 dias em milissegundos é seguro para UTC
  return new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
};

/**
 * Retorna a data de um mês atrás usando cálculos baseados em UTC.
 */
export const getDateTimeOneMonthAgo = (): Date => {
  const now = new Date();
  const date = new Date(now.getTime());
  
  // O uso de setUTCMonth garante que o cálculo ignore o fuso local
  date.setUTCMonth(now.getUTCMonth() - 1);
  
  return date;
};