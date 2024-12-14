import { jwtDecode } from 'jwt-decode';

export const isAccessTokenValid = (): boolean => {
  // if (typeof window === 'undefined') {
  //   // Nếu đang chạy trên server, không có localStorage
  //   console.log('isAccessTokenValid: localStorage is not defined');
  //   return false;
  // }

  // const accessToken = localStorage.getItem('accessToken');

  // if (!accessToken) {
  //   // Nếu không có token
  //   console.log('isAccessTokenValid: accessToken is not found');
  //   return false;
  // }

  // try {
  //   // Giải mã token
  //   const decodedToken = jwtDecode(accessToken) as { exp?: number };
  //   console.log('decodedToken', decodedToken);

  //   // Kiểm tra nếu token có `exp` và hạn sử dụng
  //   if (!decodedToken?.exp) {
  //     // localStorage.clear();
  //     console.log('isAccessTokenValid: accessToken is invalid');
  //     return false;
  //   }

  //   const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (giây)

  //   if (decodedToken.exp < currentTime) {
  //     localStorage.clear();
  //     console.log('isAccessTokenValid: accessToken is expired');
  //     return false; // Token hết hạn
  //   }
  //   return true; // Token còn hạn
  // } catch (error) {
  //   console.log('Invalid accessToken:', error);
  //   localStorage.clear();
  //   return false; // Token không hợp lệ
  // }

  return true;
};
