import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { cores } from "../src/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerStyle: { backgroundColor: cores.cartao }, headerTintColor: cores.texto, headerTitleStyle: { fontWeight: "700" } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="regiao/[id]" options={{ title: "Detalhes da região" }} />
      </Stack>
    </>
  );
}
