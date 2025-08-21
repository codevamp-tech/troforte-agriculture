
import ChatSidebar from "@/components/ChatSidebar"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useEffect, useRef, useState } from "react"
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import Markdown from "react-native-markdown-display"
import { SafeAreaView } from "react-native-safe-area-context"
import uuid from "react-native-uuid"

const API_BASE_URL = "http://192.168.1.23:4000/api" 

export default function SupportScreen() {
  const [messages, setMessages] = useState<{ role: string; content: string; timestamp?: string }[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)
  const tabBarHeight = useBottomTabBarHeight()

  // Initialize device ID on app start
  useEffect(() => {
    initializeDeviceId()
    initializeChatId()
  }, [])

  // Load chat history when device ID is available
  useEffect(() => {
    if (deviceId) {
      loadChatHistory()
    }
  }, [deviceId])

  const initializeDeviceId = async () => {
    try {
      let storedDeviceId = await AsyncStorage.getItem("deviceId")
      if (!storedDeviceId) {
        storedDeviceId = uuid.v4() as string
        await AsyncStorage.setItem("deviceId", storedDeviceId)
        console.log("Generated new device ID:", storedDeviceId)
      } else {
        console.log("Using existing device ID:", storedDeviceId)
      }
      setDeviceId(storedDeviceId)
    } catch (error) {
      console.error("Error initializing device ID:", error)
      setDeviceId(uuid.v4() as string)
    }
  }

  const initializeChatId = async () => {
    try {
      let storedChatId = await AsyncStorage.getItem("currentChatId")
      if (!storedChatId) {
        storedChatId = uuid.v4() as string
        await AsyncStorage.setItem("currentChatId", storedChatId)
      }
      setCurrentChatId(storedChatId)
      // loadChat(storedChatId);
    } catch (error) {
      console.error("Failed to initialize chatId", error)
    }
  }

  const loadChatHistory = async () => {
    if (!deviceId) return
    try {
      const response = await fetch(`${API_BASE_URL}/history?deviceId=${deviceId}&limit=10`)
      const data = await response.json()
      if (response.ok) {
        setChatHistory(data.chats || [])
      } else {
        console.error("Failed to load chat history:", data.error)
      }
    } catch (error) {
      console.error("Error loading chat history:", error)
    }
  }

  const loadChat = async (chatId: string) => {
    if (!deviceId) return
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/chatById?chatId=${chatId}&deviceId=${deviceId}`)
      const data = await response.json()
      if (response.ok) {
        setMessages(data.messages || [])
        setCurrentChatId(chatId)
        await AsyncStorage.setItem("currentChatId", chatId)
      } else {
        Alert.alert("Error", data.error || "Failed to load chat")
      }
    } catch (error) {
      console.error("Error loading chat:", error)
      Alert.alert("Error", "Failed to load chat")
    } finally {
      setIsLoading(false)
    }
  }

  const startNewChat = async () => {
    const newChatId = uuid.v4() as string
    setMessages([])
    setCurrentChatId(newChatId)
    setInput("")
    await AsyncStorage.setItem("currentChatId", newChatId)
  }

  const handleSubmit = async () => {
    if (!input.trim() || !deviceId) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Empty assistant message to update live
    let botMessage = {
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, botMessage]);

    setIsLoading(true);
    const currentInput = input;
    setInput("");

    try {
      const xhr = new XMLHttpRequest();

      xhr.open("POST", `${API_BASE_URL}/chat`, true);
      xhr.setRequestHeader("Content-Type", "application/json");

      let lastIndex = 0;
      let buffer = "";
      let typingTimer: any = null;
      let inThink = false;
      let receivedChatId = currentChatId;

      // Strip out <think> tags from buffer for display
      const stripThinkTags = (text: string) => {
        let clean = "";
        let i = 0;

        while (i < text.length) {
          if (!inThink && text.slice(i, i + 7) === "<think>") {
            inThink = true;
            i += 7;
            continue;
          }
          if (inThink && text.slice(i, i + 8) === "</think>") {
            inThink = false;
            i += 8;
            continue;
          }
          if (!inThink) {
            clean += text[i];
          }
          i++;
        }
        return clean;
      };

      const pumpTokens = () => {
        if (!buffer) return;

        buffer = stripThinkTags(buffer);
        const match = buffer.match(/^(\s*[\S]{1,4})/);
        if (!match) return;

        const token = match[0];
        buffer = buffer.slice(token.length);

        botMessage.content += token;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...botMessage };
          return updated;
        });
      };

      xhr.onprogress = () => {
        try {
          const newText = xhr.responseText.slice(lastIndex);
          lastIndex = xhr.responseText.length;

          // Split by newlines to handle JSON streaming
          const lines = newText.split("\n");

          for (const line of lines) {
            if (!line.trim()) continue;

            try {
              const parsed = JSON.parse(line);

              if (parsed.type === "metadata") {
                // Set the chat ID from the server response
                receivedChatId = parsed.chatId;
                setCurrentChatId(parsed.chatId);
              } else if (parsed.type === "content") {
                // Add content to buffer for token streaming
                buffer += parsed.data;

                // Start or keep typing timer
                if (!typingTimer) {
                  typingTimer = setInterval(() => {
                    pumpTokens();
                    pumpTokens(); // drain faster
                  }, 25);
                }
              } else if (parsed.type === "complete") {
                // Stream completed
                console.log("Chat completed with ID:", parsed.chatId);
              } else if (parsed.type === "error") {
                console.error("Stream error:", parsed.message);
              }
            } catch (parseError) {
              // If it's not JSON, treat as raw content (fallback)
              buffer += line;
              if (!typingTimer) {
                typingTimer = setInterval(() => {
                  pumpTokens();
                  pumpTokens();
                }, 25);
              }
            }
          }
        } catch (e) {
          console.log("Progress parse error:", e);
        }
      };

      xhr.onreadystatechange = () => {
        if (xhr.readyState === xhr.DONE) {
          // Process any remaining buffer
          buffer = stripThinkTags(buffer);

          if (typingTimer) {
            const finisher = setInterval(() => {
              if (!buffer) {
                clearInterval(finisher);
                clearInterval(typingTimer);
                typingTimer = null;
                setIsLoading(false);
                // Refresh chat history after successful completion
                loadChatHistory();
                return;
              }
              pumpTokens();
            }, 15);
          } else {
            if (buffer) {
              botMessage.content += buffer;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { ...botMessage };
                return updated;
              });
            }
            setIsLoading(false);
            loadChatHistory();
          }

          if (xhr.status < 200 || xhr.status >= 300) {
            console.error("Server error:", xhr.status, xhr.responseText);
            Alert.alert("Error", "Failed to get response from server");
          }
        }
      };

      xhr.onerror = () => {
        console.error("XHR error");
        setMessages((prev) => [
          ...prev.slice(0, -1), // Remove the empty assistant message
          {
            role: "assistant",
            content: "Error: Could not fetch response. Please try again.",
          },
        ]);
        setIsLoading(false);
        setInput(currentInput); // Restore input on error
      };

      // Send request with device ID and current chat ID
      xhr.send(
        JSON.stringify({
          query: currentInput,
          deviceId,
          chatId: currentChatId,
        })
      );
    } catch (error) {
      console.error("Streaming XHR error:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: "Error: Could not fetch response. Please try again.",
        },
      ]);
      setIsLoading(false);
      setInput(currentInput);
    }
  };

  const deleteChat = async (chatId: string) => {
    if (!deviceId) return
    Alert.alert("Delete Chat", "Are you sure you want to delete this chat?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/chat`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ chatId, deviceId }),
            })
            if (response.ok) {
              if (currentChatId === chatId) {
                startNewChat()
              }
              loadChatHistory()
            } else {
              const data = await response.json()
              Alert.alert("Error", data.error || "Failed to delete chat")
            }
          } catch (error) {
            console.error("Error deleting chat:", error)
            Alert.alert("Error", "Failed to delete chat")
          }
        },
      },
    ])
  }

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#010409" }} >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={tabBarHeight}
      >
        <SafeAreaView edges={["top"]} style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => setIsSidebarVisible(true)} style={styles.menuButton}>
                <Text style={styles.menuButtonText}>☰</Text>
              </TouchableOpacity>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Support</Text>
                <Text style={styles.headerSubtitle}>How can we help you today?</Text>
              </View>
            </View>
            <TouchableOpacity onPress={startNewChat} style={styles.newChatButton}>
              <Text style={styles.newChatButtonText}>+ New</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 && (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Text style={styles.emptyStateIconText}>💬</Text>
              </View>
              <Text style={styles.emptyStateText}>Start a conversation by asking a question</Text>
              <Text style={styles.emptyStateSubtext}>I'm here to help with any questions or issues you might have</Text>
              {deviceId && <Text style={styles.deviceIdText}>Device ID: {deviceId.slice(0, 8)}...</Text>}
            </View>
          )}

          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                message.role === "user" ? styles.userMessageContainer : styles.botMessageContainer,
              ]}
            >
              <View style={[styles.messageBubble, message.role === "user" ? styles.userMessage : styles.botMessage]}>
                <Markdown style={markdownStyles}>{message.content}</Markdown>
              </View>
            </View>
          ))}

          {isLoading && (
            <View style={styles.typingIndicator}>
              <View style={styles.typingDots}>
                <View style={[styles.dot, styles.dot1]} />
                <View style={[styles.dot, styles.dot2]} />
                <View style={[styles.dot, styles.dot3]} />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              placeholderTextColor="#6B7280"
              value={input}
              onChangeText={setInput}
              editable={!isLoading && !!deviceId}
              onSubmitEditing={handleSubmit}
              returnKeyType="send"
              multiline
              maxLength={1000}
            />
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading || !input.trim() || !deviceId}
              style={[styles.sendButton, (!input.trim() || isLoading || !deviceId) && styles.sendButtonDisabled]}
            >
              <Text style={styles.sendButtonText}>{isLoading ? "•••" : "→"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ChatSidebar
          isVisible={isSidebarVisible}
          onClose={() => setIsSidebarVisible(false)}
          chatHistory={chatHistory}
          currentChatId={currentChatId}
          onLoadChat={loadChat}
          onDeleteChat={deleteChat}
          onStartNewChat={startNewChat}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const markdownStyles = {
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: "#FFFFFF",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 8,
  },
  strong: {
    fontWeight: "600",
    color: "#FFFFFF",
  },
  code_inline: {
    backgroundColor: "#161B22",
    color: "#E2E8F0",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 14,
    fontFamily: Platform.OS === "ios" ? "SF Mono" : "monospace",
  },
  code_block: {
    backgroundColor: "#161B22",
    color: "#E2E8F0",
    padding: 16,
    borderRadius: 12,
    fontSize: 14,
    fontFamily: Platform.OS === "ios" ? "SF Mono" : "monospace",
    marginVertical: 8,
  },
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#010409",
  },
  header: {
    backgroundColor: "#010409",
    borderBottomWidth: 1,
    borderBottomColor: "#21262D",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    marginRight: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0D1117",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 4,
  },
  menuButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
    letterSpacing: -0.5,
    textShadowColor: "#00D084",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#94A3B8",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
    lineHeight: 22,
  },
  newChatButton: {
    backgroundColor: "#00D084",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: "#00D084",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 8
  },
  newChatButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#010409",
  },
  chatContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#161B22",
    borderWidth: 2,
    borderColor: "#00D084",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#00D084",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyStateIconText: {
    fontSize: 32,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#E2E8F0",
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  emptyStateSubtext: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
    lineHeight: 22,
  },
  deviceIdText: {
    fontSize: 12,
    color: "#475569",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "SF Mono" : "monospace",
    backgroundColor: "#0D1117",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: "flex-end",
  },
  botMessageContainer: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "85%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userMessage: {
    backgroundColor: "#00D084",
    borderBottomRightRadius: 6,
    shadowColor: "#00D084",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  botMessage: {
    backgroundColor: "#161B22",
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  typingIndicator: {
    alignItems: "flex-start",
    marginBottom: 16,
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161B22",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#64748B",
    marginHorizontal: 3,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: "#21262D",
    backgroundColor: "#010409",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#161B22",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 56,
    borderWidth: 1,
    borderColor: "#21262D",
    shadowColor: "#00D084",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    maxHeight: 120,
    paddingVertical: 8,
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
    lineHeight: 22,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#00D084",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    shadowColor: "#00D084",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: "#30363D",
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
  },
}
