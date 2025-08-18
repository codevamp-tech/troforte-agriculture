import Vapi from "@vapi-ai/react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  NativeModules,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface VapiWidgetProps {
  apiKey: string;
  assistantId: string;
}

const VapiWidget: React.FC<VapiWidgetProps> = ({ apiKey, assistantId }) => {
  const [vapi] = useState(() => new Vapi(apiKey));
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCallUI, setShowCallUI] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [micGranted, setMicGranted] = useState(false);

  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // New ref for retry timeout

  // Timer effect
  useEffect(() => {
    if (isConnected) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setCallDuration(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isConnected]); 

  // Request mic permission on mount
  useEffect(() => {
    const askPermission = async () => {
      if (Platform.OS === "android") {
        const perms = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];

        // Only push FOREGROUND_SERVICE if the constant exists on this Android version
        if (PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE) {
          perms.push(PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE);
        }

        const granted = await PermissionsAndroid.requestMultiple(perms);

        setMicGranted(
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
            PermissionsAndroid.RESULTS.GRANTED &&
            (!PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE ||
              granted[PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE] ===
                PermissionsAndroid.RESULTS.GRANTED)
        );
      } else {
        setMicGranted(true);
      }
    };
    askPermission();
  }, []);

  // Vapi event listeners
  useEffect(() => {
    vapi.on("call-start", () => {
      setIsConnecting(false);
      setIsConnected(true);
    });

    vapi.on("call-end", () => {
      setIsConnected(false);
      setIsSpeaking(false);
      setShowCallUI(false);
      setIsConnecting(false);

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Clear retry timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    });

    vapi.on("call-start-failed", (err) => {
      console.log("Call failed to start:", err);
      setIsConnecting(false);
      
      // Clear retry timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    });

    vapi.on("speech-start", () => setIsSpeaking(true));
    vapi.on("speech-end", () => setIsSpeaking(false));

    vapi.on("error", (error: any) => {
      console.log("Vapi error:", error);
    });

    return () => {
      vapi.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current); // Cleanup retry timeout
    };
  }, [vapi]);

  const startCall = async () => {
    if (!micGranted) {
      console.log("Microphone permission denied!");
      return;
    }

    setShowCallUI(true);
    setIsConnecting(true);

    // Clear any existing retry timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Setup retry timeout
    timeoutRef.current = setTimeout(() => {
      // Only retry if still connecting
      if (isConnecting) {
        console.log("Retrying Vapi connection...");
        vapi.start(assistantId).catch(err => {
          console.log("Retry failed:", err);
          setIsConnecting(false);
        });
      }
    }, 8000);

    // Start initial call attempt
    vapi.start(assistantId).catch(err => {
      console.log("Initial call failed:", err);
      setIsConnecting(false);
      
      // Clear retry timeout on immediate failure
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    });
  };

  const endCall = () => {
    // Clear retry timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Stop foreground service if available
    if (
      Platform.OS === "android" &&
      NativeModules.DailyOngoingMeetingForegroundService &&
      typeof NativeModules.DailyOngoingMeetingForegroundService.stop === "function"
    ) {
      try {
        NativeModules.DailyOngoingMeetingForegroundService.stop();
      } catch (err) {
        console.warn("Error stopping foreground service:", err);
      }
    }

    vapi.stop();
    setShowCallUI(false);
  };

  // Format mm:ss
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <View style={styles.wrapper}>
      {!showCallUI ? (
        <TouchableOpacity style={styles.startButton} onPress={startCall}>
          <Text style={styles.startButtonText}>🎤 Talk to Assistant</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.callBox}>
          {isConnecting && (
            <>
              <ActivityIndicator size="large" color="#12A594" />
              <Text style={styles.connectingText}>
                Connecting to Assistant...
              </Text>
            </>
          )}

          {!isConnecting && (
            <>
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
              <Text style={styles.timerText}>{formatTime(callDuration)}</Text>
            </>
          )}

          <TouchableOpacity style={styles.endButton} onPress={endCall}>
            <Text style={styles.endButtonText}>End Call</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
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
    borderColor: "#e1e5e9",
    borderWidth: 1,
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
    marginBottom: 8,
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
  timerText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#444",
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
});

export default VapiWidget;