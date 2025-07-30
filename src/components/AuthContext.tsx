import React, { createContext, useContext, useEffect, useState } from 'react';
import { findUserByEmail } from '@/lib/db/models';
import { useToast } from './ui/use-toast';
import bcrypt from 'bcryptjs';

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
  const [user, setUser] = useState<User>(loadSession);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const sessionUser = loadSession();
      
      if (sessionUser) {
        setUser(sessionUser);
      } else {
        setUser(null);
        saveSession(null);
      }
    } catch (error: any) {
      console.error('Error checking auth:', error);
      setUser(null);
      saveSession(null);
      toast({
        title: "Erro",
        description: "Erro ao verificar autenticação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      const user = await findUserByEmail(email);
      if (!user) throw new Error('User not found');
      
      // Add password verification using bcrypt
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) throw new Error('Invalid password');
      
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
    }
  }

  async function logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      saveSession(null);
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
