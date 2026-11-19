import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { buscarRegiao } from "../../src/api";
import { Botao } from "../../src/components/Botao";
import { Farol } from "../../src/components/Farol";
import { calcularNivel, formatarHora } from "../../src/risco";
import { cores, fonte } from "../../src/theme";
import { Regiao } from "../../src/types";

const TELEFONES = [
  { nome: "Defesa Civil", numero: "199" },
  { nome: "Bombeiros", numero: "193" },
  { nome: "SAMU", numero: "192" },
];

function ligar(numero: string) {
  Linking.openURL(`tel:${numero}`).catch(() => {
    // aparelho sem telefone (ex.: tablet ou navegador): o número continua visível no botão
  });
}

export default function DetalheRegiao() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [regiao, setRegiao] = useState<Regiao | undefined | null>(null);

  useEffect(() => {
    buscarRegiao(String(id)).then(setRegiao).catch(() => setRegiao(undefined));
  }, [id]);

  if (regiao === null) {
    return (
      <View style={estilos.centro} accessibilityLiveRegion="polite">
        <ActivityIndicator size="large" color={cores.primaria} />
        <Text style={estilos.texto}>Carregando a região...</Text>
      </View>
    );
  }
  if (!regiao) {
    return (
      <View style={estilos.centro}>
        <Stack.Screen options={{ title: "Região" }} />
        <Text style={estilos.texto} accessibilityRole="alert">Não encontramos essa região. Volte e escolha outra na aba Risco.</Text>
      </View>
    );
  }

  const nivel = calcularNivel(regiao);
  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <Stack.Screen options={{ title: regiao.nome }} />
      <Farol nivel={nivel} grande />
      <View style={estilos.cartao}>
        <Text style={estilos.rotulo}>O que fazer</Text>
        <Text style={estilos.texto}>{regiao.orientacao}</Text>
      </View>
      <View style={estilos.cartao}>
        <Text style={estilos.rotulo}>Níveis do {regiao.corrego}</Text>
        <Text style={estilos.texto}>Agora: {regiao.nivelCm} cm</Text>
        <Text style={estilos.texto}>Atenção a partir de: {regiao.cotaAlertaCm} cm</Text>
        <Text style={estilos.texto}>Perigo a partir de: {regiao.cotaEmergenciaCm} cm</Text>
        <Text style={estilos.suave}>Atualizado em {formatarHora(regiao.atualizadoEm)}</Text>
      </View>
      <View style={estilos.cartao}>
        <Text style={estilos.rotulo}>Telefones úteis · toque para ligar</Text>
        {TELEFONES.map((t) => (
          <Botao
            key={t.numero}
            titulo={`Ligar para ${t.nome}: ${t.numero}`}
            perigo={t.numero === "199"}
            dica={`Abre o discador com o número ${t.numero}`}
            aoPressionar={() => ligar(t.numero)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 16, gap: 14 },
  centro: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16, padding: 24, backgroundColor: cores.fundo },
  cartao: { backgroundColor: cores.cartao, borderRadius: 16, borderWidth: 1, borderColor: cores.borda, padding: 16, gap: 8 },
  rotulo: { fontSize: 14, fontWeight: "700", color: cores.suave, textTransform: "uppercase", letterSpacing: 0.6 },
  texto: { fontSize: fonte.corpo, color: cores.texto, lineHeight: 26 },
  suave: { fontSize: 16, color: cores.suave },
});
