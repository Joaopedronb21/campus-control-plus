// Mock implementation for browser compatibility
// In a real application, these would call a backend API

import { mockApi } from '../mock-api';

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'professor' | 'aluno';
}) {
  // In a real app, this would make an API call to your backend
  return { id: 'mock-id', changes: 1 };
}

export async function findUserByEmail(email: string) {
  // First, try to find in mock-api users table
  const dynamicUsersResult = await mockApi.select('users', 'id', { email });
  
  if (dynamicUsersResult.data && dynamicUsersResult.data.length > 0) {
    const user = dynamicUsersResult.data[0];
    return {
      id: user.id,
      email: user.email,
      password: '$2b$10$mockHashedPassword', // Mock hashed password
      name: user.name,
      role: user.role
    };
  }

  // Fallback to static mock users for testing
  const mockUsers = {
    'admin@escola.com': {
      id: '1',
      email: 'admin@escola.com',
      password: '$2b$10$mockHashedPassword',
      name: 'Administrador',
      role: 'admin' as const
    },
    'professor@escola.com': {
      id: '2',
      email: 'professor@escola.com',
      password: '$2b$10$mockHashedPassword',
      name: 'Professor Teste',
      role: 'professor' as const
    },
    'aluno@escola.com': {
      id: '3',
      email: 'aluno@escola.com',
      password: '$2b$10$mockHashedPassword',
      name: 'Aluno Teste',
      role: 'aluno' as const
    },
    // Keeping the old ones for compatibility
    'admin@test.com': {
      id: '4',
      email: 'admin@test.com',
      password: '$2b$10$mockHashedPassword',
      name: 'Administrador',
      role: 'admin' as const
    },
    'professor@test.com': {
      id: '5',
      email: 'professor@test.com',
      password: '$2b$10$mockHashedPassword',
      name: 'Professor Teste',
      role: 'professor' as const
    },
    'aluno@test.com': {
      id: '6',
      email: 'aluno@test.com',
      password: '$2b$10$mockHashedPassword',
      name: 'Aluno Teste',
      role: 'aluno' as const
    }
  };

  const foundUser = mockUsers[email as keyof typeof mockUsers] || null;
  return foundUser;
}

export async function findQRCode(codigo: string) {
  // Mock QR code data
  return {
    id: '1',
    codigo,
    materia_id: '1',
    turma_id: '1',
    professor_id: '1',
    data_aula: new Date().toISOString(),
    ativo: 1
  };
}

export async function createQRCode(data: any) {
  console.log('Mock: Creating QR code', data);
  return { id: 'mock-qr-id', changes: 1 };
}

export async function createPresenca(data: any) {
  console.log('Mock: Creating presence', data);
  return { id: 'mock-presence-id', changes: 1 };
}

export async function createMateria(data: any) {
  console.log('Mock: Creating subject', data);
  return { id: 'mock-subject-id', changes: 1 };
}

export async function createTurma(data: any) {
  console.log('Mock: Creating class', data);
  return { id: 'mock-class-id', changes: 1 };
}

export async function createNota(data: any) {
  console.log('Mock: Creating grade', data);
  return { id: 'mock-grade-id', changes: 1 };
}

export async function getAllUsers() {
  console.log('Mock: Getting all users');
  return [
    {
      id: '1',
      email: 'admin@test.com',
      name: 'Administrador',
      role: 'admin'
    },
    {
      id: '2',
      email: 'professor@test.com',
      name: 'Professor Teste',
      role: 'professor'
    },
    {
      id: '3',
      email: 'aluno@test.com',
      name: 'Aluno Teste',
      role: 'aluno'
    }
  ];
}

export async function getAllMaterias() {
  console.log('Mock: Getting all subjects');
  return [
    {
      id: '1',
      nome: 'Matemática',
      codigo: 'MAT001',
      professor_id: '2'
    }
  ];
}

export async function getAllTurmas() {
  console.log('Mock: Getting all classes');
  return [
    {
      id: '1',
      nome: 'Turma A',
      semestre: '2024.1',
      materia_id: '1'
    }
  ];
}

export async function getAllPresencas() {
  console.log('Mock: Getting all attendances');
  return [];
}

export async function getAllNotas() {
  console.log('Mock: Getting all grades');
  return [];
}

export async function deleteUser(id: string) {
  console.log('Mock: Deleting user', id);
  return { changes: 1 };
}

export async function deleteMateria(id: string) {
  console.log('Mock: Deleting subject', id);
  return { changes: 1 };
}

export async function deleteTurma(id: string) {
  console.log('Mock: Deleting class', id);
  return { changes: 1 };
}
