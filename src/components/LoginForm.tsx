
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';
import { BookOpen, Mail, Lock, Users } from 'lucide-react';
import SignupForm from './SignupForm';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao Campus Control Plus",
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos",
        variant: "destructive",
      });
    }
  };

  const mockAccounts = [
    { email: 'admin@escola.com', role: 'Administrador', icon: '👨‍💼' },
    { email: 'professor@escola.com', role: 'Professor', icon: '👩‍🏫' },
    { email: 'aluno@escola.com', role: 'Aluno', icon: '👨‍🎓' }
  ];

  if (showSignup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo e Título */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-2xl shadow-xl">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Campus Control Plus</h1>
              <p className="text-gray-600 mt-2">Sistema de Controle Escolar</p>
            </div>
          </div>

          <SignupForm onBackToLogin={() => setShowSignup(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo e Título */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-2xl shadow-xl">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Campus Control Plus</h1>
            <p className="text-gray-600 mt-2">Sistema de Controle Escolar</p>
          </div>
        </div>

        {/* Card de Login */}
        <Card className="school-card">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center">Fazer Login</CardTitle>
            <CardDescription className="text-center">
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full school-button"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button 
                variant="link" 
                onClick={() => setShowSignup(true)}
                className="text-blue-600 hover:text-blue-800"
              >
                Não tem conta? Cadastre-se aqui
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contas de Demonstração */}
        <Card className="school-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contas de Demonstração
            </CardTitle>
            <CardDescription>
              Clique em uma conta para fazer login automaticamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockAccounts.map((account, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start gap-3 h-12"
                onClick={() => {
                  setEmail(account.email);
                  setPassword('123456');
                }}
              >
                <span className="text-xl">{account.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{account.role}</div>
                  <div className="text-sm text-gray-500">{account.email}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
