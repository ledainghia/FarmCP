export const defaultCols = [
  {
    id: 'Pending',
    title: 'Khởi tạo',
  },
  {
    id: 'InProgress',
    title: 'Đã xử lí',
  },
];

export type Column = (typeof defaultCols)[number];
