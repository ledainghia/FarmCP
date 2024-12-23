export const cleanObject = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value != null || !!value) // Loại bỏ null và undefined
  );
};
