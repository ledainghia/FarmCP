export const defaultCols = [
  {
    id: 'Pending',
    title: 'Khởi tạo',
  },
  {
    id: 'Normal',
    title: 'Vật nuôi bình thường',
  },
  {
    id: 'Diagnosed',
    title: 'Đã chuẩn đoán',
  },
  {
    id: 'Prescribed',
    title: 'Đã kê đơn',
  },
];

export type Column = (typeof defaultCols)[number];
