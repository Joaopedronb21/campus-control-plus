
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Calendar,
  TrendingUp,
  Award,
  Clock,
  FileText,
  QrCode,
  Bell,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const AlunoDashboard = () => {
  const stats = [
    { title: 'Frequência Geral', value: '92%', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Média Geral', value: '8.4', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Próximas Provas', value: '3', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Matérias Cursando', value: '8', icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const materias = [
    { nome: 'Matemática', professor: 'Prof. João Silva', nota: 8.5, frequencia: 95, status: 'aprovado' },
    { nome: 'Português', professor: 'Prof. Maria Santos', nota: 7.8, frequencia: 90, status: 'aprovado' },
    { nome: 'História', professor: 'Prof. Carlos Lima', nota: 9.2, frequencia: 88, status: 'aprovado' },
    { nome: 'Geografia', professor: 'Prof. Ana Costa', nota: 6.5, frequencia: 85, status: 'recuperacao' },
    { nome: 'Física', professor: 'Prof. Pedro Nunes', nota: 8.0, frequencia: 92, status: 'aprovado' },
    { nome: 'Química', professor: 'Prof. Laura Dias', nota: 7.2, frequencia: 87, status: 'aprovado' },
  ];

  const proximasProvas = [
    { materia: 'Matemática', data: '2024-01-15', tipo: 'Prova Mensal', professor: 'Prof. João Silva' },
    { materia: 'História', data: '2024-01-18', tipo: 'Prova Bimestral', professor: 'Prof. Carlos Lima' },
    { materia: 'Geografia', data: '2024-01-22', tipo: 'Recuperação', professor: 'Prof. Ana Costa' },
  ];

  const avisos = [
    { titulo: 'Prova de Matemática', descricao: 'Prova mensal na próxima semana', tipo: 'prova', tempo: '2 dias' },
    { titulo: 'Frequência baixa em Geografia', descricao: 'Atenção à frequência na matéria', tipo: 'aviso', tempo: '1 dia' },
    { titulo: 'Entrega de trabalho', descricao: 'Trabalho de História - Prazo final', tipo: 'trabalho', tempo: '3 dias' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'recuperacao':
        return <Badge className="bg-yellow-100 text-yellow-800">Recuperação</Badge>;
      case 'reprovado':
        return <Badge className="bg-red-100 text-red-800">Reprovado</Badge>;
      default:
        return <Badge variant="secondary">Em Andamento</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Dashboard</h1>
          <p className="text-gray-600 mt-1">Acompanhe seu desempenho acadêmico</p>
        </div>
        <div className="flex gap-2">
          <Button className="school-button">
            <QrCode className="h-4 w-4 mr-2" />
            Registrar Presença
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
        {/* Boletim Escolar */}
        <Card className="lg:col-span-2 school-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Boletim Escolar
            </CardTitle>
            <CardDescription>
              Suas notas e frequência por matéria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {materias.map((materia, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{materia.nome}</h3>
                    <p className="text-sm text-gray-600">{materia.professor}</p>
                  </div>
                  {getStatusBadge(materia.status)}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Nota</span>
                      <span className="text-sm font-medium">{materia.nota}</span>
                    </div>
                    <Progress 
                      value={(materia.nota / 10) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Frequência</span>
                      <span className="text-sm font-medium">{materia.frequencia}%</span>
                    </div>
                    <Progress 
                      value={materia.frequencia} 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Avisos e Notificações */}
        <Card className="school-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Avisos Recentes
            </CardTitle>
            <CardDescription>
              Notificações importantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {avisos.map((aviso, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm text-gray-900">{aviso.titulo}</h4>
                  <div className={`w-2 h-2 rounded-full ${
                    aviso.tipo === 'prova' ? 'bg-red-500' :
                    aviso.tipo === 'aviso' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                </div>
                <p className="text-xs text-gray-600 mb-2">{aviso.descricao}</p>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-400">{aviso.tempo}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Próximas Provas */}
      <Card className="school-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Próximas Provas
          </CardTitle>
          <CardDescription>
            Provas agendadas para os próximos dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {proximasProvas.map((prova, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{prova.materia}</h3>
                  <Badge variant="outline">{prova.tipo}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{prova.professor}</p>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {new Date(prova.data).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlunoDashboard;
