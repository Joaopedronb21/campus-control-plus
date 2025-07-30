import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { mockApi } from '@/lib/mock-api';
import { useAuth } from './AuthContext';
import { FileBarChart, Download, Users, GraduationCap } from 'lucide-react';

interface ReportData {
  aluno_id: string;
  aluno_nome: string;
  materia_nome: string;
  turma_nome: string;
  total_aulas: number;
  presencas: number;
  frequencia: number;
  media_notas: number;
  total_notas: number;
}

const ReportsManager: React.FC = () => {
  const [reportType, setReportType] = useState<'presenca' | 'notas' | 'geral'>('geral');
  const [selectedTurma, setSelectedTurma] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('');
  const [turmas, setTurmas] = useState<any[]>([]);
  const [materias, setMaterias] = useState<any[]>([]);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchInitialData();
  }, [user]);

  const fetchInitialData = async () => {
    try {
      let turmasResult, materiasResult;

      if (user?.role === 'professor') {
        // Professor vê apenas suas turmas e matérias
        const professorMaterias = await mockApi.select('professor_materias', '*', { professor_id: user.id });
        
        if (professorMaterias.data) {
          const turmaIds = [...new Set(professorMaterias.data.map(pm => pm.turma_id))];
          const materiaIds = [...new Set(professorMaterias.data.map(pm => pm.materia_id))];
          
          turmasResult = await mockApi.select('turmas', '*');
          materiasResult = await mockApi.select('materias', '*');
          
          setTurmas(turmasResult.data?.filter(t => turmaIds.includes(t.id)) || []);
          setMaterias(materiasResult.data?.filter(m => materiaIds.includes(m.id)) || []);
        }
      } else {
        // Admin vê tudo
        turmasResult = await mockApi.select('turmas', '*');
        materiasResult = await mockApi.select('materias', '*');
        
        setTurmas(turmasResult.data || []);
        setMaterias(materiasResult.data || []);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const generateReport = async () => {
    if (!selectedTurma && !selectedMateria) {
      toast({
        title: "Seleção obrigatória",
        description: "Selecione pelo menos uma turma ou matéria",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const filters: any = {};
      if (selectedTurma) filters.turma_id = selectedTurma;
      if (selectedMateria) filters.materia_id = selectedMateria;

      // Buscar alunos da turma
      const alunoTurmas = await mockApi.select('aluno_turmas', '*', selectedTurma ? { turma_id: selectedTurma } : {});
      
      // Buscar todas as presenças
      const presencas = await mockApi.select('presencas', '*', filters);
      
      // Buscar todas as notas
      const notas = await mockApi.select('notas', '*', filters);
      
      // Buscar dados dos alunos
      const alunos = await mockApi.select('profiles', '*', { role: 'aluno' });
      
      // Processar dados do relatório
      const reportData: ReportData[] = [];
      
      if (alunoTurmas.data) {
        for (const alunoTurma of alunoTurmas.data) {
          const aluno = alunos.data?.find(a => a.id === alunoTurma.aluno_id);
          if (!aluno) continue;

          // Calcular presenças
          const alunoPresencas = presencas.data?.filter(p => p.aluno_id === aluno.id) || [];
          const totalAulas = alunoPresencas.length;
          const presencasCount = alunoPresencas.filter(p => p.presente).length;
          const frequencia = totalAulas > 0 ? (presencasCount / totalAulas) * 100 : 0;

          // Calcular notas
          const alunoNotas = notas.data?.filter(n => n.aluno_id === aluno.id) || [];
          const mediaNotas = alunoNotas.length > 0 
            ? alunoNotas.reduce((acc, curr) => acc + curr.nota, 0) / alunoNotas.length 
            : 0;

          // Buscar nomes da matéria e turma
          const turma = turmas.find(t => t.id === alunoTurma.turma_id);
          const materia = materias.find(m => m.id === selectedMateria || 
            (selectedTurma && m.id === turma?.materia_id));

          reportData.push({
            aluno_id: aluno.id,
            aluno_nome: aluno.name,
            materia_nome: materia?.nome || 'N/A',
            turma_nome: turma?.nome || 'N/A',
            total_aulas: totalAulas,
            presencas: presencasCount,
            frequencia: Number(frequencia.toFixed(2)),
            media_notas: Number(mediaNotas.toFixed(2)),
            total_notas: alunoNotas.length
          });
        }
      }

      setReportData(reportData);
      
      toast({
        title: "Relatório gerado",
        description: `Relatório gerado com ${reportData.length} registros`
      });

    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar relatório",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = () => {
    if (reportData.length === 0) {
      toast({
        title: "Nenhum dado",
        description: "Gere um relatório primeiro",
        variant: "destructive"
      });
      return;
    }

    // Simular download de CSV
    const csvData = [
      ['Aluno', 'Matéria', 'Turma', 'Total Aulas', 'Presenças', 'Frequência (%)', 'Média Notas', 'Total Notas'],
      ...reportData.map(row => [
        row.aluno_nome,
        row.materia_nome,
        row.turma_nome,
        row.total_aulas,
        row.presencas,
        row.frequencia,
        row.media_notas,
        row.total_notas
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Relatório exportado",
      description: "Arquivo CSV baixado com sucesso"
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <FileBarChart className="h-4 w-4 mr-2" />
          Relatórios
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerar Relatórios</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filtros */}
          <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
            <div>
              <Label>Tipo de Relatório</Label>
              <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">Relatório Geral</SelectItem>
                  <SelectItem value="presenca">Apenas Presenças</SelectItem>
                  <SelectItem value="notas">Apenas Notas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Turma</Label>
              <Select value={selectedTurma} onValueChange={setSelectedTurma}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as turmas</SelectItem>
                  {turmas.map(turma => (
                    <SelectItem key={turma.id} value={turma.id}>
                      {turma.nome} - {turma.serie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Matéria</Label>
              <Select value={selectedMateria} onValueChange={setSelectedMateria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a matéria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as matérias</SelectItem>
                  {materias.map(materia => (
                    <SelectItem key={materia.id} value={materia.id}>
                      {materia.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2">
            <Button onClick={generateReport} disabled={isLoading}>
              {isLoading ? 'Gerando...' : 'Gerar Relatório'}
            </Button>
            
            <Button variant="outline" onClick={exportReport} disabled={reportData.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>

          {/* Estatísticas resumidas */}
          {reportData.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total de Alunos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-2xl font-bold">{reportData.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Frequência Média</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-2xl font-bold">
                      {(reportData.reduce((acc, curr) => acc + curr.frequencia, 0) / reportData.length).toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Média Geral</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <FileBarChart className="h-4 w-4 text-purple-500 mr-2" />
                    <span className="text-2xl font-bold">
                      {(reportData.reduce((acc, curr) => acc + curr.media_notas, 0) / reportData.length).toFixed(1)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Aprovação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Badge variant="default" className="mr-2">
                      {Math.round((reportData.filter(d => d.media_notas >= 7 && d.frequencia >= 75).length / reportData.length) * 100)}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tabela de dados */}
          {reportData.length > 0 && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Matéria</TableHead>
                    <TableHead>Turma</TableHead>
                    {(reportType === 'presenca' || reportType === 'geral') && (
                      <>
                        <TableHead>Aulas</TableHead>
                        <TableHead>Presenças</TableHead>
                        <TableHead>Frequência</TableHead>
                      </>
                    )}
                    {(reportType === 'notas' || reportType === 'geral') && (
                      <>
                        <TableHead>Média</TableHead>
                        <TableHead>Status</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.aluno_nome}</TableCell>
                      <TableCell>{row.materia_nome}</TableCell>
                      <TableCell>{row.turma_nome}</TableCell>
                      {(reportType === 'presenca' || reportType === 'geral') && (
                        <>
                          <TableCell>{row.total_aulas}</TableCell>
                          <TableCell>{row.presencas}</TableCell>
                          <TableCell>
                            <Badge variant={row.frequencia >= 75 ? "default" : "destructive"}>
                              {row.frequencia}%
                            </Badge>
                          </TableCell>
                        </>
                      )}
                      {(reportType === 'notas' || reportType === 'geral') && (
                        <>
                          <TableCell>
                            <Badge variant={row.media_notas >= 7 ? "default" : "destructive"}>
                              {row.media_notas}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                row.media_notas >= 7 && row.frequencia >= 75 
                                  ? "default" 
                                  : "destructive"
                              }
                            >
                              {row.media_notas >= 7 && row.frequencia >= 75 ? "Aprovado" : "Reprovado"}
                            </Badge>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {reportData.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              Configure os filtros e clique em "Gerar Relatório" para visualizar os dados
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportsManager;
