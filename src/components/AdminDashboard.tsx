
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, BarChart3, Calendar, Bell, Settings, FileText } from 'lucide-react';
import UserManager from './UserManager';
import StudentSubjectManager from './StudentSubjectManager';
import ProfessorSubjectManager from './ProfessorSubjectManager';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total de Alunos', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { title: 'Professores', value: '87', icon: GraduationCap, color: 'bg-green-500' },
    { title: 'Matérias', value: '24', icon: BookOpen, color: 'bg-purple-500' },
    { title: 'Turmas Ativas', value: '42', icon: Calendar, color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
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
      </div>
    </div>
  );
};

export default AdminDashboard;
