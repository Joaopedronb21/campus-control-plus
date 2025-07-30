import React, { createContext, useContext, useEffect, useState } from 'react';
import { findUserByEmail } from '@/lib/db/models-mock';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'professor' | 'aluno';
} | null;

interface AuthContextType {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'user_session';

function saveSession(user: User) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function loadSession(): User {
  const saved = localStorage.getItem(SESSION_KEY);
  return saved ? JSON.parse(saved) : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simplify initialization - just check localStorage directly
    const sessionUser = loadSession();
    setUser(sessionUser);
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    try {
      const user = await findUserByEmail(email);
      
      if (!user) throw new Error('Usuário não encontrado');
      
      // Simplified password check for demo 
      // Accept '123456', 'password', or any password for newly created users
      if (password !== '123456' && password !== 'password' && password.length < 6) {
        throw new Error('Senha inválida');
      }
      
      setUser(user);
      saveSession(user);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      setUser(null);
      saveSession(null);
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
        variant: "default"
      });
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive"
      });
    }
  }

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
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
