// frontend/src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

type UserRole = 'admin' | 'santri' | 'orangtua' | null;

interface AuthContextType {
  role: UserRole;
  login: (userRole: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);

  const login = (userRole: UserRole) => {
    setRole(userRole);
  };

  const logout = () => {
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}