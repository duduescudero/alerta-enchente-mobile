import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Botao } from "../../src/components/Botao";
import { apagarOcorrencia, listarOcorrencias } from "../../src/db";
import { formatarHora } from "../../src/risco";
import { cores, fonte } from "../../src/theme";
import { Ocorrencia, TIPOS } from "../../src/types";

export default function Historico() {
  const [itens, setItens] = useState<Ocorrencia[]>([]);
  const [confirmar, setConfirmar] = useState<number | null>(null);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    try {
      setItens(await listarOcorrencias());
      setErro("");
    } catch {
      setErro("Não conseguimos abrir seus registros agora. Tente de novo.");
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function apagar(id: number) {
    try {
      await apagarOcorrencia(id);
      setConfirmar(null);
      await carregar();
    } catch {
      setErro("Não foi possível apagar. Tente de novo.");
    }
  }

  return (
    <FlatList
      style={estilos.tela}
      contentContainerStyle={estilos.conteudo}
      data={itens}
      keyExtractor={(i) => String(i.id)}
      ListHeaderComponent={
        erro ? <Text accessibilityRole="alert" accessibilityLiveRegion="assertive" style={estilos.erro}>{erro}</Text> : undefined
      }
      ListEmptyComponent={
        <Text style={estilos.vazio}>Você ainda não registrou nenhum problema. Use a aba Registrar para avisar.</Text>
      }
      renderItem={({ item }) => (
        <View style={estilos.cartao} accessible={false}>
          <Text style={estilos.tipo}>{TIPOS.find((t) => t.valor === item.tipo)?.rotulo ?? item.tipo}</Text>
          <Text style={estilos.texto}>{item.local}</Text>
          {item.descricao !== "" && <Text style={estilos.suave}>{item.descricao}</Text>}
          <Text style={estilos.suave}>Registrado em {formatarHora(item.criadoEm)}</Text>
          {confirmar === item.id ? (
            <View style={{ gap: 8 }}>
              <Text style={estilos.texto}>Apagar este registro?</Text>
              <Botao titulo="Sim, apagar" perigo aoPressionar={() => apagar(item.id)} />
              <Botao titulo="Cancelar" aoPressionar={() => setConfirmar(null)} />
            </View>
          ) : (
            <Botao titulo="Apagar" perigo aoPressionar={() => setConfirmar(item.id)} dica={`Apaga o registro: ${item.local}`} />
          )}
        </View>
      )}
    />
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 16, gap: 12 },
  vazio: { fontSize: fonte.corpo, color: cores.suave, lineHeight: 26, padding: 8 },
  erro: { fontSize: fonte.corpo, color: cores.texto, fontWeight: "600", backgroundColor: cores.vermelhoFundo, borderColor: cores.vermelho, borderWidth: 2, borderRadius: 12, padding: 14 },
  cartao: { backgroundColor: cores.cartao, borderRadius: 16, borderWidth: 1, borderColor: cores.borda, padding: 16, gap: 8 },
  tipo: { fontSize: 22, fontWeight: "800", color: cores.texto },
  texto: { fontSize: fonte.corpo, color: cores.texto },
  suave: { fontSize: 16, color: cores.suave },
});
