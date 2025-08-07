import React from "react"
import { Animated, Dimensions, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native"

const { width: screenWidth } = Dimensions.get("window")
const SIDEBAR_WIDTH = screenWidth * 0.75

interface ChatSidebarProps {
  isVisible: boolean
  onClose: () => void
  chatHistory: any[]
  currentChatId: string | null
  onLoadChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
  onStartNewChat: () => void
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isVisible,
  onClose,
  chatHistory,
  currentChatId,
  onLoadChat,
  onDeleteChat,
  onStartNewChat,
}) => {
  const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [isVisible])

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop */}
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Chat History</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            onStartNewChat()
            onClose()
          }}
          style={styles.newChatButtonSidebar}
        >
          <Text style={styles.newChatButtonTextSidebar}>+ Start New Chat</Text>
        </TouchableOpacity>

        <ScrollView style={styles.chatHistoryList} showsVerticalScrollIndicator={false}>
          {chatHistory.length === 0 ? (
            <View style={styles.emptyChatHistory}>
              <Text style={styles.emptyChatHistoryText}>No previous chats</Text>
            </View>
          ) : (
            chatHistory.map((chat) => (
              <TouchableOpacity
                key={chat.chatId}
                style={[
                  styles.chatHistoryItemSidebar,
                  currentChatId === chat.chatId && styles.activeChatHistoryItemSidebar,
                ]}
                onPress={() => {
                  onLoadChat(chat.chatId)
                  onClose()
                }}
                onLongPress={() => onDeleteChat(chat.chatId)}
              >
                <Text style={styles.chatHistoryTitleSidebar} numberOfLines={2}>
                  {chat.title}
                </Text>
                {/* <Text style={styles.chatHistorySubtitleSidebar} numberOfLines={1}>
                  {chat.messageCount} messages
                </Text> */}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </Animated.View>
    </>
  )
}

const styles = {
  backdrop: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 998,
  },
  sidebar: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: "#0D1117",
    zIndex: 999,
    borderRightWidth: 1,
    borderRightColor: "#21262D",
  },
  sidebarHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    borderBottomWidth: 1,
    borderBottomColor: "#21262D",
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  newChatButtonSidebar: {
    backgroundColor: "#00D084",
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#00D084",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  newChatButtonTextSidebar: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  chatHistoryList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyChatHistory: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyChatHistoryText: {
    color: "#64748B",
    fontSize: 16,
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  chatHistoryItemSidebar: {
    backgroundColor: "#161B22",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  activeChatHistoryItemSidebar: {
    backgroundColor: "#00A86B",
    borderColor: "#00D084",
    shadowColor: "#00D084",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  chatHistoryTitleSidebar: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
    lineHeight: 20,
  },
  chatHistorySubtitleSidebar: {
    color: "#94A3B8",
    fontSize: 13,
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
}

export default ChatSidebar
