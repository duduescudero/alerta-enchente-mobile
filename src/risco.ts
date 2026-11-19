import { Nivel, Regiao } from "./types";

/** Verde: abaixo da cota de alerta. Amarelo: entre alerta e emergência. Vermelho: acima da emergência. */
export function calcularNivel(r: Regiao): Nivel {
  if (r.nivelCm >= r.cotaEmergenciaCm) return "vermelho";
  if (r.nivelCm >= r.cotaAlertaCm) return "amarelo";
  return "verde";
}

export const TEXTO_NIVEL: Record<Nivel, { titulo: string; frase: string }> = {
  verde: { titulo: "Tranquilo", frase: "Sem risco de enchente agora." },
  amarelo: { titulo: "Atenção", frase: "O córrego está subindo. Fique atento." },
  vermelho: { titulo: "Perigo", frase: "Risco alto de enchente. Procure um lugar seguro." },
};

export function formatarHora(iso: string): string {
  const d = new Date(iso);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${dia}/${mes} às ${h}:${m}`;
}
