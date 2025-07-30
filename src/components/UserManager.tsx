
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { mockApi } from '@/lib/mock-api';
import { UserPlus } from 'lucide-react';

const UserManager: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCreateUser = async () => {
    if (!name || !email || !role || !password) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Erro",
        description: "Por favor, digite um email válido",
        variant: "destructive"
      });
      return;
    }

    // Validação de senha
    if (password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Verifica se já existe usuário com o mesmo e-mail
      const existingUserResult = await mockApi.select('users', 'id', { email });
      
      if (existingUserResult.data && existingUserResult.data.length > 0) {
        throw new Error('Já existe um usuário com este e-mail');
      }

      // Simular criação de usuário
      const userId = Date.now().toString();
      
      // Insere usuário na tabela users
      const userResult = await mockApi.insert('users', {
        id: userId,
        name,
        email,
        role: role as 'admin' | 'professor' | 'aluno'
      });

      if (userResult.error) throw userResult.error;

      // Insere perfil na tabela profiles
      const profileResult = await mockApi.insert('profiles', {
        id: userId,
        name,
        email,
        role: role as 'admin' | 'professor' | 'aluno'
      });

      if (profileResult.error) throw profileResult.error;

      toast({
        title: "Usuário criado",
        description: "Usuário cadastrado com sucesso!"
      });
      
      // Limpar formulário
      setName('');
      setEmail('');
      setRole('');
      setPassword('');
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar usuário",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="school-button">
          <UserPlus className="h-4 w-4 mr-2" />
          Cadastrar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome completo"
            />
          </div>
          
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite o e-mail"
            />
          </div>

          <div>
            <Label htmlFor="role">Tipo de Usuário</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="professor">Professor</SelectItem>
                <SelectItem value="aluno">Aluno</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="password">Senha Temporária</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite uma senha temporária"
            />
          </div>

          <Button 
            onClick={handleCreateUser} 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Criando...' : 'Criar Usuário'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserManager;
