'use client'

import { useState, useEffect } from 'react';
import { setItem, getItem, removeItem } from '@/lib/utils';

export function useSession() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    getItem('userSession').then(setSession);
  }, []);

  const login = async (userData: any) => {
    await setItem('userSession', userData);
    setSession(userData);
  };

  const logout = async () => {
    await removeItem('userSession');
    setSession(null);
  };

  return { session, login, logout };
}

