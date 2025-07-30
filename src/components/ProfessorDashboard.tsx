import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  FileText, 
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Upload,
  GraduationCap,
  CheckSquare
} from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';
import GradeManager from './GradeManager';
import AttendanceManager from './AttendanceManager';
import { StatsCard } from './dashboard/StatsCard';
import { PerformanceChart } from './dashboard/PerformanceChart';

const ProfessorDashboard = () => {
  const totalAlunos = 147;
  const novosAlunos = 5;
  const mediaFrequencia = 92;
  const taxaAprovacao = 85;
  const evolucaoMedia = '+12%';
  
  const stats = [
    {
      title: 'Minhas Turmas',
      value: '6',
      icon: BookOpen,
      colorClass: 'text-blue-500'
    },
    {
      title: 'Total de Alunos',
      value: totalAlunos,
      description: `+${novosAlunos} novos este mês`,
      icon: Users,
      colorClass: 'text-blue-500'
    },
    {
      title: 'Provas Agendadas',
      value: '8',
      icon: FileText,
      colorClass: 'text-purple-600'
    },
    {
      title: 'Presenças Hoje',
      value: '89%',
      icon: CheckCircle,
      colorClass: 'text-orange-600'
    },
    {
      title: 'Média de Frequência',
      value: `${mediaFrequencia}%`,
      icon: CheckSquare,
      colorClass: 'text-green-500'
    },
    {
      title: 'Taxa de Aprovação',
      value: `${taxaAprovacao}%`,
      icon: GraduationCap,
      colorClass: 'text-purple-500'
    },
    {
      title: 'Evolução Média',
      value: evolucaoMedia,
      description: '+12% em relação ao período anterior',
      icon: TrendingUp,
      colorClass: 'text-orange-500'
    }
  ];

  const turmas = [
    { 
      nome: '3º Ano A - Matemática', 
      alunos: 28, 
      proximaAula: 'Hoje 14:00',
      frequenciaMedia: 92,
      status: 'ativa'
    },
    { 
      nome: '2º Ano B - Matemática', 
      alunos: 25, 
      proximaAula: 'Amanhã 10:00',
      frequenciaMedia: 87,
      status: 'ativa'
    },
    { 
      nome: '1º Ano C - Matemática', 
      alunos: 30, 
      proximaAula: 'Seg 08:00',
      frequenciaMedia: 94,
      status: 'pendente'
    },
  ];

  const proximasProvas = [
    { materia: 'Matemática', turma: '3º Ano A', data: '2024-01-15', tipo: 'Mensal' },
    { materia: 'Matemática', turma: '2º Ano B', data: '2024-01-18', tipo: 'Bimestral' },
    { materia: 'Matemática', turma: '1º Ano C', data: '2024-01-22', tipo: 'Recuperação' },
  ];

  const tarefasPendentes = [
    { tarefa: 'Lançar notas da prova mensal', turma: '3º Ano A', prazo: '2 dias' },
    { tarefa: 'Criar aviso de prova', turma: '2º Ano B', prazo: '5 dias' },
    { tarefa: 'Atualizar frequências', turma: '1º Ano C', prazo: '1 dia' },
  ];

  const frequencyData = [
    { date: '2023-11-01', value: 90 },
    { date: '2023-11-02', value: 85 },
    { date: '2023-11-03', value: 92 },
    { date: '2023-11-04', value: 88 },
    { date: '2023-11-05', value: 95 },
  ];

  const gradesData = [
    { date: '2023-11-01', value: 7.5 },
    { date: '2023-11-02', value: 8.0 },
    { date: '2023-11-03', value: 6.5 },
    { date: '2023-11-04', value: 9.0 },
    { date: '2023-11-05', value: 8.5 },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard do Professor</h1>
          <p className="text-gray-600 mt-1">Gerencie suas turmas e atividades</p>
        </div>
        <div className="flex gap-2">
          <QRCodeGenerator />
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Exportar Notas
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart
          title="Frequência ao Longo do Tempo"
          data={frequencyData}
          valueLabel="Frequência (%)"
        />
        <PerformanceChart 
          title="Média das Notas"
          data={gradesData}
          valueLabel="Nota"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Minhas Turmas */}
        <Card className="school-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Minhas Turmas
            </CardTitle>
            <CardDescription>
              Turmas sob sua responsabilidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {turmas.map((turma, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{turma.nome}</h3>
                  <Badge variant={turma.status === 'ativa' ? 'default' : 'secondary'}>
                    {turma.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {turma.alunos} alunos
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {turma.proximaAula}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Frequência média</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                        style={{ width: `${turma.frequenciaMedia}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{turma.frequenciaMedia}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Próximas Provas */}
        <Card className="school-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximas Provas
            </CardTitle>
            <CardDescription>
              Provas agendadas para suas turmas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {proximasProvas.map((prova, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{prova.turma}</h4>
                  <p className="text-sm text-gray-600">{prova.materia} - {prova.tipo}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{new Date(prova.data).toLocaleDateString('pt-BR')}</p>
                  <Badge variant="outline" className="text-xs">
                    {prova.tipo}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Tarefas Pendentes e Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 school-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tarefas Pendentes
            </CardTitle>
            <CardDescription>
              Atividades que precisam da sua atenção
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tarefasPendentes.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.tarefa}</p>
                  <p className="text-xs text-gray-600">{item.turma}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                    {item.prazo}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="school-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <AttendanceManager />
            <GradeManager />
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Agendar Prova
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfessorDashboard;
