export type Nivel = "verde" | "amarelo" | "vermelho";

export type Regiao = {
  id: string;
  nome: string;
  corrego: string;
  nivelCm: number;
  cotaAlertaCm: number;
  cotaEmergenciaCm: number;
  atualizadoEm: string;
  orientacao: string;
};

export type TipoOcorrencia = "rua_alagada" | "corrego_subindo" | "bueiro_entupido" | "entulho";

export type Ocorrencia = {
  id: number;
  tipo: TipoOcorrencia;
  local: string;
  descricao: string;
  criadoEm: string;
};

export const TIPOS: { valor: TipoOcorrencia; rotulo: string }[] = [
  { valor: "rua_alagada", rotulo: "Rua alagada" },
  { valor: "corrego_subindo", rotulo: "Córrego subindo" },
  { valor: "bueiro_entupido", rotulo: "Bueiro entupido" },
  { valor: "entulho", rotulo: "Lixo ou entulho" },
];
