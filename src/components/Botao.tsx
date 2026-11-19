import { Pressable, StyleSheet, Text } from "react-native";
import { cores, fonte } from "../theme";

type Props = { titulo: string; aoPressionar: () => void; dica?: string; perigo?: boolean; desabilitado?: boolean };

/** Botão grande (mínimo 56 px de altura) para facilitar o toque. */
export function Botao({ titulo, aoPressionar, dica, perigo, desabilitado }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityHint={dica}
      accessibilityState={{ disabled: !!desabilitado }}
      disabled={desabilitado}
      onPress={aoPressionar}
      style={({ pressed }) => [estilos.botao, perigo && estilos.perigo, desabilitado && estilos.off, pressed && { opacity: 0.8 }]}
    >
      <Text style={estilos.texto}>{titulo}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: { minHeight: 56, borderRadius: 14, backgroundColor: cores.primaria, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  perigo: { backgroundColor: cores.vermelho },
  off: { backgroundColor: "#8A90A6" },
  texto: { color: cores.primariaTexto, fontSize: fonte.corpo, fontWeight: "700" },
});
