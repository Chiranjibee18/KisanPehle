import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiClient } from '../services/api';

export interface UserProfile {
  id: string;
  mobile: string;
  name: string;
  role: string;
  preferredLanguage: string;
  state: string;
  district: string;
  farmerProfile?: any;
  officerCenter?: any;
}

interface AuthContextType {
  user: UserProfile | null;
  role: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  sendOtp: (mobile: string) => Promise<any>;
  verifyOtp: (dto: any) => Promise<any>;
  login: (mobile: string, password?: string) => Promise<any>;
  demoLogin: (role: string) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('kisan_pehele_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('kisan_pehele_token');
    if (token) {
      ApiClient.getProfile()
        .then((res) => {
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('kisan_pehele_user', JSON.stringify(res.user));
          }
        })
        .catch(() => {
          // Keep offline cached user if present
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const sendOtp = async (mobile: string) => {
    return ApiClient.sendOtp(mobile);
  };

  const verifyOtp = async (dto: any) => {
    const res = await ApiClient.verifyOtp(dto);
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const login = async (mobile: string, password?: string) => {
    const res = await ApiClient.login(mobile, password);
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const demoLogin = async (roleKey: string) => {
    const res = await ApiClient.demoLogin(roleKey);
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    ApiClient.logout();
    setUser(null);
  };

  const role = user?.role || 'GUEST';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        sendOtp,
        verifyOtp,
        login,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
