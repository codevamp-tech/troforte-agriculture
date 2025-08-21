import VapiWidget from "@/components/VapiWidget"
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native"

export default function VoiceAssistantScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A202C" />
      <View style={styles.container}>
        <Text style={styles.title}>AgriBot Voice Assistant</Text>
        <VapiWidget />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1A202C", // Primary Background
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
    backgroundColor: "#1A202C", // Primary Background
  },
  title: {
    fontSize: 28, // Slightly larger for prominence
    fontWeight: "700",
    marginBottom: 30, // Increased margin for better spacing
    color: "#E2E8F0", // Primary Text
    letterSpacing: -0.5, // Consistent with other titles
  },
})
