// Simple mock API for database operations
const mockData: { [key: string]: any[] } = {
  users: [
    { id: '1', email: 'admin@escola.com', name: 'Administrador', role: 'admin' },
    { id: '2', email: 'professor@escola.com', name: 'Professor Teste', role: 'professor' },
    { id: '3', email: 'aluno@escola.com', name: 'Aluno Teste', role: 'aluno' },
    { id: '4', email: 'admin@test.com', name: 'Administrador', role: 'admin' },
    { id: '5', email: 'professor@test.com', name: 'Professor Silva', role: 'professor' },
    { id: '6', email: 'aluno@test.com', name: 'João Silva', role: 'aluno' },
    { id: '7', email: 'maria@test.com', name: 'Maria Santos', role: 'aluno' },
    { id: '8', email: 'pedro@test.com', name: 'Pedro Oliveira', role: 'aluno' },
    { id: '9', email: 'ana@test.com', name: 'Ana Costa', role: 'aluno' },
    { id: '10', email: 'carlos@test.com', name: 'Carlos Lima', role: 'aluno' },
    { id: '11', email: 'lucia@test.com', name: 'Lúcia Fernandes', role: 'professor' },
    { id: '12', email: 'roberto@test.com', name: 'Roberto Alves', role: 'professor' }
  ],
  profiles: [
    { id: '1', email: 'admin@escola.com', name: 'Administrador', role: 'admin' },
    { id: '2', email: 'professor@escola.com', name: 'Professor Teste', role: 'professor' },
    { id: '3', email: 'aluno@escola.com', name: 'Aluno Teste', role: 'aluno' },
    { id: '4', email: 'admin@test.com', name: 'Administrador', role: 'admin' },
    { id: '5', email: 'professor@test.com', name: 'Professor Silva', role: 'professor' },
    { id: '6', email: 'aluno@test.com', name: 'João Silva', role: 'aluno' },
    { id: '7', email: 'maria@test.com', name: 'Maria Santos', role: 'aluno' },
    { id: '8', email: 'pedro@test.com', name: 'Pedro Oliveira', role: 'aluno' },
    { id: '9', email: 'ana@test.com', name: 'Ana Costa', role: 'aluno' },
    { id: '10', email: 'carlos@test.com', name: 'Carlos Lima', role: 'aluno' },
    { id: '11', email: 'lucia@test.com', name: 'Lúcia Fernandes', role: 'professor' },
    { id: '12', email: 'roberto@test.com', name: 'Roberto Alves', role: 'professor' }
  ],
  materias: [
    { id: '1', nome: 'Matemática', codigo: 'MAT001', professor_id: '2' },
    { id: '2', nome: 'Português', codigo: 'POR001', professor_id: '2' },
    { id: '3', nome: 'História', codigo: 'HIS001', professor_id: '5' },
    { id: '4', nome: 'Física', codigo: 'FIS001', professor_id: '5' },
    { id: '5', nome: 'Química', codigo: 'QUI001', professor_id: '11' },
    { id: '6', nome: 'Biologia', codigo: 'BIO001', professor_id: '11' },
    { id: '7', nome: 'Geografia', codigo: 'GEO001', professor_id: '12' },
    { id: '8', nome: 'Inglês', codigo: 'ING001', professor_id: '12' }
  ],
  turmas: [
    { id: '1', nome: 'Turma A', serie: '1º Ano', semestre: '2024.1', materia_id: '1' },
    { id: '2', nome: 'Turma B', serie: '1º Ano', semestre: '2024.1', materia_id: '2' },
    { id: '3', nome: 'Turma C', serie: '2º Ano', semestre: '2024.1', materia_id: '3' },
    { id: '4', nome: 'Turma D', serie: '2º Ano', semestre: '2024.1', materia_id: '4' },
    { id: '5', nome: 'Turma E', serie: '3º Ano', semestre: '2024.1', materia_id: '5' },
    { id: '6', nome: 'Turma F', serie: '3º Ano', semestre: '2024.1', materia_id: '6' }
  ],
  professor_materias: [
    { id: '1', professor_id: '2', materia_id: '1', turma_id: '1' },
    { id: '2', professor_id: '2', materia_id: '2', turma_id: '2' },
    { id: '3', professor_id: '5', materia_id: '3', turma_id: '3' },
    { id: '4', professor_id: '5', materia_id: '4', turma_id: '4' },
    { id: '5', professor_id: '11', materia_id: '5', turma_id: '5' },
    { id: '6', professor_id: '11', materia_id: '6', turma_id: '6' },
    { id: '7', professor_id: '12', materia_id: '7', turma_id: '1' },
    { id: '8', professor_id: '12', materia_id: '8', turma_id: '2' }
  ],
  aluno_turmas: [
    { id: '1', aluno_id: '3', turma_id: '1', data_matricula: '2024-01-15' },
    { id: '2', aluno_id: '6', turma_id: '1', data_matricula: '2024-01-15' },
    { id: '3', aluno_id: '7', turma_id: '1', data_matricula: '2024-01-15' },
    { id: '4', aluno_id: '8', turma_id: '2', data_matricula: '2024-01-15' },
    { id: '5', aluno_id: '9', turma_id: '2', data_matricula: '2024-01-15' },
    { id: '6', aluno_id: '10', turma_id: '3', data_matricula: '2024-01-15' },
    { id: '7', aluno_id: '3', turma_id: '4', data_matricula: '2024-01-15' },
    { id: '8', aluno_id: '6', turma_id: '5', data_matricula: '2024-01-15' },
    { id: '9', aluno_id: '7', turma_id: '6', data_matricula: '2024-01-15' }
  ],
  qr_codes_presenca: [
    { 
      id: '1', 
      codigo: 'QR-MAT001-20240130-1', 
      professor_id: '2', 
      materia_id: '1', 
      turma_id: '1', 
      data_aula: '2024-01-30', 
      ativo: true, 
      expires_at: '2024-01-30T10:30:00Z',
      created_at: '2024-01-30T09:00:00Z'
    }
  ],
  presencas: [
    { id: '1', aluno_id: '3', materia_id: '1', turma_id: '1', data_aula: '2024-01-29', presente: true, qr_code_usado: true },
    { id: '2', aluno_id: '6', materia_id: '1', turma_id: '1', data_aula: '2024-01-29', presente: true, qr_code_usado: true },
    { id: '3', aluno_id: '7', materia_id: '1', turma_id: '1', data_aula: '2024-01-29', presente: false, qr_code_usado: false },
    { id: '4', aluno_id: '3', materia_id: '2', turma_id: '2', data_aula: '2024-01-28', presente: true, qr_code_usado: true },
    { id: '5', aluno_id: '8', materia_id: '2', turma_id: '2', data_aula: '2024-01-28', presente: true, qr_code_usado: true },
    { id: '6', aluno_id: '9', materia_id: '2', turma_id: '2', data_aula: '2024-01-28', presente: false, qr_code_usado: false }
  ],
  notas: [
    { id: '1', aluno_id: '3', materia_id: '1', turma_id: '1', professor_id: '2', nota: 8.5, tipo: 'Prova', data_lancamento: '2024-01-25' },
    { id: '2', aluno_id: '6', materia_id: '1', turma_id: '1', professor_id: '2', nota: 9.0, tipo: 'Prova', data_lancamento: '2024-01-25' },
    { id: '3', aluno_id: '7', materia_id: '1', turma_id: '1', professor_id: '2', nota: 7.5, tipo: 'Prova', data_lancamento: '2024-01-25' },
    { id: '4', aluno_id: '3', materia_id: '2', turma_id: '2', professor_id: '2', nota: 9.5, tipo: 'Trabalho', data_lancamento: '2024-01-20' },
    { id: '5', aluno_id: '8', materia_id: '2', turma_id: '2', professor_id: '2', nota: 8.0, tipo: 'Trabalho', data_lancamento: '2024-01-20' },
    { id: '6', aluno_id: '9', materia_id: '2', turma_id: '2', professor_id: '2', nota: 6.5, tipo: 'Trabalho', data_lancamento: '2024-01-20' }
  ]
};

// Helper functions for direct usage - much simpler
export const mockApi = {
  async select(table: string, columns?: string, filters?: any): Promise<{ data: any[], error: any }> {
    let data = mockData[table] || [];
    
    // Apply filters if provided
    if (filters) {
      Object.keys(filters).forEach(key => {
        data = data.filter(item => item[key] === filters[key]);
      });
    }
    
    return { data, error: null };
  },

  async insert(table: string, data: any): Promise<{ data: any, error: any }> {
    if (!mockData[table]) {
      mockData[table] = [];
    }
    
    const items = Array.isArray(data) ? data : [data];
    const insertedItems = items.map(item => ({
      ...item,
      id: item.id || Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }));
    
    mockData[table].push(...insertedItems);
    return { data: insertedItems, error: null };
  },

  async update(table: string, data: any, filters: any): Promise<{ data: any[], error: any }> {
    const tableData = mockData[table] || [];
    const updatedItems: any[] = [];
    
    for (let item of tableData) {
      let matches = true;
      Object.keys(filters).forEach(key => {
        if (item[key] !== filters[key]) matches = false;
      });
      
      if (matches) {
        const updatedItem = { ...item, ...data };
        Object.assign(item, updatedItem);
        updatedItems.push(updatedItem);
      }
    }
    
    return { data: updatedItems, error: null };
  },

  async delete(table: string, filters: any): Promise<{ data: any[], error: any }> {
    const tableData = mockData[table] || [];
    const deletedItems: any[] = [];
    
    mockData[table] = tableData.filter(item => {
      let matches = true;
      Object.keys(filters).forEach(key => {
        if (item[key] !== filters[key]) matches = false;
      });
      
      if (matches) {
        deletedItems.push(item);
        return false;
      }
      return true;
    });
    
    return { data: deletedItems, error: null };
  }
};

export default mockApi;
