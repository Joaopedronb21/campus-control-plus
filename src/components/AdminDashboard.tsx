import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mockApi } from '@/lib/mock-api';
import { Users, BookOpen, GraduationCap, BarChart3, Calendar, Bell, Settings, FileText, PlusCircle } from 'lucide-react';
import UserManager from './UserManager';
import UserList from './UserList';
import StudentSubjectManager from './StudentSubjectManager';
import ProfessorSubjectManager from './ProfessorSubjectManager';
import ReportsManager from './ReportsManager';
import Navbar from './Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();

  // Matéria
  const [materiaNome, setMateriaNome] = useState('');
  const [materiaCodigo, setMateriaCodigo] = useState('');
  const [isMateriaLoading, setIsMateriaLoading] = useState(false);

  // Turma
  const [turmaNome, setTurmaNome] = useState('');
  const [turmaSerie, setTurmaSerie] = useState('');
  const [isTurmaLoading, setIsTurmaLoading] = useState(false);

  // Cadastro de matéria
  const handleCreateMateria = async () => {
    setIsMateriaLoading(true);
    try {
      const result = await mockApi.insert('materias', {
        nome: materiaNome,
        codigo: materiaCodigo
      });
      if (result.error) {
        toast({ title: "Erro", description: result.error.message || "Erro ao criar matéria", variant: "destructive" });
      } else {
        toast({ title: "Matéria criada", description: "Matéria cadastrada com sucesso!" });
        setMateriaNome('');
        setMateriaCodigo('');
      }
    } finally {
      setIsMateriaLoading(false);
    }
  };

  // Cadastro de turma
  const handleCreateTurma = async () => {
    setIsTurmaLoading(true);
    try {
      const result = await mockApi.insert('turmas', {
        nome: turmaNome,
        serie: turmaSerie
      });
      if (result.error) {
        toast({ title: "Erro", description: result.error.message || "Erro ao criar turma", variant: "destructive" });
      } else {
        toast({ title: "Turma criada", description: "Turma cadastrada com sucesso!" });
        setTurmaNome('');
        setTurmaSerie('');
      }
    } finally {
      setIsTurmaLoading(false);
    }
  };

  const stats = [
    { title: 'Total de Alunos', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { title: 'Professores', value: '87', icon: GraduationCap, color: 'bg-green-500' },
    { title: 'Matérias', value: '24', icon: BookOpen, color: 'bg-purple-500' },
    { title: 'Turmas Ativas', value: '42', icon: Calendar, color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600 mt-2">Gerencie todos os aspectos do sistema escolar</p>
          </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="school-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Management Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Management */}
          <Card className="school-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gerenciamento de Usuários
              </CardTitle>
              <CardDescription>
                Cadastrar e gerenciar usuários do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <UserManager />
              <UserList />
            </CardContent>
          </Card>

          {/* Subject Management */}
          <Card className="school-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Gerenciamento de Vínculos
              </CardTitle>
              <CardDescription>
                Vincular alunos e professores às matérias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                <StudentSubjectManager />
                <ProfessorSubjectManager />
                <ReportsManager />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="school-button" variant="outline">
                <PlusCircle className="h-4 w-4 mr-2" />
                Criar Matéria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Matéria</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nome da Matéria</Label>
                  <Input value={materiaNome} onChange={e => setMateriaNome(e.target.value)} placeholder="Ex: Matemática" />
                </div>
                <div>
                  <Label>Código</Label>
                  <Input value={materiaCodigo} onChange={e => setMateriaCodigo(e.target.value)} placeholder="Ex: MAT101" />
                </div>
                <Button onClick={handleCreateMateria} disabled={isMateriaLoading} className="w-full">
                  {isMateriaLoading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="school-button" variant="outline">
                <PlusCircle className="h-4 w-4 mr-2" />
                Criar Turma
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Turma</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nome da Turma</Label>
                  <Input value={turmaNome} onChange={e => setTurmaNome(e.target.value)} placeholder="Ex: 3º Ano A" />
                </div>
                <div>
                  <Label>Série</Label>
                  <Input value={turmaSerie} onChange={e => setTurmaSerie(e.target.value)} placeholder="Ex: 3" />
                </div>
                <Button onClick={handleCreateTurma} disabled={isTurmaLoading} className="w-full">
                  {isTurmaLoading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="school-card hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold">Relatórios</h3>
              <p className="text-sm text-gray-600">Ver estatísticas detalhadas</p>
            </CardContent>
          </Card>

          <Card className="school-card hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Bell className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold">Avisos</h3>
              <p className="text-sm text-gray-600">Gerenciar notificações</p>
            </CardContent>
          </Card>

          <Card className="school-card hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Settings className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold">Configurações</h3>
              <p className="text-sm text-gray-600">Ajustar parâmetros</p>
            </CardContent>
          </Card>

          <Card className="school-card hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <h3 className="font-semibold">Documentos</h3>
              <p className="text-sm text-gray-600">Gerenciar arquivos</p>
            </CardContent>
          </Card>
        </div>
        <div>
          <p>Bem-vindo ao painel administrativo. Use os botões acima para cadastrar matérias e turmas.</p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
