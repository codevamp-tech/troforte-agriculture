"use client";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("http://192.168.1.17:4000/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log("data", data);
      if (response.ok) {
        // Save entire user object in AsyncStorage

        await AsyncStorage.setItem("userId", data.user.id);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        router.replace("/(auth)/onboarding");
        console.log("User saved to storage:", data.user);
      } else {
        console.error("Signup failed:", data.error);
      }

    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.formContainer}>
          <ThemedText type="title" style={styles.title}>
            Create Account
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Join the farming community
          </ThemedText>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Email Address</ThemedText>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Password</ThemedText>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              placeholderTextColor="#6B7280"
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Confirm Password</ThemedText>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              placeholderTextColor="#6B7280"
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[
              styles.registerButton,
              loading && styles.registerButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <ThemedText style={styles.registerButtonText}>
                Create Account
              </ThemedText>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/(auth)/login")}
          >
            <ThemedText type="link" style={styles.loginButtonText}>
              Already have an account? Sign In
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
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
  registerButton: {
    backgroundColor: "#00D084",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loginButton: {
    alignItems: "center",
    padding: 8,
  },
  loginButtonText: {
    textAlign: "center",
  },
});
