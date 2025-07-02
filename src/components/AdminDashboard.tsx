import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  TrendingUp, 
  Calendar,
  Settings,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import UserManager from './UserManager';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total de Alunos', value: '1,247', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Professores Ativos', value: '89', icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Turmas Ativas', value: '42', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Provas Este Mês', value: '156', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const recentActivities = [
    { action: 'Nova turma criada', details: '3º Ano A - Matemática', time: '2 min atrás', type: 'success' },
    { action: 'Professor cadastrado', details: 'Maria Silva - História', time: '15 min atrás', type: 'info' },
    { action: 'Alerta: Baixa frequência', details: 'João Santos - 78% de presença', time: '1h atrás', type: 'warning' },
    { action: 'Relatório gerado', details: 'Notas do 2º Bimestre', time: '2h atrás', type: 'success' },
  ];

  const quickActions = [
    { title: 'Criar Turma', icon: BookOpen, description: 'Configurar nova turma e matérias' },
    { title: 'Gerar Relatório', icon: BarChart3, description: 'Relatórios de desempenho e frequência' },
    { title: 'Configurações', icon: Settings, description: 'Configurar sistema e permissões' },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-1">Visão geral do sistema escolar</p>
        </div>
        <div className="flex gap-2">
          <UserManager />
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Agendar Reunião
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="stat-card group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-full group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ações Rápidas */}
        <Card className="lg:col-span-2 school-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Acesso rápido às principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <action.icon className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">{action.title}</span>
                  </div>
                  <p className="text-sm text-gray-600 text-left">{action.description}</p>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Atividades Recentes */}
        <Card className="school-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Atividades Recentes
            </CardTitle>
            <CardDescription>
              Últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="school-card">
          <CardHeader>
            <CardTitle>Taxa de Aprovação por Série</CardTitle>
            <CardDescription>Últimos 3 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { serie: '1º Ano', aprovacao: 92, total: 156 },
                { serie: '2º Ano', aprovacao: 89, total: 143 },
                { serie: '3º Ano', aprovacao: 85, total: 134 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.serie}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                        style={{ width: `${item.aprovacao}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{item.aprovacao}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="school-card">
          <CardHeader>
            <CardTitle>Alertas do Sistema</CardTitle>
            <CardDescription>Itens que precisam de atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">12 alunos com baixa frequência</p>
                  <p className="text-xs text-gray-600">Frequência abaixo de 75%</p>
                </div>
                <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                  Atenção
                </Badge>
              </div>
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">3 professores não lançaram notas</p>
                  <p className="text-xs text-gray-600">Prazo vence em 2 dias</p>
                </div>
                <Badge variant="outline" className="text-red-600 border-red-300">
                  Urgente
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
