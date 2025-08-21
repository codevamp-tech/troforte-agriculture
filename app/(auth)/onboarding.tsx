"use client"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Picker } from "@react-native-picker/picker"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

export default function OnboardingScreen() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Personal Information
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")

  // Farm Information
  const [farmName, setFarmName] = useState("")
  const [farmAddress, setFarmAddress] = useState("")
  const [farmSize, setFarmSize] = useState("")
  const [farmType, setFarmType] = useState("")
  const [establishedYear, setEstablishedYear] = useState("")

  // Farming Details
  const [primaryCrops, setPrimaryCrops] = useState([])
  const [farmingMethod, setFarmingMethod] = useState("")
  const [certifications, setCertifications] = useState("")

  // Emergency Contact
  const [emergencyContact, setEmergencyContact] = useState("")
  const [emergencyPhone, setEmergencyPhone] = useState("")

  // Preferences & Notifications
  const [units, setUnits] = useState("metric")
  const [notifications, setNotifications] = useState({
    weather: true,
    pests: true,
    market: false,
    reminders: true,
  })

  const totalSteps = 4

  const farmTypes = [
    { id: "crop", name: "Crop Farming" },
    { id: "livestock", name: "Livestock" },
    { id: "mixed", name: "Mixed Farming" },
    { id: "organic", name: "Organic" },
  ]

  const availableCrops = [
    { id: "wheat", name: "Wheat" },
    { id: "barley", name: "Barley" },
    { id: "corn", name: "Corn" },
    { id: "rice", name: "Rice" },
    { id: "canola", name: "Canola" },
    { id: "cotton", name: "Cotton" },
  ]

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!firstName.trim() || !lastName.trim()  || !phone.trim()) {
          Alert.alert("Error", "Please fill in all personal information fields")
          return false
        }
        break
      case 2:
        if (!farmName.trim() || !farmAddress.trim() || !farmSize.trim() || !farmType) {
          Alert.alert("Error", "Please complete all farm information")
          return false
        }
        break
      case 3:
        if (primaryCrops.length === 0 || !farmingMethod) {
          Alert.alert("Error", "Please select your crops and farming method")
          return false
        }
        break
      case 4:
        if (!emergencyContact.trim() || !emergencyPhone.trim()) {
          Alert.alert("Error", "Please provide emergency contact information")
          return false
        }
        break
    }
    return true
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
      } else {
        handleComplete()
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
  setLoading(true);
  try {
    // Get userId from AsyncStorage
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      throw new Error("User ID not found");
    }
    const processedCertifications = certifications
      .split(",")
      .map(c => c.trim())
      .filter(c => c);


    const onboardingData = {
      userId, // Add userId to the request
      // Personal Information
      firstName,
      lastName,
      phone,
      dateOfBirth,

      // Farm Information
      farmName,
      farmAddress,
      farmSize,
      farmType,
      establishedYear,

      // Farming Details
        primaryCrops: primaryCrops.length > 0 ? primaryCrops.join(", ") : "None",
      farmingMethod,
      certifications: processedCertifications.length > 0 
        ? processedCertifications.join(", ") 
        : "None",

      // Emergency Contact
      emergencyContact,
      emergencyPhone,

      // Preferences
      units,
      notifications,
    };

    // Send to backend API
    const response = await fetch("http://192.168.1.23:4000/api/register-farmer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(onboardingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to register farmer");
    }

    // If successful, navigate to main app
    router.replace("/(tabs)");
  } catch (error) {
    console.error("Registration error:", error);
    Alert.alert(
      "Error",
      error.message || "Failed to complete registration. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  const toggleCrop = (cropId) => {
    setPrimaryCrops((prev) => (prev.includes(cropId) ? prev.filter((c) => c !== cropId) : [...prev, cropId]))
  }

  const toggleNotification = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <ThemedText style={styles.stepTitle}>Personal Information</ThemedText>
      <ThemedText style={styles.stepSubtitle}>Tell us about yourself</ThemedText>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <ThemedText style={styles.label}>First Name</ThemedText>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="John"
            placeholderTextColor="#6B7280"
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
          <ThemedText style={styles.label}>Last Name</ThemedText>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Smith"
            placeholderTextColor="#6B7280"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Phone Number</ThemedText>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="+61 412 345 678"
          placeholderTextColor="#6B7280"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Date of Birth (Optional)</ThemedText>
        <TextInput
          style={styles.input}
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#6B7280"
        />
      </View>
    </View>
  )

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <ThemedText style={styles.stepTitle}>Farm Information</ThemedText>
      <ThemedText style={styles.stepSubtitle}>Tell us about your farm</ThemedText>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Farm Name</ThemedText>
        <TextInput
          style={styles.input}
          value={farmName}
          onChangeText={setFarmName}
          placeholder="e.g., Smith Family Farm"
          placeholderTextColor="#6B7280"
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Farm Address</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={farmAddress}
          onChangeText={setFarmAddress}
          placeholder="123 Rural Road, City, State, Country"
          placeholderTextColor="#6B7280"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 2 }]}>
          <ThemedText style={styles.label}>Farm Size (hectares)</ThemedText>
          <TextInput
            style={styles.input}
            value={farmSize}
            onChangeText={setFarmSize}
            placeholder="250"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
          <ThemedText style={styles.label}>Established Year</ThemedText>
          <TextInput
            style={styles.input}
            value={establishedYear}
            onChangeText={setEstablishedYear}
            placeholder="1995"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Farm Type</ThemedText>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={farmType} onValueChange={setFarmType} style={styles.picker}>
            <Picker.Item label="Select farm type..." value="" />
            {farmTypes.map((type) => (
              <Picker.Item key={type.id} label={type.name} value={type.id} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  )

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <ThemedText style={styles.stepTitle}>Farming Details</ThemedText>
      <ThemedText style={styles.stepSubtitle}>What do you grow and how?</ThemedText>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Primary Crops (Select all that apply)</ThemedText>
        <View style={styles.cropsContainer}>
          {availableCrops.map((crop) => (
            <TouchableOpacity
              key={crop.id}
              style={[styles.cropChip, primaryCrops.includes(crop.id) && styles.cropChipSelected]}
              onPress={() => toggleCrop(crop.id)}
            >
              <ThemedText style={[styles.cropChipText, primaryCrops.includes(crop.id) && styles.cropChipTextSelected]}>
                {crop.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Farming Method</ThemedText>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={farmingMethod} onValueChange={setFarmingMethod} style={styles.picker}>
            <Picker.Item label="Select farming method..." value="" />
            <Picker.Item label="Organic" value="organic" />
            <Picker.Item label="Conventional" value="conventional" />
          </Picker>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Certifications (Optional)</ThemedText>
        <TextInput
          style={styles.input}
          value={certifications}
          onChangeText={setCertifications}
          placeholder="e.g., Organic Certified, Sustainable Agriculture"
          placeholderTextColor="#6B7280"
        />
      </View>
    </View>
  )

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <ThemedText style={styles.stepTitle}>Emergency Contact & Preferences</ThemedText>
      <ThemedText style={styles.stepSubtitle}>Final details to complete your profile</ThemedText>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Emergency Contact Name</ThemedText>
        <TextInput
          style={styles.input}
          value={emergencyContact}
          onChangeText={setEmergencyContact}
          placeholder="Mary Smith"
          placeholderTextColor="#6B7280"
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Emergency Phone Number</ThemedText>
        <TextInput
          style={styles.input}
          value={emergencyPhone}
          onChangeText={setEmergencyPhone}
          placeholder="+61 412 345 679"
          placeholderTextColor="#6B7280"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Preferred Units</ThemedText>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={units} onValueChange={setUnits} style={styles.picker}>
            <Picker.Item label="Metric" value="metric" />
            <Picker.Item label="Imperial" value="imperial" />
          </Picker>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Notification Preferences</ThemedText>
        <View style={styles.notificationsContainer}>
          {Object.entries(notifications).map(([key, value]) => (
            <View key={key} style={styles.notificationRow}>
              <ThemedText style={styles.notificationLabel}>
                {key === "weather" && "Weather Alerts"}
                {key === "pests" && "Pest Warnings"}
                {key === "market" && "Market Updates"}
                {key === "reminders" && "Task Reminders"}
              </ThemedText>
              <TouchableOpacity
                style={[styles.toggleSwitch, value && styles.toggleSwitchActive]}
                onPress={() => toggleNotification(key)}
              >
                <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  )


  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.card}>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
            </View>
            <ThemedText style={styles.progressText}>
              Step {currentStep} of {totalSteps}
            </ThemedText>
          </View>

          {/* Step Content */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            {currentStep > 1 && (
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <ThemedText style={styles.backButtonText}>Back</ThemedText>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.nextButton, currentStep === 1 && styles.fullWidthButton, loading && styles.disabledButton]}
              onPress={handleNext}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <ThemedText style={styles.nextButtonText}>
                  {currentStep === totalSteps ? "Complete Setup" : "Next"}
                </ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 1)", // Dark blue background
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "rgba(0, 208, 132, 0.05)",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(0, 208, 132, 0.2)",
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(0, 208, 132, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#00D084",
    borderRadius: 3,
  },
  progressText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    color: "rgba(0, 208, 132, 0.7)",
  },
  stepContainer: {
    gap: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00D084",
    textAlign: "center",
  },
  stepSubtitle: {
    fontSize: 16,
    color: "rgba(0, 208, 132, 0.7)",
    textAlign: "center",
    marginBottom: 8,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00D084",
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(0, 208, 132, 0.3)",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "#FFFFFF",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "rgba(0, 208, 132, 0.3)",
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: "#FFFFFF",
  },
  cropsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cropChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 208, 132, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  cropChipSelected: {
    borderColor: "#00D084",
    backgroundColor: "rgba(0, 208, 132, 0.1)",
  },
  cropChipText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  cropChipTextSelected: {
    color: "#00D084",
    fontWeight: "600",
  },
  notificationsContainer: {
    gap: 12,
  },
  notificationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  notificationLabel: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0, 208, 132, 0.1)",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleSwitchActive: {
    backgroundColor: "#00D084",
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    alignSelf: "flex-end",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
  },
  backButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(0, 208, 132, 0.3)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(0, 208, 132, 0.7)",
  },
  nextButton: {
    flex: 1,
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
    elevation: 6,
  },
  fullWidthButton: {
    flex: 2,
  },
  disabledButton: {
    opacity: 0.7,
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
