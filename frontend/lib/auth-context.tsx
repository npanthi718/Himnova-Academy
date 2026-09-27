'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from './api-client';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'TRAINER' | 'STUDENT';
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  bio?: string | null;
  referralCode: string;
  referredById?: string | null;
  isMfaEnabled?: boolean;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string; rememberMe?: boolean }) => Promise<void>;
  register: (data: { fullName: string; email: string; password: string; phoneNumber?: string; referralCode?: string }) => Promise<void>;
  logout: () => void;
  quickDemoLogin: (role: 'admin' | 'trainer' | 'student') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('himnova_jwt_token');
    const savedUser = localStorage.getItem('himnova_user_data');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify with backend silently
        api.getMe()
          .then((verifiedUser) => {
            setUser(verifiedUser);
            localStorage.setItem('himnova_user_data', JSON.stringify(verifiedUser));
          })
          .catch(() => {
            // Token expired or invalid
            logout();
          })
          .finally(() => setIsLoading(false));
      } catch (e) {
        logout();
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    setIsLoading(true);
    try {
      const res = await api.login(credentials);
      setToken(res.accessToken);
      setUser(res.user);

      localStorage.setItem('himnova_jwt_token', res.accessToken);
      localStorage.setItem('himnova_user_data', JSON.stringify(res.user));

      if (res.redirectUrl) {
        router.push(res.redirectUrl);
      } else {
        if (res.user.role === 'SUPER_ADMIN') router.push('/admin');
        else if (res.user.role === 'TRAINER') router.push('/trainer');
        else router.push('/student');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { fullName: string; email: string; password: string; phoneNumber?: string; referralCode?: string }) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      setToken(res.accessToken);
      setUser(res.user);

      localStorage.setItem('himnova_jwt_token', res.accessToken);
      localStorage.setItem('himnova_user_data', JSON.stringify(res.user));

      router.push('/student');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('himnova_jwt_token');
    localStorage.removeItem('himnova_user_data');
    router.push('/login');
  };

  const quickDemoLogin = async (role: 'admin' | 'trainer' | 'student') => {
    if (role === 'admin') {
      await login({ email: 'admin@himnova.com', password: 'Admin@123' });
    } else if (role === 'trainer') {
      await login({ email: 'trainer@himnova.com', password: 'Trainer@123' });
    } else {
      await login({ email: 'student@himnova.com', password: 'Student@123' });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
