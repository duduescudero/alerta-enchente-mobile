import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { cores } from "../../src/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: cores.cartao },
        headerTitleStyle: { fontWeight: "700", fontSize: 20 },
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.suave,
        tabBarLabelStyle: { fontSize: 14, fontWeight: "600" },
        tabBarStyle: { height: 68, paddingBottom: 8, paddingTop: 6 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Risco",
          headerTitle: "AlertaEnchente",
          tabBarAccessibilityLabel: "Aba Risco: nível de enchente na sua região",
          tabBarIcon: ({ color, size }) => <Ionicons name="water" size={size + 4} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="registrar"
        options={{
          title: "Registrar",
          headerTitle: "Registrar ocorrência",
          tabBarAccessibilityLabel: "Aba Registrar: avisar sobre um problema",
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size + 4} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="historico"
        options={{
          title: "Histórico",
          headerTitle: "Meus registros",
          tabBarAccessibilityLabel: "Aba Histórico: ocorrências que você registrou",
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size + 4} color={color as string} />,
        }}
      />
    </Tabs>
  );
}
