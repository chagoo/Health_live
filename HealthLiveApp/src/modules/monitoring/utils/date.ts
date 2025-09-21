export const formatShortDate = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
  })
    .format(date)
    .replace('.', '');
};
