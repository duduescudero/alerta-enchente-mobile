import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Botao } from "../../src/components/Botao";
import { salvarOcorrencia } from "../../src/db";
import { cores, fonte } from "../../src/theme";
import { TIPOS, TipoOcorrencia } from "../../src/types";

type Aviso = { texto: string; tipo: "erro" | "sucesso" } | null;

export default function Registrar() {
  const router = useRouter();
  const [tipo, setTipo] = useState<TipoOcorrencia | null>(null);
  const [local, setLocal] = useState("");
  const [descricao, setDescricao] = useState("");
  const [aviso, setAviso] = useState<Aviso>(null);
  const [salvando, setSalvando] = useState(false);

  // Ao voltar para esta aba, some o aviso antigo (não fica um "Pronto!" de outra vez).
  useFocusEffect(useCallback(() => () => setAviso(null), []));

  function escolherTipo(valor: TipoOcorrencia) {
    setTipo(valor);
    if (aviso?.tipo === "erro") setAviso(null);
  }

  async function enviar() {
    // O botão fica sempre ativo: assim quem usa leitor de tela ouve o que falta preencher.
    if (!tipo) {
      setAviso({ tipo: "erro", texto: "Escolha o tipo de problema no passo 1." });
      return;
    }
    if (local.trim().length < 3) {
      setAviso({ tipo: "erro", texto: "Diga onde é no passo 2 (rua ou ponto de referência)." });
      return;
    }
    setSalvando(true);
    try {
      await salvarOcorrencia(tipo, local, descricao);
      setTipo(null);
      setLocal("");
      setDescricao("");
      setAviso({ tipo: "sucesso", texto: "Pronto! Seu aviso foi salvo neste celular." });
    } catch {
      setAviso({ tipo: "erro", texto: "Não foi possível salvar. Tente de novo." });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={estilos.rotulo}>1. Qual é o problema?</Text>
        {TIPOS.map((t) => (
          <Pressable
            key={t.valor}
            accessibilityRole="radio"
            accessibilityLabel={t.rotulo}
            accessibilityState={{ selected: tipo === t.valor }}
            onPress={() => escolherTipo(t.valor)}
            style={[estilos.opcao, tipo === t.valor && estilos.opcaoSel]}
          >
            <View style={[estilos.radio, tipo === t.valor && estilos.radioSel]} />
            <Text style={estilos.textoOpcao}>{t.rotulo}</Text>
          </Pressable>
        ))}

        <Text style={estilos.rotulo}>2. Onde é?</Text>
        <TextInput
          style={estilos.campo}
          value={local}
          onChangeText={setLocal}
          placeholder="Ex.: Rua das Flores, perto da ponte"
          placeholderTextColor="#6B7186"
          accessibilityLabel="Local do problema"
          returnKeyType="next"
        />

        <Text style={estilos.rotulo}>3. Quer contar mais? (opcional)</Text>
        <TextInput
          style={[estilos.campo, { minHeight: 100, textAlignVertical: "top" }]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Ex.: a água já chegou na calçada"
          placeholderTextColor="#6B7186"
          multiline
          accessibilityLabel="Descrição do problema, opcional"
        />

        {aviso && (
          <View
            accessibilityLiveRegion={aviso.tipo === "erro" ? "assertive" : "polite"}
            accessibilityRole={aviso.tipo === "erro" ? "alert" : "text"}
            style={[estilos.aviso, aviso.tipo === "erro" ? estilos.avisoErro : estilos.avisoOk]}
          >
            <Text style={estilos.mensagem}>{aviso.texto}</Text>
          </View>
        )}
        <Botao titulo={salvando ? "Salvando..." : "Salvar aviso"} aoPressionar={enviar} desabilitado={salvando} dica="Guarda o aviso neste celular" />
        {aviso?.tipo === "sucesso" && (
          <Botao titulo="Ver meus registros" aoPressionar={() => router.push("/historico")} dica="Abre a aba Histórico" />
        )}
        <Text style={estilos.suave}>Em emergência, ligue 199 (Defesa Civil) ou 193 (Bombeiros).</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 16, gap: 12 },
  rotulo: { fontSize: 20, fontWeight: "800", color: cores.texto, marginTop: 8 },
  opcao: { minHeight: 56, flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: cores.cartao, borderRadius: 12, borderWidth: 1, borderColor: cores.borda, paddingHorizontal: 16 },
  opcaoSel: { borderColor: cores.primaria, borderWidth: 3 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 3, borderColor: cores.suave },
  radioSel: { borderColor: cores.primaria, backgroundColor: cores.primaria },
  textoOpcao: { fontSize: fonte.corpo, color: cores.texto, fontWeight: "600" },
  campo: { minHeight: 56, backgroundColor: cores.cartao, borderRadius: 12, borderWidth: 1, borderColor: cores.borda, paddingHorizontal: 16, paddingVertical: 12, fontSize: fonte.corpo, color: cores.texto },
  mensagem: { fontSize: fonte.corpo, color: cores.texto, fontWeight: "600" },
  aviso: { borderRadius: 12, borderWidth: 2, padding: 14 },
  avisoErro: { backgroundColor: cores.vermelhoFundo, borderColor: cores.vermelho },
  avisoOk: { backgroundColor: cores.verdeFundo, borderColor: cores.verde },
  suave: { fontSize: 16, color: cores.suave },
});
