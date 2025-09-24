import "./global.css"
import { StatusBar, useColorScheme, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import LoginScreenDemo from './src/test/LoginScreenDemo';

export default function App() {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaProvider>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <LoginScreenDemo />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}