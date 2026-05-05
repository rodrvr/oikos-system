"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthState {
  token: string | null;
  user: { user_id: string; rol_id: string; iglesia_id: string } | null;
}

interface AuthContextType extends AuthState {
  login: (token: string, user: AuthState["user"]) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ token: null, user: null });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setState({ token, user: JSON.parse(user) });
    }
  }, []);

  function login(token: string, user: AuthState["user"]) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setState({ token, user });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setState({ token: null, user: null });
  }

  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, isAuthenticated: !!state.token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
