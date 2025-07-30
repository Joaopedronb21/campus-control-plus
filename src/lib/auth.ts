import { getDb } from './db/sqlite';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export async function authenticateUser(email: string, password: string) {
  const db = await getDb();
  
  const user = await db.get(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error('Senha incorreta');
  }

  // Remover senha antes de retornar
  delete user.password;
  return user;
}

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'professor' | 'aluno';
}) {
  const db = await getDb();

  // Verificar email único
  const exists = await db.get(
    'SELECT id FROM users WHERE email = ?',
    [data.email]
  );

  if (exists) {
    throw new Error('Email já cadastrado');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await db.run(`
    INSERT INTO users (id, email, password, name, role)
    VALUES (?, ?, ?, ?, ?)
  `, [uuid(), data.email, hashedPassword, data.name, data.role]);
}
