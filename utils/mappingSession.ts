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
    .filter((key) => sessionData[key])
    .map((key) => sessionMapping[key]);
};
