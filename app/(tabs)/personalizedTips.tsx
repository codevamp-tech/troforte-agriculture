import React, { useState } from "react";
import {
  Platform,
  // SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


interface PersonalizedTipsScreenProps {
  onBack: () => void;
}

export default function PersonalizedTipsScreen() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const tips = [
    {
      id: 1,
      type: "nutrient",
      icon: "🌱",
      title: "Add Potassium This Week",
      description:
        "Stunted growth detected in your wheat crop. Potassium deficiency can reduce yield by 20-30%.",
      action: "Apply 150kg/ha of potassium sulfate before next irrigation",
      priority: "high",
      source: "Plant Health Analysis",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      type: "weather",
      icon: "🌧️",
      title: "Skip Irrigation This Weekend",
      description:
        "Heavy rain expected in NSW (25-40mm). Avoid overwatering your crops.",
      action: "Postpone scheduled irrigation until Tuesday",
      priority: "medium",
      source: "Weather Forecast",
      timestamp: "4 hours ago",
    },
    {
      id: 3,
      type: "pest",
      icon: "🐛",
      title: "Monitor for Aphids",
      description:
        "Temperature and humidity conditions favor aphid development in your region.",
      action: "Check undersides of leaves daily for next 5 days",
      priority: "medium",
      source: "Regional Pest Alert",
      timestamp: "1 day ago",
    },
    {
      id: 4,
      type: "growth",
      icon: "📈",
      title: "Optimal Growth Window",
      description:
        "Your wheat is entering the grain filling stage. Critical period for final yield determination.",
      action: "Ensure adequate water supply and monitor for diseases",
      priority: "high",
      source: "Growth Stage Analysis",
      timestamp: "1 day ago",
    },
    {
      id: 5,
      type: "soil",
      icon: "🌍",
      title: "Soil pH Adjustment Needed",
      description:
        "Recent soil test shows pH of 5.8. Optimal range for wheat is 6.0-7.0.",
      action: "Apply lime at 2 tonnes/ha before next season",
      priority: "low",
      source: "Soil Health Tracker",
      timestamp: "3 days ago",
    },
    {
      id: 6,
      type: "equipment",
      icon: "🚜",
      title: "Equipment Maintenance Due",
      description:
        "Your irrigation system is due for maintenance based on usage patterns.",
      action: "Schedule maintenance check for pumps and filters",
      priority: "low",
      source: "Equipment Monitoring",
      timestamp: "5 days ago",
    },
  ];

  const filters = [
    { id: "all", name: "All Tips", icon: "📋" },
    { id: "nutrient", name: "Nutrients", icon: "🌱" },
    { id: "weather", name: "Weather", icon: "🌦️" },
    { id: "pest", name: "Pests", icon: "🐛" },
    { id: "growth", name: "Growth", icon: "📈" },
    { id: "soil", name: "Soil", icon: "🌍" },
    { id: "equipment", name: "Equipment", icon: "🚜" },
  ];

  const filteredTips =
    selectedFilter === "all"
      ? tips
      : tips.filter((tip) => tip.type === selectedFilter);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#EF4444";
      case "medium":
        return "#F59E0B";
      case "low":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  const handleFeedback = (tipId: number, helpful: boolean) => {
    // Handle feedback logic here
    console.log(
      `Tip ${tipId} marked as ${helpful ? "helpful" : "not helpful"}`
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#010409" />

      {/* Header */}
      <View style={styles.header}>
        
        <Text style={styles.headerTitle}>Smart Tips</Text>
        <Text style={styles.headerSubtitle}>
          Personalized farming recommendations just for you
        </Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterTab,
              selectedFilter === filter.id && styles.activeFilterTab,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text style={styles.filterIcon}>{filter.icon}</Text>
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.id && styles.activeFilterText,
              ]}
            >
              {filter.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tips Feed */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>
            💡{" "}
            {selectedFilter === "all"
              ? "All Tips"
              : filters.find((f) => f.id === selectedFilter)?.name}{" "}
            ({filteredTips.length})
          </Text>

          {filteredTips.map((tip) => (
            <View key={tip.id} style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <View style={styles.tipIconContainer}>
                  <Text style={styles.tipIcon}>{tip.icon}</Text>
                </View>
                <View style={styles.tipHeaderInfo}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <View style={styles.tipMeta}>
                    <View
                      style={[
                        styles.priorityBadge,
                        { backgroundColor: getPriorityColor(tip.priority) },
                      ]}
                    >
                      <Text style={styles.priorityText}>
                        {tip.priority.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.tipTimestamp}>{tip.timestamp}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.tipDescription}>{tip.description}</Text>

              <View style={styles.actionSection}>
                <Text style={styles.actionTitle}>Recommended Action:</Text>
                <Text style={styles.actionText}>{tip.action}</Text>
              </View>

              <View style={styles.tipFooter}>
                <Text style={styles.tipSource}>Source: {tip.source}</Text>
                <View style={styles.feedbackSection}>
                  <Text style={styles.feedbackLabel}>Helpful?</Text>
                  <TouchableOpacity
                    style={styles.feedbackButton}
                    onPress={() => handleFeedback(tip.id, true)}
                  >
                    <Text style={styles.feedbackButtonText}>👍</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.feedbackButton}
                    onPress={() => handleFeedback(tip.id, false)}
                  >
                    <Text style={styles.feedbackButtonText}>👎</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Notification Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>🔔 Notification Settings</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Daily Tips</Text>
              <TouchableOpacity style={styles.toggleSwitch}>
                <View style={styles.toggleSwitchActive} />
              </TouchableOpacity>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Weather Alerts</Text>
              <TouchableOpacity style={styles.toggleSwitch}>
                <View style={styles.toggleSwitchActive} />
              </TouchableOpacity>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Pest Warnings</Text>
              <TouchableOpacity style={styles.toggleSwitch}>
                <View style={styles.toggleSwitchActive} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* AI Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>🤖 AI Insights</Text>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Weekly Summary</Text>
            <Text style={styles.insightText}>
              Based on your farm data, you've received 12 tips this week. 8 were
              marked as helpful. Your most common issues are nutrient management
              and weather-related decisions.
            </Text>
            <TouchableOpacity style={styles.insightButton}>
              <Text style={styles.insightButtonText}>
                📊 View Detailed Report
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#010409",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 20 : 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#21262D",
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: "#00D084",
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    textShadowColor: "#00D084",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#94A3B8",
    marginTop: 4,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    maxHeight: 60,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161B22",
    borderRadius: 20,
    paddingHorizontal: 14, // Reduced from 16
    paddingVertical: 6, // Reduced from 8
    marginRight: 8, // Reduced from 12
    borderWidth: 1,
    borderColor: "#21262D",
    height: 36,
  },
  activeFilterTab: {
    backgroundColor: "#00D084",
    borderColor: "#00D084",
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tipsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: "#161B22",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  tipHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  tipIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0D1117",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  tipIcon: {
    fontSize: 24,
  },
  tipHeaderInfo: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  tipMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  tipTimestamp: {
    fontSize: 12,
    color: "#94A3B8",
  },
  tipDescription: {
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 20,
    marginBottom: 16,
  },
  actionSection: {
    backgroundColor: "#0D1117",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00D084",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
  },
  tipFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#21262D",
  },
  tipSource: {
    fontSize: 12,
    color: "#94A3B8",
    fontStyle: "italic",
  },
  feedbackSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  feedbackLabel: {
    fontSize: 12,
    color: "#94A3B8",
  },
  feedbackButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0D1117",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#21262D",
  },
  feedbackButtonText: {
    fontSize: 16,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsCard: {
    backgroundColor: "#161B22",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#21262D",
  },
  settingLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#00D084",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 2,
  },
  toggleSwitchActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  insightsSection: {},
  insightCard: {
    backgroundColor: "#161B22",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 20,
    marginBottom: 16,
  },
  insightButton: {
    backgroundColor: "#00D084",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  insightButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
