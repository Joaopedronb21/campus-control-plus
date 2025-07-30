import { getDb } from './sqlite';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'professor' | 'aluno';
}) {
  const db = await getDb();
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  return db.run(`
    INSERT INTO users (id, email, password, name, role) 
    VALUES (?, ?, ?, ?, ?)
  `, [uuid(), data.email, hashedPassword, data.name, data.role]);
}

export async function findUserByEmail(email: string) {
  const db = await getDb();
  return db.get('SELECT * FROM users WHERE email = ?', [email]);
}

export async function findQRCode(codigo: string) {
  const db = await getDb();
  return db.get(`
    SELECT * FROM qr_codes_presenca 
    WHERE codigo = ? 
      AND ativo = 1 
      AND expires_at > datetime('now')
  `, [codigo]);
}

export async function createPresenca(data: {
  aluno_id: string;
  materia_id: string;
  turma_id: string;
  data_aula: string;
  presente: boolean;
}) {
  const db = await getDb();
  
  // Verifica se já existe presença registrada
  const existing = await db.get(`
    SELECT id FROM presencas 
    WHERE aluno_id = ? 
      AND materia_id = ? 
      AND turma_id = ? 
      AND data_aula = ?
  `, [data.aluno_id, data.materia_id, data.turma_id, data.data_aula]);

  if (existing) {
    throw new Error('Presença já registrada para esta aula');
  }

  return db.run(`
    INSERT INTO presencas (
      aluno_id, materia_id, turma_id, data_aula, presente
    ) VALUES (?, ?, ?, ?, ?)
  `, [
    data.aluno_id,
    data.materia_id, 
    data.turma_id,
    data.data_aula,
    data.presente
  ]);
}

export async function createQRCode({
  professor_id,
  materia_id,
  turma_id,
  data_aula
}) {
  const db = await getDb();
  const codigo = uuid();
  const expires_at = new Date(Date.now() + 30 * 60000); // 30 min

  return db.run(`
    INSERT INTO qr_codes_presenca (
      id, codigo, professor_id, materia_id, turma_id, 
      data_aula, expires_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    uuid(), codigo, professor_id, materia_id,
    turma_id, data_aula, expires_at
  ]);
}
