import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

// Singleton para conexão com banco
let db: Database | null = null;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });
  }
  return db;
}

export async function closeDb() {
  if (db) {
    await db.close();
    db = null;
  }
}

// Initialize database with tables
export async function initDatabase() {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      role TEXT NOT NULL CHECK (role IN ('admin', 'professor', 'aluno')),
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS materias (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      codigo TEXT UNIQUE NOT NULL, 
      professor_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (professor_id) REFERENCES users(id)
        ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS turmas (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      periodo TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS presencas (
      id TEXT PRIMARY KEY,
      aluno_id TEXT NOT NULL,
      materia_id TEXT NOT NULL,
      turma_id TEXT NOT NULL,
      data_aula DATE NOT NULL,
      presente BOOLEAN DEFAULT FALSE,
      qr_code_usado BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (aluno_id) REFERENCES users(id),
      FOREIGN KEY (materia_id) REFERENCES materias(id),
      FOREIGN KEY (turma_id) REFERENCES turmas(id),
      UNIQUE(aluno_id, materia_id, turma_id, data_aula)
    );

    CREATE TABLE IF NOT EXISTS notas (
      id TEXT PRIMARY KEY,
      aluno_id TEXT NOT NULL,
      materia_id TEXT NOT NULL,
      nota DECIMAL(4,2) CHECK (nota >= 0 AND nota <= 10),
      tipo TEXT NOT NULL,
      data_lancamento DATE DEFAULT CURRENT_DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (aluno_id) REFERENCES users(id),
      FOREIGN KEY (materia_id) REFERENCES materias(id)
    );

    CREATE TABLE IF NOT EXISTS qr_codes_presenca (
      id TEXT PRIMARY KEY,
      codigo TEXT UNIQUE NOT NULL,
      professor_id TEXT NOT NULL,
      materia_id TEXT NOT NULL, 
      turma_id TEXT NOT NULL,
      data_aula DATE NOT NULL,
      ativo BOOLEAN DEFAULT TRUE,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (professor_id) REFERENCES users(id),
      FOREIGN KEY (materia_id) REFERENCES materias(id),
      FOREIGN KEY (turma_id) REFERENCES turmas(id)
    );

    CREATE INDEX IF NOT EXISTS idx_presencas_aluno ON presencas(aluno_id);
    CREATE INDEX IF NOT EXISTS idx_presencas_materia ON presencas(materia_id);
    CREATE INDEX IF NOT EXISTS idx_notas_aluno ON notas(aluno_id);
    CREATE INDEX IF NOT EXISTS idx_notas_materia ON notas(materia_id);
  `);
}
