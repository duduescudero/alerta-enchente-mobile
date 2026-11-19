import { StyleSheet, Text, View } from "react-native";
import { TEXTO_NIVEL } from "../risco";
import { cores, fonte } from "../theme";
import { Nivel } from "../types";

const FUNDO: Record<Nivel, string> = { verde: cores.verdeFundo, amarelo: cores.amareloFundo, vermelho: cores.vermelhoFundo };
const COR: Record<Nivel, string> = { verde: cores.verde, amarelo: cores.amarelo, vermelho: cores.vermelho };

/** O estado vai sempre em TEXTO além da cor, para quem não distingue cores. */
export function Farol({ nivel, grande = false }: { nivel: Nivel; grande?: boolean }) {
  const t = TEXTO_NIVEL[nivel];
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Risco ${nivel}. ${t.titulo}. ${t.frase}`}
      style={[estilos.caixa, { backgroundColor: FUNDO[nivel], borderColor: COR[nivel] }]}
    >
      <View style={[estilos.bolinha, grande && estilos.bolinhaGrande, { backgroundColor: COR[nivel] }]} />
      <View style={estilos.textos}>
        <Text style={[estilos.titulo, { color: COR[nivel] }, grande && { fontSize: fonte.grande }]}>{t.titulo.toUpperCase()}</Text>
        <Text style={estilos.frase}>{t.frase}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: { flexDirection: "row", alignItems: "center", gap: 14, borderWidth: 2, borderRadius: 16, padding: 16 },
  bolinha: { width: 28, height: 28, borderRadius: 14 },
  bolinhaGrande: { width: 44, height: 44, borderRadius: 22 },
  textos: { flex: 1 },
  titulo: { fontSize: fonte.titulo, fontWeight: "800" },
  frase: { fontSize: fonte.corpo, color: cores.texto, marginTop: 2 },
});
