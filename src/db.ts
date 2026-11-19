import * as SQLite from "expo-sqlite";
import { Ocorrencia, TipoOcorrencia } from "./types";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function abrir(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync("alertaenchente.db");
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS ocorrencias (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tipo TEXT NOT NULL,
          local TEXT NOT NULL,
          descricao TEXT NOT NULL DEFAULT '',
          criado_em TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS preferencias (
          chave TEXT PRIMARY KEY NOT NULL,
          valor TEXT NOT NULL
        );
      `);
      return db;
    })();
  }
  return dbPromise;
}

export async function salvarOcorrencia(tipo: TipoOcorrencia, local: string, descricao: string): Promise<void> {
  const db = await abrir();
  await db.runAsync(
    "INSERT INTO ocorrencias (tipo, local, descricao, criado_em) VALUES (?, ?, ?, ?)",
    tipo,
    local.trim(),
    descricao.trim(),
    new Date().toISOString()
  );
}

export async function listarOcorrencias(): Promise<Ocorrencia[]> {
  const db = await abrir();
  const linhas = await db.getAllAsync<{ id: number; tipo: TipoOcorrencia; local: string; descricao: string; criado_em: string }>(
    "SELECT id, tipo, local, descricao, criado_em FROM ocorrencias ORDER BY id DESC"
  );
  return linhas.map((l) => ({ id: l.id, tipo: l.tipo, local: l.local, descricao: l.descricao, criadoEm: l.criado_em }));
}

export async function apagarOcorrencia(id: number): Promise<void> {
  const db = await abrir();
  await db.runAsync("DELETE FROM ocorrencias WHERE id = ?", id);
}

export async function lerPreferencia(chave: string): Promise<string | null> {
  const db = await abrir();
  const linha = await db.getFirstAsync<{ valor: string }>("SELECT valor FROM preferencias WHERE chave = ?", chave);
  return linha ? linha.valor : null;
}

export async function gravarPreferencia(chave: string, valor: string): Promise<void> {
  const db = await abrir();
  await db.runAsync("INSERT OR REPLACE INTO preferencias (chave, valor) VALUES (?, ?)", chave, valor);
}
