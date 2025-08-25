"use client"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"
import { useState } from "react"
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native"

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
  try {
    const res = await fetch("http://192.168.1.17:4000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
        console.log("data", data.user.farmerId)
      await AsyncStorage.multiSet([
        ['userId', data.user.id],
        ['farmerId', data.user.farmerId || ''], 
        ['userData', JSON.stringify(data.user)]
      ]);
      router.replace("/(tabs)")
      setIsLoading(false)
    } else {
      console.error("Login failed:", data.error);
    }
  } catch (err) {
    console.error(err);
  } finally{
    setIsLoading(false)
  }
};

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.formContainer}>
        <ThemedText type="title" style={styles.title}>
          Welcome Back
        </ThemedText>
        <ThemedText style={styles.subtitle}>Sign in to your account</ThemedText>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#6B7280"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Password</ThemedText>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#6B7280"
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <ThemedText style={styles.loginButtonText}>{isLoading ? "Signing In..." : "Sign In"}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton} onPress={() => router.push("/(auth)/register")}>
          <ThemedText type="link" style={styles.registerButtonText}>
            Don't have an account? Sign Up
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  formContainer: {
    backgroundColor: "rgba(0, 208, 132, 0.05)",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(0, 208, 132, 0.2)",
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    color: "#00D084",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
    opacity: 0.8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
    color: "#00D084",
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(0, 208, 132, 0.3)",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "#FFFFFF",
  },
  loginButton: {
    backgroundColor: "#00D084",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  registerButton: {
    alignItems: "center",
    padding: 8,
  },
  registerButtonText: {
    textAlign: "center",
  },
})
