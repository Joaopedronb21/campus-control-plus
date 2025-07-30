// Simple mock API for database operations
const mockData: { [key: string]: any[] } = {
  users: [
    { id: '1', email: 'admin@escola.com', name: 'Administrador', role: 'admin' },
    { id: '2', email: 'professor@escola.com', name: 'Professor Teste', role: 'professor' },
    { id: '3', email: 'aluno@escola.com', name: 'Aluno Teste', role: 'aluno' },
    { id: '4', email: 'admin@test.com', name: 'Administrador', role: 'admin' },
    { id: '5', email: 'professor@test.com', name: 'Professor Silva', role: 'professor' },
    { id: '6', email: 'aluno@test.com', name: 'Aluno Teste', role: 'aluno' }
  ],
  profiles: [
    { id: '1', email: 'admin@escola.com', name: 'Administrador', role: 'admin' },
    { id: '2', email: 'professor@escola.com', name: 'Professor Teste', role: 'professor' },
    { id: '3', email: 'aluno@escola.com', name: 'Aluno Teste', role: 'aluno' },
    { id: '4', email: 'admin@test.com', name: 'Administrador', role: 'admin' },
    { id: '5', email: 'professor@test.com', name: 'Professor Silva', role: 'professor' },
    { id: '6', email: 'aluno@test.com', name: 'Aluno Teste', role: 'aluno' }
  ],
  materias: [
    { id: '1', nome: 'Matemática', codigo: 'MAT001', professor_id: '2' },
    { id: '2', nome: 'Português', codigo: 'POR001', professor_id: '2' },
    { id: '3', nome: 'História', codigo: 'HIS001', professor_id: '5' },
    { id: '4', nome: 'Física', codigo: 'FIS001', professor_id: '5' }
  ],
  turmas: [
    { id: '1', nome: 'Turma A', serie: '1º Ano', semestre: '2024.1', materia_id: '1' },
    { id: '2', nome: 'Turma B', serie: '1º Ano', semestre: '2024.1', materia_id: '2' },
    { id: '3', nome: 'Turma C', serie: '2º Ano', semestre: '2024.1', materia_id: '3' },
    { id: '4', nome: 'Turma D', serie: '2º Ano', semestre: '2024.1', materia_id: '4' }
  ],
  professor_materias: [
    { id: '1', professor_id: '2', materia_id: '1', turma_id: '1' },
    { id: '2', professor_id: '2', materia_id: '2', turma_id: '2' },
    { id: '3', professor_id: '5', materia_id: '3', turma_id: '3' },
    { id: '4', professor_id: '5', materia_id: '4', turma_id: '4' }
  ],
  qr_codes_presenca: [],
  presencas: [],
  notas: []
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
