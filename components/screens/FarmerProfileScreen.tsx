import React, { useState } from "react"
import {
    Alert,
    Platform,
    // SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"


interface FarmerProfileScreenProps {
  onBack: () => void
}

export default function FarmerProfileScreen({ onBack }: FarmerProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    // Personal Information
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "+61 412 345 678",
    dateOfBirth: "1985-03-15",
    
    // Farm Information
    farmName: "Smith Family Farm",
    farmAddress: "123 Rural Road, Wagga Wagga, NSW 2650",
    farmSize: "250",
    farmType: "mixed",
    establishedYear: "1995",
    
    // Farming Details
    primaryCrops: ["wheat", "barley", "canola"],
    farmingMethod: "conventional",
    certifications: ["Organic Certified", "Sustainable Agriculture"],
    
    // Contact & Emergency
    emergencyContact: "Mary Smith",
    emergencyPhone: "+61 412 345 679",
    
    // Preferences
    units: "metric",
    language: "english",
    notifications: {
      weather: true,
      pests: true,
      market: false,
      reminders: true,
    }
  })

  const [tempData, setTempData] = useState(profileData)

  const farmTypes = [
    { id: "crop", name: "Crop Farming", icon: "🌾" },
    { id: "livestock", name: "Livestock", icon: "🐄" },
    { id: "mixed", name: "Mixed Farming", icon: "🚜" },
    { id: "organic", name: "Organic", icon: "🌱" },
  ]

  const availableCrops = [
    { id: "wheat", name: "Wheat", icon: "🌾" },
    { id: "barley", name: "Barley", icon: "🌾" },
    { id: "corn", name: "Corn", icon: "🌽" },
    { id: "rice", name: "Rice", icon: "🌾" },
    { id: "canola", name: "Canola", icon: "🌻" },
    { id: "cotton", name: "Cotton", icon: "☁️" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }))
  }

  const handleCropToggle = (cropId: string) => {
    setTempData(prev => ({
      ...prev,
      primaryCrops: prev.primaryCrops.includes(cropId)
        ? prev.primaryCrops.filter(c => c !== cropId)
        : [...prev.primaryCrops, cropId]
    }))
  }

  const handleNotificationToggle = (type: string) => {
    setTempData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }))
  }

  const handleSave = () => {
    setProfileData(tempData)
    setIsEditing(false)
    Alert.alert("Success", "Profile updated successfully!")
  }

  const handleCancel = () => {
    setTempData(profileData)
    setIsEditing(false)
  }

  const renderViewMode = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
            </Text>
          </View>
          <TouchableOpacity style={styles.cameraButton}>
            <Text style={styles.cameraIcon}>📷</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {profileData.firstName} {profileData.lastName}
          </Text>
          <Text style={styles.profileSubtitle}>{profileData.farmName}</Text>
          <Text style={styles.profileLocation}>{profileData.farmAddress.split(',')[1]?.trim()}</Text>
        </View>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Personal Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{profileData.firstName} {profileData.lastName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{profileData.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{profileData.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoValue}>{new Date(profileData.dateOfBirth).toLocaleDateString()}</Text>
          </View>
        </View>
      </View>

      {/* Farm Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚜 Farm Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Farm Name</Text>
            <Text style={styles.infoValue}>{profileData.farmName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{profileData.farmAddress}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Farm Size</Text>
            <Text style={styles.infoValue}>{profileData.farmSize} hectares</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Farm Type</Text>
            <Text style={styles.infoValue}>
              {farmTypes.find(t => t.id === profileData.farmType)?.icon} {farmTypes.find(t => t.id === profileData.farmType)?.name}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Established</Text>
            <Text style={styles.infoValue}>{profileData.establishedYear}</Text>
          </View>
        </View>
      </View>

      {/* Farming Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌾 Farming Details</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Primary Crops</Text>
            <View style={styles.cropsContainer}>
              {profileData.primaryCrops.map(cropId => {
                const crop = availableCrops.find(c => c.id === cropId)
                return (
                  <View key={cropId} style={styles.cropBadge}>
                    <Text style={styles.cropBadgeText}>{crop?.icon} {crop?.name}</Text>
                  </View>
                )
              })}
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Farming Method</Text>
            <Text style={styles.infoValue}>
              {profileData.farmingMethod === 'organic' ? '🌱 Organic' : '🧪 Conventional'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Certifications</Text>
            <View style={styles.certificationsContainer}>
              {profileData.certifications.map((cert, index) => (
                <View key={index} style={styles.certificationBadge}>
                  <Text style={styles.certificationText}>🏆 {cert}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Emergency Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚨 Emergency Contact</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contact Name</Text>
            <Text style={styles.infoValue}>{profileData.emergencyContact}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone Number</Text>
            <Text style={styles.infoValue}>{profileData.emergencyPhone}</Text>
          </View>
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Preferences</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Units</Text>
            <Text style={styles.infoValue}>{profileData.units === 'metric' ? '📏 Metric' : '📐 Imperial'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Language</Text>
            <Text style={styles.infoValue}>🌐 English</Text>
          </View>
        </View>
      </View>

      {/* Notification Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔔 Notifications</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Weather Alerts</Text>
            <Text style={styles.infoValue}>{profileData.notifications.weather ? '✅ Enabled' : '❌ Disabled'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pest Warnings</Text>
            <Text style={styles.infoValue}>{profileData.notifications.pests ? '✅ Enabled' : '❌ Disabled'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Market Updates</Text>
            <Text style={styles.infoValue}>{profileData.notifications.market ? '✅ Enabled' : '❌ Disabled'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Task Reminders</Text>
            <Text style={styles.infoValue}>{profileData.notifications.reminders ? '✅ Enabled' : '❌ Disabled'}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )

  const renderEditMode = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Personal Information</Text>
        <View style={styles.editCard}>
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={styles.input}
                value={tempData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                placeholder="First Name"
                placeholderTextColor="#6B7280"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={tempData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                placeholder="Last Name"
                placeholderTextColor="#6B7280"
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={tempData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Email"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.input}
              value={tempData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="Phone"
              placeholderTextColor="#6B7280"
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </View>

      {/* Farm Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚜 Farm Information</Text>
        <View style={styles.editCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Farm Name</Text>
            <TextInput
              style={styles.input}
              value={tempData.farmName}
              onChangeText={(value) => handleInputChange('farmName', value)}
              placeholder="Farm Name"
              placeholderTextColor="#6B7280"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Farm Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={tempData.farmAddress}
              onChangeText={(value) => handleInputChange('farmAddress', value)}
              placeholder="Farm Address"
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Farm Size (hectares)</Text>
              <TextInput
                style={styles.input}
                value={tempData.farmSize}
                onChangeText={(value) => handleInputChange('farmSize', value)}
                placeholder="250"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Established Year</Text>
              <TextInput
                style={styles.input}
                value={tempData.establishedYear}
                onChangeText={(value) => handleInputChange('establishedYear', value)}
                placeholder="1995"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Farm Type</Text>
            <View style={styles.farmTypeSelector}>
              {farmTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[styles.farmTypeOption, tempData.farmType === type.id && styles.selectedFarmType]}
                  onPress={() => handleInputChange('farmType', type.id)}
                >
                  <Text style={styles.farmTypeIcon}>{type.icon}</Text>
                  <Text style={[styles.farmTypeText, tempData.farmType === type.id && styles.selectedFarmTypeText]}>
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Primary Crops */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌾 Primary Crops</Text>
        <View style={styles.editCard}>
          <View style={styles.cropsGrid}>
            {availableCrops.map((crop) => (
              <TouchableOpacity
                key={crop.id}
                style={[styles.cropSelector, tempData.primaryCrops.includes(crop.id) && styles.selectedCrop]}
                onPress={() => handleCropToggle(crop.id)}
              >
                <Text style={styles.cropIcon}>{crop.icon}</Text>
                <Text style={[styles.cropText, tempData.primaryCrops.includes(crop.id) && styles.selectedCropText]}>
                  {crop.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Emergency Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚨 Emergency Contact</Text>
        <View style={styles.editCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contact Name</Text>
            <TextInput
              style={styles.input}
              value={tempData.emergencyContact}
              onChangeText={(value) => handleInputChange('emergencyContact', value)}
              placeholder="Emergency Contact Name"
              placeholderTextColor="#6B7280"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={tempData.emergencyPhone}
              onChangeText={(value) => handleInputChange('emergencyPhone', value)}
              placeholder="Emergency Phone"
              placeholderTextColor="#6B7280"
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </View>

      {/* Notification Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔔 Notification Settings</Text>
        <View style={styles.editCard}>
          {Object.entries(tempData.notifications).map(([key, value]) => (
            <View key={key} style={styles.notificationRow}>
              <Text style={styles.notificationLabel}>
                {key === 'weather' && '🌦️ Weather Alerts'}
                {key === 'pests' && '🐛 Pest Warnings'}
                {key === 'market' && '📈 Market Updates'}
                {key === 'reminders' && '⏰ Task Reminders'}
              </Text>
              <TouchableOpacity
                style={[styles.toggleSwitch, value && styles.toggleSwitchActive]}
                onPress={() => handleNotificationToggle(key)}
              >
                <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#010409" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Farmer Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your profile and farm information</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          <Text style={styles.editButtonText}>{isEditing ? '💾 Save' : '✏️ Edit'}</Text>
        </TouchableOpacity>
      </View>

      {isEditing && (
        <View style={styles.editActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}

      {isEditing ? renderEditMode() : renderViewMode()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#010409",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 20 : 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#21262D",
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: "#00D084",
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 2,
  },
  editButton: {
    backgroundColor: "#00D084",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  editActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#21262D",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#374151",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#00D084",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161B22",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#00D084",
    justifyContent: "center",
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
  avatarText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  cameraButton: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#161B22",
  },
  cameraIcon: {
    fontSize: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 16,
    color: "#00D084",
    fontWeight: "600",
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 14,
    color: "#94A3B8",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#161B22",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  editCard: {
    backgroundColor: "#161B22",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#21262D",
  },
  infoLabel: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },
  cropsContainer: {
    flex: 2,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 6,
  },
  cropBadge: {
    backgroundColor: "#00D084",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cropBadgeText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  certificationsContainer: {
    flex: 2,
    alignItems: "flex-end",
    gap: 6,
  },
  certificationBadge: {
    backgroundColor: "#F59E0B",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  certificationText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 16,
    flex: 1,
  },
  inputRow: {
    flexDirection: "row",
    gap: 16,
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
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  farmTypeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  farmTypeOption: {
    backgroundColor: "#0D1117",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#21262D",
    minWidth: "47%",
  },
  selectedFarmType: {
    backgroundColor: "#00D084",
    borderColor: "#00D084",
  },
  farmTypeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  farmTypeText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  selectedFarmTypeText: {
    color: "#FFFFFF",
  },
  cropsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cropSelector: {
    backgroundColor: "#0D1117",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#21262D",
    width: "30%",
  },
  selectedCrop: {
    backgroundColor: "#00D084",
    borderColor: "#00D084",
  },
  cropIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  cropText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
    textAlign: "center",
  },
  selectedCropText: {
    color: "#FFFFFF",
  },
  notificationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#21262D",
  },
  notificationLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#374151",
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
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
  },
  toggleThumbActive: {
    alignSelf: "flex-end",
  },
})
