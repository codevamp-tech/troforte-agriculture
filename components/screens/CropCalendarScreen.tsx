import React, { useState } from "react"
import {
    Platform,
    // SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

interface CropCalendarScreenProps {
  onBack: () => void
}

export default function CropCalendarScreen({ onBack }: CropCalendarScreenProps) {
  const [selectedCrop, setSelectedCrop] = useState("wheat")
  const [selectedRegion, setSelectedRegion] = useState("nsw")
  const [showCropDropdown, setShowCropDropdown] = useState(false)
  const [showRegionDropdown, setShowRegionDropdown] = useState(false)

  const crops = [
    { id: "wheat", name: "Wheat", icon: "🌾" },
    { id: "corn", name: "Corn", icon: "🌽" },
    { id: "rice", name: "Rice", icon: "🌾" },
    { id: "barley", name: "Barley", icon: "🌾" },
  ]

  const regions = [
    { id: "nsw", name: "New South Wales", icon: "🏞️" },
    { id: "vic", name: "Victoria", icon: "🏔️" },
    { id: "qld", name: "Queensland", icon: "🌴" },
    { id: "wa", name: "Western Australia", icon: "🏜️" },
  ]

  const todaysTasks = [
    { id: 1, task: "Check soil moisture", type: "irrigation", time: "Morning", priority: "high" },
    { id: 2, task: "Apply nitrogen fertilizer", type: "fertilization", time: "Afternoon", priority: "medium" },
    { id: 3, task: "Inspect for pests", type: "monitoring", time: "Evening", priority: "low" },
  ]

  const upcomingTasks = [
    { id: 1, date: "Tomorrow", task: "Irrigation - Zone A", type: "irrigation" },
    { id: 2, date: "Dec 15", task: "Harvest preparation", type: "harvest" },
    { id: 3, date: "Dec 18", task: "Soil testing", type: "monitoring" },
    { id: 4, date: "Dec 20", task: "Equipment maintenance", type: "maintenance" },
  ]

  const getTaskColor = (type: string) => {
    switch (type) {
      case "irrigation":
        return "#3B82F6"
      case "fertilization":
        return "#00D084"
      case "harvest":
        return "#F59E0B"
      case "monitoring":
        return "#8B5CF6"
      case "maintenance":
        return "#EF4444"
      default:
        return "#6B7280"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#EF4444"
      case "medium":
        return "#F59E0B"
      case "low":
        return "#10B981"
      default:
        return "#6B7280"
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#010409" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crop Calendar</Text>
        <Text style={styles.headerSubtitle}>Smart reminders for your farming schedule</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Crop & Region Selection */}
        <View style={styles.selectionSection}>
          <Text style={styles.sectionTitle}>📍 Setup Your Farm</Text>

          <View style={styles.dropdownRow}>
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Crop Type</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowCropDropdown(!showCropDropdown)}
              >
                <Text style={styles.dropdownText}>
                  {crops.find((c) => c.id === selectedCrop)?.icon}{" "}
                  {crops.find((c) => c.id === selectedCrop)?.name}
                </Text>
                <Text style={styles.dropdownArrow}>{showCropDropdown ? "▼" : "▶"}</Text>
              </TouchableOpacity>

              {showCropDropdown && (
                <View style={styles.dropdownOptions}>
                  {crops.map((crop) => (
                    <TouchableOpacity
                      key={crop.id}
                      style={styles.dropdownOption}
                      onPress={() => {
                        setSelectedCrop(crop.id)
                        setShowCropDropdown(false)
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>
                        {crop.icon} {crop.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Region</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowRegionDropdown(!showRegionDropdown)}
              >
                <Text style={styles.dropdownText}>
                  {regions.find((r) => r.id === selectedRegion)?.icon}{" "}
                  {regions.find((r) => r.id === selectedRegion)?.name}
                </Text>
                <Text style={styles.dropdownArrow}>{showRegionDropdown ? "▼" : "▶"}</Text>
              </TouchableOpacity>

              {showRegionDropdown && (
                <View style={styles.dropdownOptions}>
                  {regions.map((region) => (
                    <TouchableOpacity
                      key={region.id}
                      style={styles.dropdownOption}
                      onPress={() => {
                        setSelectedRegion(region.id)
                        setShowRegionDropdown(false)
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>
                        {region.icon} {region.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.generateButton}>
            <Text style={styles.generateButtonText}>🤖 Generate Smart Schedule</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Tasks */}
        <View style={styles.tasksSection}>
          <Text style={styles.sectionTitle}>📋 Today's Tasks</Text>
          {todaysTasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <View style={[styles.taskTypeIndicator, { backgroundColor: getTaskColor(task.type) }]} />
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle}>{task.task}</Text>
                  <Text style={styles.taskTime}>{task.time}</Text>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                  <Text style={styles.priorityText}>{task.priority.toUpperCase()}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Upcoming Tasks */}
        <View style={styles.tasksSection}>
          <Text style={styles.sectionTitle}>📅 Upcoming Tasks (7 Days)</Text>
          {upcomingTasks.map((task) => (
            <View key={task.id} style={styles.upcomingTaskCard}>
              <View style={styles.taskDateContainer}>
                <Text style={styles.taskDate}>{task.date}</Text>
              </View>
              <View style={styles.taskDetails}>
                <View style={[styles.taskTypeIndicator, { backgroundColor: getTaskColor(task.type) }]} />
                <Text style={styles.upcomingTaskTitle}>{task.task}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Weather Integration */}
        <View style={styles.weatherIntegrationCard}>
          <Text style={styles.weatherTitle}>🌦️ Weather-Based Recommendations</Text>
          <View style={styles.weatherRecommendation}>
            <Text style={styles.weatherIcon}>🌧️</Text>
            <View style={styles.weatherText}>
              <Text style={styles.weatherMessage}>Rain expected tomorrow</Text>
              <Text style={styles.weatherAdvice}>Skip irrigation for Zone A & B</Text>
            </View>
          </View>
        </View>

       
      </ScrollView>
    </SafeAreaView>
  )
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
  content: {
    flex: 1,
    padding: 20,
  },
  selectionSection: {
    backgroundColor: "#161B22",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  dropdownRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  dropdownContainer: {
    flex: 1,
    position: "relative",
  },
  dropdownLabel: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 8,
    fontWeight: "500",
  },
  dropdown: {
    backgroundColor: "#0D1117",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#21262D",
  },
  dropdownText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  dropdownArrow: {
    color: "#00D084",
    fontSize: 12,
  },
  dropdownOptions: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#0D1117",
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#21262D",
    zIndex: 1000,
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#21262D",
  },
  dropdownOptionText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  generateButton: {
    backgroundColor: "#00D084",
    borderRadius: 12,
    padding: 16,
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
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  tasksSection: {
    marginBottom: 24,
  },
  taskCard: {
    backgroundColor: "#161B22",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskTypeIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  taskTime: {
    fontSize: 14,
    color: "#94A3B8",
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
  upcomingTaskCard: {
    backgroundColor: "#161B22",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#21262D",
    flexDirection: "row",
    alignItems: "center",
  },
  taskDateContainer: {
    width: 80,
    marginRight: 16,
  },
  taskDate: {
    fontSize: 12,
    color: "#00D084",
    fontWeight: "600",
  },
  taskDetails: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  upcomingTaskTitle: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
    marginLeft: 12,
  },
  weatherIntegrationCard: {
    backgroundColor: "#161B22",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  weatherTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  weatherRecommendation: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D1117",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  weatherIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  weatherText: {
    flex: 1,
  },
  weatherMessage: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
    marginBottom: 4,
  },
  weatherAdvice: {
    fontSize: 12,
    color: "#94A3B8",
  },
  voiceSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  voiceButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 8,
    shadowColor: "#8B5CF6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  voiceButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  voiceHint: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
  },
})
