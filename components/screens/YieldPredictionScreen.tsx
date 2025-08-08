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


interface YieldPredictionScreenProps {
  onBack: () => void
}

export default function YieldPredictionScreen({ onBack }: YieldPredictionScreenProps) {
  const [farmingType, setFarmingType] = useState("conventional")
  const [formData, setFormData] = useState({
    crop: "wheat",
    fieldArea: "",
    lastFertilization: "",
    irrigationFrequency: "",
    plantHealthScore: "",
  })

  const [prediction, setPrediction] = useState({
    low: 2.8,
    medium: 3.5,
    high: 4.2,
    confidence: 85,
    factors: [
      { factor: "Soil Health", impact: "positive", score: 8.2 },
      { factor: "Weather Conditions", impact: "neutral", score: 7.0 },
      { factor: "Fertilization Schedule", impact: "positive", score: 8.8 },
      { factor: "Plant Health", impact: "negative", score: 6.5 },
      { factor: "Irrigation Management", impact: "positive", score: 7.8 },
    ],
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "#10B981"
      case "negative":
        return "#EF4444"
      case "neutral":
        return "#F59E0B"
      default:
        return "#6B7280"
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive":
        return "📈"
      case "negative":
        return "📉"
      case "neutral":
        return "➡️"
      default:
        return "❓"
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
        <Text style={styles.headerTitle}>Yield Prediction</Text>
        <Text style={styles.headerSubtitle}>AI-powered crop yield estimation and insights</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Input Form */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>📊 Farm Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Crop Type</Text>
            <View style={styles.cropSelector}>
              {["wheat", "corn", "rice", "barley"].map((crop) => (
                <TouchableOpacity
                  key={crop}
                  style={[styles.cropOption, formData.crop === crop && styles.selectedCropOption]}
                  onPress={() => handleInputChange("crop", crop)}
                >
                  <Text
                    style={[styles.cropOptionText, formData.crop === crop && styles.selectedCropOptionText]}
                  >
                    {crop.charAt(0).toUpperCase() + crop.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Field Area (hectares)</Text>
              <TextInput
                style={styles.input}
                value={formData.fieldArea}
                onChangeText={(value) => handleInputChange("fieldArea", value)}
                placeholder="10.5"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Plant Health Score</Text>
              <TextInput
                style={styles.input}
                value={formData.plantHealthScore}
                onChangeText={(value) => handleInputChange("plantHealthScore", value)}
                placeholder="8.5"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Last Fertilization (days ago)</Text>
            <TextInput
              style={styles.input}
              value={formData.lastFertilization}
              onChangeText={(value) => handleInputChange("lastFertilization", value)}
              placeholder="14"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Irrigation Frequency (per week)</Text>
            <TextInput
              style={styles.input}
              value={formData.irrigationFrequency}
              onChangeText={(value) => handleInputChange("irrigationFrequency", value)}
              placeholder="3"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
            />
          </View>

          {/* Farming Type Toggle */}
          <View style={styles.toggleSection}>
            <Text style={styles.inputLabel}>Farming Method</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleOption, farmingType === "organic" && styles.activeToggle]}
                onPress={() => setFarmingType("organic")}
              >
                <Text style={[styles.toggleText, farmingType === "organic" && styles.activeToggleText]}>
                  🌱 Organic
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleOption, farmingType === "conventional" && styles.activeToggle]}
                onPress={() => setFarmingType("conventional")}
              >
                <Text style={[styles.toggleText, farmingType === "conventional" && styles.activeToggleText]}>
                  🧪 Conventional
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.predictButton}>
            <Text style={styles.predictButtonText}>🤖 Generate Prediction</Text>
          </TouchableOpacity>
        </View>

        {/* Yield Prediction Results */}
        <View style={styles.predictionSection}>
          <Text style={styles.sectionTitle}>📈 Yield Prediction</Text>

          <View style={styles.yieldRangeCard}>
            <Text style={styles.yieldTitle}>Expected Yield Range (tonnes/hectare)</Text>
            <View style={styles.yieldRange}>
              <View style={styles.yieldItem}>
                <Text style={styles.yieldLabel}>Low</Text>
                <Text style={[styles.yieldValue, { color: "#EF4444" }]}>{prediction.low}</Text>
              </View>
              <View style={styles.yieldItem}>
                <Text style={styles.yieldLabel}>Medium</Text>
                <Text style={[styles.yieldValue, { color: "#F59E0B" }]}>{prediction.medium}</Text>
              </View>
              <View style={styles.yieldItem}>
                <Text style={styles.yieldLabel}>High</Text>
                <Text style={[styles.yieldValue, { color: "#10B981" }]}>{prediction.high}</Text>
              </View>
            </View>
            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceText}>Confidence: {prediction.confidence}%</Text>
            </View>
          </View>

          {/* Factors Affecting Yield */}
          <View style={styles.factorsSection}>
            <Text style={styles.factorsTitle}>🎯 Factors Affecting Your Yield</Text>
            {prediction.factors.map((factor, index) => (
              <View key={index} style={styles.factorCard}>
                <View style={styles.factorHeader}>
                  <Text style={styles.factorIcon}>{getImpactIcon(factor.impact)}</Text>
                  <View style={styles.factorInfo}>
                    <Text style={styles.factorName}>{factor.factor}</Text>
                    <Text style={[styles.factorImpact, { color: getImpactColor(factor.impact) }]}>
                      {factor.impact.toUpperCase()} IMPACT
                    </Text>
                  </View>
                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>{factor.score}/10</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Improvement Suggestions */}
          <View style={styles.suggestionsSection}>
            <Text style={styles.sectionTitle}>💡 Yield Improvement Tips</Text>
            <View style={styles.suggestionCard}>
              <Text style={styles.suggestionTitle}>🌱 Improve Plant Health</Text>
              <Text style={styles.suggestionText}>
                Your plant health score is 6.5/10. Consider regular monitoring and early disease detection to boost yield by up to 15%.
              </Text>
            </View>
            <View style={styles.suggestionCard}>
              <Text style={styles.suggestionTitle}>💧 Optimize Irrigation</Text>
              <Text style={styles.suggestionText}>
                Current irrigation frequency is good. Monitor soil moisture to avoid over/under-watering during critical growth stages.
              </Text>
            </View>
            <View style={styles.suggestionCard}>
              <Text style={styles.suggestionTitle}>🧪 Nutrient Management</Text>
              <Text style={styles.suggestionText}>
                Last fertilization was 14 days ago. Consider split applications during grain filling stage for maximum yield potential.
              </Text>
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
  inputSection: {
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
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
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
  inputRow: {
    flexDirection: "row",
    gap: 16,
  },
  cropSelector: {
    flexDirection: "row",
    gap: 8,
  },
  cropOption: {
    flex: 1,
    backgroundColor: "#0D1117",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#21262D",
  },
  selectedCropOption: {
    backgroundColor: "#00D084",
    borderColor: "#00D084",
  },
  cropOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#94A3B8",
  },
  selectedCropOptionText: {
    color: "#FFFFFF",
  },
  toggleSection: {
    marginBottom: 24,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#0D1117",
    borderRadius: 8,
    padding: 4,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: "#00D084",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },
  activeToggleText: {
    color: "#FFFFFF",
  },
  predictButton: {
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
  predictButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  predictionSection: {
    marginBottom: 24,
  },
  yieldRangeCard: {
    backgroundColor: "#161B22",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  yieldTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  yieldRange: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  yieldItem: {
    alignItems: "center",
  },
  yieldLabel: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 8,
  },
  yieldValue: {
    fontSize: 24,
    fontWeight: "800",
  },
  confidenceContainer: {
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#21262D",
  },
  confidenceText: {
    fontSize: 14,
    color: "#00D084",
    fontWeight: "600",
  },
  factorsSection: {
    marginBottom: 24,
  },
  factorsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  factorCard: {
    backgroundColor: "#161B22",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  factorHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  factorIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  factorInfo: {
    flex: 1,
  },
  factorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  factorImpact: {
    fontSize: 12,
    fontWeight: "600",
  },
  scoreContainer: {
    backgroundColor: "#0D1117",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00D084",
  },
  suggestionsSection: {},
  suggestionCard: {
    backgroundColor: "#161B22",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 20,
  },
})
