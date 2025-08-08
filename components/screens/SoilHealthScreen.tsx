import React, { useState } from "react"
import {
    Platform,
    // SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"


interface SoilHealthScreenProps {
  onBack: () => void
}

export default function SoilHealthScreen({ onBack }: SoilHealthScreenProps) {
  const [activeTab, setActiveTab] = useState("input")
  const [soilData, setSoilData] = useState({
    ph: "",
    ec: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    organic_matter: "",
  })

  const recommendations = [
    {
      id: 1,
      type: "pH Adjustment",
      product: "Troforte M All Purpose",
      reason: "pH is slightly acidic (6.2). Optimal range is 6.5-7.0",
      application: "Apply 2kg per 100m² before next planting",
      priority: "high",
    },
    {
      id: 2,
      type: "Nitrogen Boost",
      product: "Troforte M Native",
      reason: "Nitrogen levels are below optimal for wheat growth",
      application: "Apply 1.5kg per 100m² during vegetative stage",
      priority: "medium",
    },
    {
      id: 3,
      type: "Phosphorus Enhancement",
      product: "Troforte M Native",
      reason: "Phosphorus deficiency detected, critical for root development",
      application: "Apply 1kg per 100m² at planting",
      priority: "high",
    },
  ]

  const historyData = [
    { date: "Nov 2024", ph: 6.2, nitrogen: 45, phosphorus: 12, potassium: 180 },
    { date: "Sep 2024", ph: 6.0, nitrogen: 38, phosphorus: 10, potassium: 165 },
    { date: "Jul 2024", ph: 5.8, nitrogen: 42, phosphorus: 8, potassium: 155 },
    { date: "May 2024", ph: 5.9, nitrogen: 40, phosphorus: 9, potassium: 160 },
  ]

  const handleInputChange = (field: string, value: string) => {
    setSoilData((prev) => ({ ...prev, [field]: value }))
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

  const renderInputTab = () => (
    <View style={styles.inputSection}>
      <Text style={styles.sectionTitle}>🧪 Soil Test Results</Text>

      <View style={styles.inputGrid}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>pH Level</Text>
          <TextInput
            style={styles.input}
            value={soilData.ph}
            onChangeText={(value) => handleInputChange("ph", value)}
            placeholder="6.5"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
          />
          <Text style={styles.inputUnit}>Optimal: 6.5-7.0</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>EC (μS/cm)</Text>
          <TextInput
            style={styles.input}
            value={soilData.ec}
            onChangeText={(value) => handleInputChange("ec", value)}
            placeholder="800"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
          />
          <Text style={styles.inputUnit}>Electrical Conductivity</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nitrogen (ppm)</Text>
          <TextInput
            style={styles.input}
            value={soilData.nitrogen}
            onChangeText={(value) => handleInputChange("nitrogen", value)}
            placeholder="50"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
          />
          <Text style={styles.inputUnit}>Available N</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phosphorus (ppm)</Text>
          <TextInput
            style={styles.input}
            value={soilData.phosphorus}
            onChangeText={(value) => handleInputChange("phosphorus", value)}
            placeholder="15"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
          />
          <Text style={styles.inputUnit}>Available P</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Potassium (ppm)</Text>
          <TextInput
            style={styles.input}
            value={soilData.potassium}
            onChangeText={(value) => handleInputChange("potassium", value)}
            placeholder="200"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
          />
          <Text style={styles.inputUnit}>Available K</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Organic Matter (%)</Text>
          <TextInput
            style={styles.input}
            value={soilData.organic_matter}
            onChangeText={(value) => handleInputChange("organic_matter", value)}
            placeholder="3.5"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
          />
          <Text style={styles.inputUnit}>Organic content</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.analyzeButton}>
        <Text style={styles.analyzeButtonText}>🤖 Get AI Recommendations</Text>
      </TouchableOpacity>
    </View>
  )

  const renderRecommendationsTab = () => (
    <View style={styles.recommendationsSection}>
      <Text style={styles.sectionTitle}>💡 AI Recommendations</Text>

      {recommendations.map((rec) => (
        <View key={rec.id} style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>
            <Text style={styles.recommendationType}>{rec.type}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(rec.priority) }]}>
              <Text style={styles.priorityText}>{rec.priority.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.productSection}>
            <Text style={styles.productName}>📦 {rec.product}</Text>
            <Text style={styles.productReason}>{rec.reason}</Text>
          </View>

          <View style={styles.applicationSection}>
            <Text style={styles.applicationTitle}>Application Instructions:</Text>
            <Text style={styles.applicationText}>{rec.application}</Text>
          </View>

          <TouchableOpacity style={styles.orderButton}>
            <Text style={styles.orderButtonText}>🛒 Order Product</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )

  const renderHistoryTab = () => (
    <View style={styles.historySection}>
      <Text style={styles.sectionTitle}>📊 Soil Health History</Text>

      <View style={styles.chartPlaceholder}>
        <Text style={styles.chartTitle}>pH Trend Over Time</Text>
        <View style={styles.chartArea}>
          <Text style={styles.chartText}>📈 Chart visualization would go here</Text>
          <Text style={styles.chartSubtext}>Showing pH levels from May to November 2024</Text>
        </View>
      </View>

      <View style={styles.historyTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Date</Text>
          <Text style={styles.tableHeaderText}>pH</Text>
          <Text style={styles.tableHeaderText}>N</Text>
          <Text style={styles.tableHeaderText}>P</Text>
          <Text style={styles.tableHeaderText}>K</Text>
        </View>

        {historyData.map((data, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCellText}>{data.date}</Text>
            <Text style={styles.tableCellText}>{data.ph}</Text>
            <Text style={styles.tableCellText}>{data.nitrogen}</Text>
            <Text style={styles.tableCellText}>{data.phosphorus}</Text>
            <Text style={styles.tableCellText}>{data.potassium}</Text>
          </View>
        ))}
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#010409" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Soil Health Tracker</Text>
        <Text style={styles.headerSubtitle}>Monitor and improve your soil health with AI insights</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "input" && styles.activeTab]}
          onPress={() => setActiveTab("input")}
        >
          <Text style={[styles.tabText, activeTab === "input" && styles.activeTabText]}>Input</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "recommendations" && styles.activeTab]}
          onPress={() => setActiveTab("recommendations")}
        >
          <Text style={[styles.tabText, activeTab === "recommendations" && styles.activeTabText]}>
            Recommendations
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => setActiveTab("history")}
        >
          <Text style={[styles.tabText, activeTab === "history" && styles.activeTabText]}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === "input" && renderInputTab()}
        {activeTab === "recommendations" && renderRecommendationsTab()}
        {activeTab === "history" && renderHistoryTab()}
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#161B22",
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#00D084",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputSection: {
    backgroundColor: "#161B22",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  inputGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {
    width: "47%",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#0D1117",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  inputUnit: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },
  analyzeButton: {
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
  analyzeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  recommendationsSection: {},
  recommendationCard: {
    backgroundColor: "#161B22",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  recommendationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  recommendationType: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
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
  productSection: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00D084",
    marginBottom: 8,
  },
  productReason: {
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 20,
  },
  applicationSection: {
    backgroundColor: "#0D1117",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  applicationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  applicationText: {
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 20,
  },
  orderButton: {
    backgroundColor: "#F59E0B",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  orderButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  historySection: {},
  chartPlaceholder: {
    backgroundColor: "#161B22",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  chartArea: {
    height: 200,
    backgroundColor: "#0D1117",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#21262D",
  },
  chartText: {
    fontSize: 16,
    color: "#94A3B8",
    marginBottom: 8,
  },
  chartSubtext: {
    fontSize: 12,
    color: "#6B7280",
  },
  historyTable: {
    backgroundColor: "#161B22",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#21262D",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0D1117",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#21262D",
  },
  tableCellText: {
    flex: 1,
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
  },
})
