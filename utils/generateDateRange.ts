export const generateDateRange = () => {
  const today = new Date();
  const startDate = new Date(
    today.getFullYear(),
    today.getMonth() - 2,
    today.getDate()
  );

  const formattedStartDate = startDate.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const formattedToday = today.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return `Từ ${formattedStartDate} -> ${formattedToday}`;
};
