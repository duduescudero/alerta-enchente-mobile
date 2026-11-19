import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { buscarRegioes } from "../../src/api";
import { Botao } from "../../src/components/Botao";
import { Farol } from "../../src/components/Farol";
import { gravarPreferencia, lerPreferencia } from "../../src/db";
import { TEXTO_NIVEL, calcularNivel, formatarHora } from "../../src/risco";
import { cores, fonte } from "../../src/theme";
import { Regiao } from "../../src/types";

export default function Risco() {
  const router = useRouter();
  const [regioes, setRegioes] = useState<Regiao[]>([]);
  const [minha, setMinha] = useState<string | null>(null);
  const [origem, setOrigem] = useState<"api" | "mock">("mock");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(false);
    try {
      const [res, pref] = await Promise.all([buscarRegioes(), lerPreferencia("minha_regiao")]);
      setRegioes(res.regioes);
      setOrigem(res.origem);
      setMinha(pref ?? res.regioes[0]?.id ?? null);
    } catch {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function escolher(id: string) {
    setMinha(id);
    await gravarPreferencia("minha_regiao", id);
  }

  if (carregando && regioes.length === 0) {
    return (
      <View style={estilos.centro} accessibilityLiveRegion="polite">
        <ActivityIndicator size="large" color={cores.primaria} />
        <Text style={estilos.texto}>Buscando o nível dos córregos...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={estilos.centro}>
        <Text style={estilos.texto}>Não conseguimos buscar as informações agora.</Text>
        <Botao titulo="Tentar de novo" aoPressionar={carregar} />
      </View>
    );
  }

  const atual = regioes.find((r) => r.id === minha) ?? regioes[0];
  if (!atual) return null;
  const nivel = calcularNivel(atual);

  return (
    <ScrollView
      style={estilos.tela}
      contentContainerStyle={estilos.conteudo}
      refreshControl={<RefreshControl refreshing={carregando} onRefresh={carregar} />}
    >
      <Text style={estilos.rotulo}>Minha região</Text>
      <Text accessibilityRole="header" style={estilos.titulo}>{atual.nome}</Text>
      <Farol nivel={nivel} grande />

      <View style={estilos.cartao}>
        <Text style={estilos.rotulo}>O que fazer agora</Text>
        <Text style={estilos.texto}>{atual.orientacao}</Text>
        <Text style={estilos.suave}>Nível do {atual.corrego}: {atual.nivelCm} cm</Text>
        <Text style={estilos.suave}>Atualizado em {formatarHora(atual.atualizadoEm)}</Text>
      </View>

      <Botao titulo="Ver detalhes" dica="Abre a tela com os níveis e o que fazer" aoPressionar={() => router.push(`/regiao/${atual.id}`)} />

      <Text accessibilityRole="header" style={estilos.secao}>Trocar de região</Text>
      {regioes.map((r) => {
        const n = calcularNivel(r);
        const selecionada = r.id === atual.id;
        return (
          <Pressable
            key={r.id}
            accessibilityRole="radio"
            accessibilityState={{ selected: selecionada }}
            accessibilityLabel={`${r.nome}: ${TEXTO_NIVEL[n].titulo}, risco ${n}`}
            accessibilityHint="Toque para acompanhar esta região"
            onPress={() => escolher(r.id)}
            style={[estilos.linha, selecionada && estilos.linhaSel]}
          >
            <Text style={estilos.nomeLinha}>{r.nome}</Text>
            <Text style={[estilos.nivelLinha, { color: n === "verde" ? cores.verde : n === "amarelo" ? cores.amarelo : cores.vermelho }]}>
              {n.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
      <Text style={estilos.suave}>
        {origem === "api" ? "Dados da API AlertaEnchente." : "Dados de demonstração (sem conexão com a API)."} Puxe a tela para baixo para atualizar.
      </Text>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 16, gap: 14 },
  centro: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16, padding: 24, backgroundColor: cores.fundo },
  titulo: { fontSize: fonte.titulo, fontWeight: "800", color: cores.texto },
  rotulo: { fontSize: 14, fontWeight: "700", color: cores.suave, textTransform: "uppercase", letterSpacing: 0.6 },
  texto: { fontSize: fonte.corpo, color: cores.texto, lineHeight: 26 },
  suave: { fontSize: 16, color: cores.suave },
  cartao: { backgroundColor: cores.cartao, borderRadius: 16, borderWidth: 1, borderColor: cores.borda, padding: 16, gap: 8 },
  secao: { fontSize: 22, fontWeight: "800", color: cores.texto, marginTop: 8 },
  linha: { minHeight: 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: cores.cartao, borderRadius: 12, borderWidth: 1, borderColor: cores.borda, paddingHorizontal: 16 },
  linhaSel: { borderColor: cores.primaria, borderWidth: 3 },
  nomeLinha: { fontSize: fonte.corpo, color: cores.texto, fontWeight: "600" },
  nivelLinha: { fontSize: 16, fontWeight: "800" },
});
