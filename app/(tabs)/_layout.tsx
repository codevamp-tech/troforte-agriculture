import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
         tabBarActiveTintColor: "#00D084",        // 💚 Active tab color
    tabBarInactiveTintColor: "#6B7280", 
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="desktopcomputer" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="plantHealth"
        options={{
          title: "Health",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="leaf.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: "Support",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="message.fill" color={color} />
          ),
        }}
      />
     
      <Tabs.Screen
        name="voiceAssistant"
        options={{
          title: "Voice",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="headphones.circle.fill" color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="personalizedTips"
        options={{
          title: "Tips",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="lightbulb.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
