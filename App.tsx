import { StatusBar } from "expo-status-bar";
import { LogBox, StyleSheet, Text, View } from "react-native";
import { TailwindProvider } from "tailwind-rn";
import utilities from "./tailwind.json";

import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./Navigator";
import { AuthProdider } from "./hooks/useAuth";

LogBox.ignoreAllLogs();

export default function App() {
  return (
    <TailwindProvider utilities={utilities}>
      <NavigationContainer>
        <AuthProdider>
          <Navigator />
        </AuthProdider>
      </NavigationContainer>
    </TailwindProvider>
  );
}
