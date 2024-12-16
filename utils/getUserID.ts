import { jwtDecode } from 'jwt-decode';

export const getUserID = (): string => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    return '';
  }
  const decodedToken = jwtDecode(accessToken) as { nameid?: string };
  const userID = decodedToken?.nameid;
  if (!userID) {
    return '';
  }
  return userID;
};
