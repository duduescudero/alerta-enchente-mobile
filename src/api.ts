import regioesMock from "./mock/regioes.json";
import { Regiao } from "./types";

/**
 * Camada de dados do app.
 * - Se EXPO_PUBLIC_API_URL estiver definida, busca GET {url}/regioes.
 * - Se não estiver (ou se a rede falhar, demorar mais de 6 s ou devolver dados inválidos),
 *   usa o mock local, assim o app funciona offline.
 */
const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "");
const TIMEOUT_MS = 6000; // sem isso, uma API fora do ar deixaria a tela carregando para sempre

export type Resultado = { regioes: Regiao[]; origem: "api" | "mock" };

/** Confere se a resposta da API tem o formato esperado antes de usar. */
function ehListaDeRegioes(dados: unknown): dados is Regiao[] {
  return (
    Array.isArray(dados) &&
    dados.length > 0 &&
    dados.every(
      (r) =>
        r && typeof r.id === "string" && typeof r.nome === "string" &&
        typeof r.nivelCm === "number" && typeof r.cotaAlertaCm === "number" && typeof r.cotaEmergenciaCm === "number"
    )
  );
}

export async function buscarRegioes(): Promise<Resultado> {
  if (API_URL) {
    const controle = new AbortController();
    const relogio = setTimeout(() => controle.abort(), TIMEOUT_MS);
    try {
      const resp = await fetch(`${API_URL}/regioes`, { signal: controle.signal });
      if (resp.ok) {
        const dados: unknown = await resp.json();
        if (ehListaDeRegioes(dados)) return { regioes: dados, origem: "api" };
      }
    } catch {
      // sem rede, tempo esgotado ou resposta inválida: cai no mock
    } finally {
      clearTimeout(relogio);
    }
  }
  await new Promise((ok) => setTimeout(ok, 400)); // simula o tempo de uma chamada de rede
  return { regioes: regioesMock as Regiao[], origem: "mock" };
}

export async function buscarRegiao(id: string): Promise<Regiao | undefined> {
  const { regioes } = await buscarRegioes();
  return regioes.find((r) => r.id === id);
}
