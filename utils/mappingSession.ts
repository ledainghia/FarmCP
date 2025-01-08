export const mapSessions = (sessionData: {
  [key: string]: boolean;
}): string[] => {
  const sessionMapping: { [key: string]: string } = {
    morning: 'Buổi sáng',
    noon: 'Buổi trưa',
    afternoon: 'Buổi chiều',
    evening: 'Buổi tối',
  };

  return Object.keys(sessionData)
    .filter((key) => sessionData[key]) // Chỉ giữ lại các buổi có giá trị `true`
    .map((key) => sessionMapping[key]); // Ánh xạ từ khóa sang nhãn
};
