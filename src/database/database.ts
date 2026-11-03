import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'tasks.db';
let database: SQLite.SQLiteDatabase | null = null;

// Retorna a conexão com o banco, criando-a na primeira chamada (Singleton)
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database !== null) {
    return database;
  }
  database = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await runMigrations(database);
  return database;
}

// Cria as tabelas necessárias se ainda não existirem
async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tasks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      description TEXT,
      completed   INTEGER NOT NULL DEFAULT 0,
      createdAt   TEXT    NOT NULL
    );

    -- Tabela de perfil do usuário (registro único com id fixo = 1)
    CREATE TABLE IF NOT EXISTS profile (
      id       INTEGER PRIMARY KEY,
      name     TEXT    NOT NULL DEFAULT '',
      email    TEXT    NOT NULL DEFAULT '',
      photoUri TEXT
    );
  `);
}