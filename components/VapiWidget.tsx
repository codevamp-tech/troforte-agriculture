import { CALL_STATUS, useVapi } from "@/hooks/useVapi";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const VoiceAssistant: React.FC = () => {
  const { callStatus, startCall, stop, isSpeaking, micGranted, errorMsg } = useVapi();

  if (!micGranted) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.permissionText}>
          🎤 Please enable microphone access to use the assistant.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* 🔔 Show error message if exists */}
      {errorMsg && (
        <Text style={styles.errorText}>{errorMsg}</Text>
      )}

      {callStatus === CALL_STATUS.INACTIVE && (
        <TouchableOpacity style={styles.startButton} onPress={startCall}>
          <Text style={styles.startButtonText}>🎤 Talk to Assistant</Text>
        </TouchableOpacity>
      )}

      {callStatus === CALL_STATUS.CONNECTING && (
        <View style={styles.callBox}>
          <ActivityIndicator size="large" color="#12A594" />
          <Text style={styles.connectingText}>Connecting to Assistant...</Text>
        </View>
      )}

      {callStatus === CALL_STATUS.ACTIVE && (
        <View style={styles.callBox}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isSpeaking ? "#ff4444" : "#12A594" },
              ]}
            />
            <Text style={styles.statusText}>
              {isSpeaking ? "Assistant Speaking..." : "Connected"}
            </Text>
          </View>
          <TouchableOpacity style={styles.endButton} onPress={stop}>
            <Text style={styles.endButtonText}>End Call</Text>
          </TouchableOpacity>
        </View>
      )}

      {callStatus === CALL_STATUS.FINISHED && (
        <TouchableOpacity style={styles.startButton} onPress={startCall}>
          <Text style={styles.startButtonText}>🔄 Start Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 40,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  startButton: {
    backgroundColor: "#12A594",
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 30,
    elevation: 4,
  },
  startButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  callBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "80%",
    padding: 20,
    alignItems: "center",
    elevation: 4,
  },
  connectingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#444",
    textAlign: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontWeight: "bold",
    color: "#333",
  },
  endButton: {
    backgroundColor: "#ff4444",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 10,
  },
  endButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  permissionText: {
    color: "#e63946",
    textAlign: "center",
    padding: 20,
    fontWeight: "600",
  },
});

export default VoiceAssistant;
