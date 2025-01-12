export const defaultCols = [
  {
    id: 'Pending',
    title: 'Khởi tạo',
  },
  {
    id: 'Rejected',
    title: 'Vật nuôi bình thường',
  },
  {
    id: 'Prescribed',
    title: 'Đã chuẩn đoán và kê đơn',
  },
];

export type Column = (typeof defaultCols)[number];
