import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SignupFormProps {
  onBackToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onBackToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Verifica se já existe usuário com o mesmo e-mail
      const { data: existing, error: fetchError } = await supabase
        .from('profiles') // Use your actual user table name
        .select('id')
        .eq('email', email)
        .single();

      if (existing) {
        throw new Error('Já existe um usuário com este e-mail');
      }
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      // Cria novo usuário autenticado
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });

      if (signUpError) throw signUpError;

      // Insere perfil do usuário na tabela profiles
      const { error } = await supabase.from('profiles').insert({
        name,
        email,
        role,
        id: signUpData.user?.id // Relaciona o perfil ao usuário autenticado
      });

      if (error) throw error;

      toast({
        title: "Cadastro realizado",
        description: "Conta criada com sucesso! Você pode fazer login agora."
      });
      onBackToLogin();
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="school-card">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl text-center">Criar Conta</CardTitle>
        <CardDescription className="text-center">
          Preencha os dados para criar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <div className="relative">
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-2"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-2"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-2"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Tipo de Usuário</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione seu tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="professor">Professor</SelectItem>
                <SelectItem value="aluno">Aluno</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="w-full school-button"
            disabled={isLoading}
          >
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onBackToLogin}
          >
            Voltar ao Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
