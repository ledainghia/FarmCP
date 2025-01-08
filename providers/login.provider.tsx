'use client';

import React, { use, useEffect } from 'react';
import { useReadLocalStorage } from 'usehooks-ts';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const accessToken = window.localStorage.getItem('accessToken');
    const refreshToken = window.localStorage.getItem('refreshToken');
    const currentTime = Math.floor(Date.now() / 1000);
    if (!accessToken || !refreshToken) {
      localStorage.clear();
      redirect('/');
    }
    const decodedRefreshToken = jwtDecode(refreshToken) as { exp?: number };
    if (decodedRefreshToken.exp && decodedRefreshToken.exp < currentTime) {
      localStorage.clear();
      redirect('/');
    }
  }, []);
  return <>{children}</>;
};

export default LoginProvider;
