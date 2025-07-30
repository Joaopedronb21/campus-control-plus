import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export type UserRole = 'admin' | 'professor' | 'aluno';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  password?: string; // apenas para persistência local
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  registerUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'campus-control-users';
const SESSION_KEY = 'campus-control-session';

function getUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  if (data) return JSON.parse(data);
  // Usuários de demonstração padrão
  return [
    {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Administrador',
      email: 'admin@escola.com',
      role: 'admin',
      password: '123456'
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Professor Silva',
      email: 'professor@escola.com',
      role: 'professor',
      password: '123456'
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'João Aluno',
      email: 'aluno@escola.com',
      role: 'aluno',
      password: '123456'
    }
  ];
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveSession(user: User | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function getSession(): User | null {
  const data = localStorage.getItem(SESSION_KEY);
  if (data) return JSON.parse(data);
  return null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getSession());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Atualiza usuário do localStorage ao iniciar
    setUser(getSession());
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const users = getUsers();
      const found = users.find(u => u.email === email && u.password === password);
      if (!found) throw new Error('Login inválido');
      setUser(found);
      saveSession(found);
      return true;
    } catch (error) {
      setUser(null);
      saveSession(null);
      toast({
        title: "Erro no login",
        description: "Usuário ou senha inválidos",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    saveSession(null);
    toast({
      title: "Logout realizado",
      description: "Até logo!"
    });
  };

  // Função para registrar novo usuário (usada pelo SignupForm)
  const registerUser = (newUser: User) => {
    const users = getUsers();
    users.push(newUser);
    saveUsers(users);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
