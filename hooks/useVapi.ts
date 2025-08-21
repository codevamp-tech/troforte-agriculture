import Vapi from "@vapi-ai/react-native";
import { useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

export enum CALL_STATUS {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
  ERROR = "ERROR",
}

// 🔑 Hardcoded keys
const apiKey = "dedd80d6-9753-4280-8691-9cf56ac2cb4a";
const assistantId = "2fb5b2a4-7dcf-4682-a4eb-f5c362e407f6";

const vapi = new Vapi(apiKey);

export function useVapi() {
  const [callStatus, setCallStatus] = useState<CALL_STATUS>(CALL_STATUS.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micGranted, setMicGranted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 🎤 Ask mic permissions on mount
  useEffect(() => {
    const askPermission = async () => {
      if (Platform.OS === "android") {
        const perms = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];
        if (PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE) {
          perms.push(PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE);
        }

        const granted = await PermissionsAndroid.requestMultiple(perms);
        const micOK =
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          (!PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE ||
            granted[PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE] ===
              PermissionsAndroid.RESULTS.GRANTED);

        setMicGranted(micOK);
      } else {
        setMicGranted(true);
      }
    };

    askPermission();
  }, []);

  // 🔔 Event listeners
  useEffect(() => {
    vapi.on("call-start", () => {
      setErrorMsg(null);
      setCallStatus(CALL_STATUS.ACTIVE);
    });

    vapi.on("call-end", () => setCallStatus(CALL_STATUS.FINISHED));

    vapi.on("error", () => {
      setErrorMsg("Free trial ended, try again tomorrow");
      setCallStatus(CALL_STATUS.ERROR);
    });

    vapi.on("speech-start", () => setIsSpeaking(true));
    vapi.on("speech-end", () => setIsSpeaking(false));

    return () => {
      vapi.stop();
    };
  }, []);

  // 🚀 Start a call
  const startCall = async () => {
    if (!micGranted) {
      console.log("❌ Microphone permission denied");
      return;
    }

    setCallStatus(CALL_STATUS.CONNECTING);
    setErrorMsg(null);

    try {
      await vapi.start(assistantId);
    } catch (err) {
      console.error("Failed to start call:", err);
      setErrorMsg("Free trial ended, try again tomorrow");
      setCallStatus(CALL_STATUS.ERROR);
    }
  };

  // 🛑 Stop a call
  const stop = () => {
    setCallStatus(CALL_STATUS.FINISHED);
    vapi.stop();
  };

  // 🔇 Toggle mute
  const setMuted = (value: boolean) => {
    vapi.setMuted(value);
  };
  const isMuted = vapi.isMuted;

  return {
    callStatus,
    startCall,
    stop,
    setMuted,
    isMuted,
    isSpeaking,
    micGranted,
    errorMsg, // 👈 always the same message on any error
  };
}
