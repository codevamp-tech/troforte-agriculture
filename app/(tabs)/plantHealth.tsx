import AnalysisSidebar from "@/components/AnalysisSidebar";
import ImageZoomModal from "@/components/modal/ImageZoomModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import uuid from "react-native-uuid";

interface Disease {
  name: string;
  probability: number;
  description: string;
  classification: string[];
  treatments: {
    chemical: string[];
    biological: string[];
    prevention: string[];
  };
  similar_images: any[];
  infoLink: string | null;
}

interface Analysis {
  result: {
    is_healthy: { binary: boolean };
    is_plant: { probability: number };
  };
  diseases: Disease[];
}
interface RecommendedProducts {
  [key: string]: {
    loading: boolean;
    response: string | null;
  };
}

const API_BASE_URL = "http://192.168.29.228:4000/api";

export default function PlantHealthAnalyzer() {
  const [images, setImages] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [recommendedProducts, setRecommendedProducts] =
    useState<RecommendedProducts>({});
  const [loading, setLoading] = useState(false);
  const [expandedTreatments, setExpandedTreatments] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedSimilarImages, setExpandedSimilarImages] = useState<{
    [key: string]: boolean;
  }>({});
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();
  const [isViewingPreviousAnalysis, setIsViewingPreviousAnalysis] =
    useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    initializeDeviceId();
    initializeAnalysisId();
  }, []);

  useEffect(() => {
    if (deviceId) {
      loadAnalysisHistory();
    }
  }, [deviceId]);

  const initializeDeviceId = async () => {
    try {
      let storedDeviceId = await AsyncStorage.getItem("deviceId");
      if (!storedDeviceId) {
        storedDeviceId = uuid.v4() as string;
        await AsyncStorage.setItem("deviceId", storedDeviceId);
        console.log("Generated new device ID:", storedDeviceId);
      } else {
        console.log("Using existing device ID:", storedDeviceId);
      }
      setDeviceId(storedDeviceId);
    } catch (error) {
      console.error("Error initializing device ID:", error);
      setDeviceId(uuid.v4() as string);
    }
  };

  const initializeAnalysisId = async () => {
    try {
      let storedAnalysisId = await AsyncStorage.getItem("currentAnalysisId");
      if (!storedAnalysisId) {
        storedAnalysisId = uuid.v4() as string;
        await AsyncStorage.setItem("currentAnalysisId", storedAnalysisId);
      }
      setAnalysisId(storedAnalysisId);
    } catch (error) {
      console.error("Failed to initialize analysisId", error);
    }
  };

  const loadAnalysisHistory = async () => {
    if (!deviceId) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/analysis-history?deviceId=${deviceId}`
      );
      const data = await response.json();
      if (response.ok) {
        setAnalysisHistory(data.analysis || []);
      } else {
        console.error("Failed to load analysis history:", data.error);
      }
    } catch (error) {
      console.error("Error loading analysis history:", error);
    }
  };

  const loadAnalysis = async (analysisId: string) => {
    if (!deviceId) return;
    try {
      setIsLoading(true);
      setIsViewingPreviousAnalysis(true);
      const response = await fetch(
        `${API_BASE_URL}/analysisById?analysisId=${analysisId}&deviceId=${deviceId}`
      );
      const data = await response.json();
      if (response.ok) {
        // Handle single string imageUrl
        const loadedImages = data.imageUrl
          ? [
              {
                uri: data.imageUrl,
                name: data.imageUrl.split("/").pop() || "plant_image.jpg",
                type: "image/jpeg",
              },
            ]
          : [];

        setImages(loadedImages);
        setAnalysis({
          ...data.analysis,
          diseases: data.analysis.result.disease.suggestions.map((d: any) => ({
            name: d.name,
            probability: d.probability,
            description: d.details?.description,
            classification: d.details?.classification || [],
            treatments: {
              chemical: d.details?.treatment?.chemical || [],
              biological: d.details?.treatment?.biological || [],
              prevention: d.details?.treatment?.prevention || [],
            },
            similar_images: d.similar_images || [],
            infoLink: d.details?.url || null,
          })),
        });
        setAnalysisId(analysisId);
        await AsyncStorage.setItem("currentAnalysisId", analysisId);
      } else {
        Alert.alert("Error", data.error || "Failed to load analysis");
      }
    } catch (error) {
      console.error("Error loading analysis:", error);
      Alert.alert("Error", "Failed to load analysis");
    } finally {
      setIsLoading(false);
    }
  };

  const startNewAnalysis = async () => {
    const newAnalysisId = uuid.v4() as string;
    setAnalysis(null);
    setAnalysisId(newAnalysisId);
    setImages([]);
    setIsViewingPreviousAnalysis(false);
    await AsyncStorage.setItem("currentAnalysisId", newAnalysisId);
    setIsSidebarVisible(false);
  };

  const deleteAnalysis = async (analysisId: string) => {
    if (!deviceId) return;
    Alert.alert(
      "Delete Analysis",
      "Are you sure you want to delete this analysis?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/analysis`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ analysisId, deviceId }),
              });
              if (response.ok) {
                if (currentAnalysisId === analysisId) {
                  startNewAnalysis();
                }
                loadAnalysisHistory();
              } else {
                const data = await response.json();
                Alert.alert("Error", data.error || "Failed to delete analysis");
              }
            } catch (error) {
              console.error("Error deleting analysis:", error);
              Alert.alert("Error", "Failed to delete analysis");
            }
          },
        },
      ]
    );
  };

  const pickFiles = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled) {
        const selected = result.assets.map((asset) => ({
          uri: asset.uri,
          name: asset.fileName || "image.jpg",
          type: asset.type || "image/jpeg",
          mimeType: asset.type || "image/jpeg",
        }));
        setImages((prev) => [...prev, ...selected]);
      }
    } catch (err) {
      console.error("Image picking error:", err);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const analyzeImages = async () => {
    if (images.length === 0) {
      Alert.alert("No Images", "Please select at least one image to analyze.");
      return;
    }

    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append("images", {
        uri: image.uri,
        name: image.name || `plant_${index}.jpg`,
        type: "image/jpeg",
      } as any);
    });

    formData.append("language", "en");
    formData.append("analysisId", analysisId);
    formData.append("deviceId", deviceId);

    try {
      setLoading(true);
      const response = await fetch(
        "http://192.168.29.228:4000/api/plant-health/analyze",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-type": "multipart/form-data",
          },
        }
      );

      const json = await response.json();
      const responseData = json.data;
      console.log("responseData", responseData);
      setAnalysis({
        ...responseData,
        diseases: responseData.result.disease.suggestions.map((d: any) => ({
          name: d.name,
          probability: d.probability,
          description: d.details?.description,
          classification: d.details?.classification || [],
          treatments: {
            chemical: d.details?.treatment?.chemical || [],
            biological: d.details?.treatment?.biological || [],
            prevention: d.details?.treatment?.prevention || [],
          },
          similar_images: d.similar_images || [],
          infoLink: d.details?.url || null,
        })),
      });

      loadAnalysisHistory();
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Error",
        "Something went wrong during analysis. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleTreatments = (diseaseIndex: number) => {
    const key = `treatments_${diseaseIndex}`;
    setExpandedTreatments((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleSimilarImages = (diseaseIndex: number) => {
    const key = `similar_${diseaseIndex}`;
    setExpandedSimilarImages((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const fetchRecommendedProducts = async (diseaseName: string) => {
    const diseaseKey = `disease_${diseaseName}`;

    setRecommendedProducts((prev) => ({
      ...prev,
      [diseaseKey]: {
        loading: true,
        response: null,
      },
    }));

    try {
      const response = await fetch(
        "http://192.168.29.228:4000/api/chat?recommend=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `my plant has ${diseaseName}. recommend me products`,
          }),
        }
      );

      const textData = await response.text();
      const jsonData = JSON.parse(textData);
      const recommendation = jsonData.recommendation || textData;
      console.log("recommendation", recommendation);

      // Extract product blocks
      const productBlocks =
        recommendation.match(
          /- \*\*Recommended Product:\*\* (.*?)\s+- \*\*Why It Works:\*\* (.*?)\s+- \*\*Application Advice:\*\* (.*?)(?=\n\n###|\n\n$)/gs
        ) || [];

      // Format each product block
      // In your fetchRecommendedProducts function:
      const formattedResponse = recommendation
        .replace(/\*\*Recommended Product:\*\* (.*?)\s+/g, "⭐ $1\n")
        .replace(/\*\*Why It Works:\*\* (.*?)\s+/g, "🔍 Why It Works: $1\n")
        .replace(
          /\*\*Application Advice:\*\* (.*?)(\n|$)/g,
          "💡 Application Advice: $1"
        )
        .trim();

      setRecommendedProducts((prev) => ({
        ...prev,
        [diseaseKey]: {
          loading: false,
          response:
            formattedResponse || "No specific product recommendations found",
        },
      }));
    } catch (error) {
      console.error("Error fetching recommended products:", error);
      setRecommendedProducts((prev) => ({
        ...prev,
        [diseaseKey]: {
          loading: false,
          response: "Failed to load recommendations. Please try again.",
        },
      }));
    }
  };

  const renderTreatmentSection = (
    treatments: any,
    type: string,
    diseaseIndex: number
  ) => {
    if (treatments[type].length === 0) return null;

    return (
      <View style={styles.treatmentSection}>
        <Text style={styles.treatmentTypeTitle}>
          {type.charAt(0).toUpperCase() + type.slice(1)} Treatment
        </Text>
        {treatments[type].map((item: string, idx: number) => (
          <View key={idx} style={styles.treatmentItem}>
            <Text style={styles.treatmentBullet}>•</Text>
            <Text style={styles.treatmentText}>{item}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#010409" />
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => setIsSidebarVisible(true)}
              style={{ marginRight: 12 }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 24 }}>☰</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Plant Health</Text>
              <Text style={styles.headerSubtitle}>
                Upload and analyze plant images for health assessment
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Upload Section */}
          {!isViewingPreviousAnalysis && (
            <View style={styles.uploadSection}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={pickFiles}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>📷 Pick Images</Text>
              </TouchableOpacity>

              {/* Image Grid */}
              {images.length > 0 && (
                <View style={styles.imageContainer}>
                  <Text style={styles.sectionTitle}>
                    Selected Images ({images.length})
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.imageScrollView}
                  >
                    {images.map((img, idx) => (
                      <View key={idx} style={styles.imageWrapper}>
                        <Image
                          source={{ uri: img.uri }}
                          style={styles.imageThumb}
                        />
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeImage(idx)}
                        >
                          <Text style={styles.removeButtonText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Analyze Button */}
              {images.length > 0 && (
                <TouchableOpacity
                  style={[
                    styles.analyzeButton,
                    loading && styles.disabledButton,
                  ]}
                  onPress={analyzeImages}
                  disabled={loading}
                >
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={styles.primaryButtonText}>Analyzing...</Text>
                    </View>
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      🔍 Analyze Plant Health
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}

          {isViewingPreviousAnalysis && images.length > 0 && (
            <View style={styles.imageContainer}>
              <Text style={styles.sectionTitle}>Analysis Image</Text>
              <View style={styles.imageScrollView}>
                {images.map((img, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setZoomedImage(img.uri)}
                  >
                    <View key={idx} style={styles.imageWrapper}>
                      <Image
                        source={{ uri: img.uri }}
                        style={styles.imageThumb}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Results Section */}
          {analysis && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>📊 Analysis Results</Text>

              {/* Health Status Card */}
              <View style={styles.healthStatusCard}>
                <View style={styles.healthStatusHeader}>
                  <Text style={styles.healthLabel}>Plant Health Status</Text>
                  <View
                    style={[
                      styles.healthBadge,
                      analysis.result?.is_healthy?.binary
                        ? styles.healthyBadge
                        : styles.unhealthyBadge,
                    ]}
                  >
                    <Text style={styles.healthBadgeText}>
                      {analysis.result?.is_healthy?.binary
                        ? "✅ Healthy"
                        : "⚠️ Unhealthy"}
                    </Text>
                  </View>
                </View>
                <Text style={styles.confidenceText}>
                  Confidence:{" "}
                  {(analysis.result?.is_plant?.probability * 100).toFixed(1)}%
                </Text>
              </View>

              {/* Disease Analysis */}
              {analysis.diseases?.length > 0 ? (
                <View style={styles.diseasesSection}>
                  <Text style={styles.sectionTitle}>🦠 Detected Issues</Text>
                  {analysis.diseases.map((disease: Disease, i: number) => (
                    <View key={i} style={styles.diseaseCard}>
                      <View style={styles.diseaseHeader}>
                        <Text style={styles.diseaseName}>{disease.name}</Text>
                        <View style={styles.probabilityBadge}>
                          <Text style={styles.probabilityText}>
                            {(disease.probability * 100).toFixed(1)}%
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.diseaseDescription}>
                        {disease.description}
                      </Text>

                      {disease.classification.length > 0 && (
                        <View style={styles.classificationContainer}>
                          <Text style={styles.classificationLabel}>
                            Classification:
                          </Text>
                          <Text style={styles.classificationText}>
                            {disease.classification.join(", ")}
                          </Text>
                        </View>
                      )}

                      {/* Treatments Dropdown */}
                      {(disease.treatments.chemical.length > 0 ||
                        disease.treatments.biological.length > 0 ||
                        disease.treatments.prevention.length > 0) && (
                        <View style={styles.dropdownSection}>
                          <TouchableOpacity
                            style={styles.dropdownHeader}
                            onPress={() => toggleTreatments(i)}
                          >
                            <Text style={styles.dropdownTitle}>
                              💊 Treatment Options
                            </Text>
                            <Text style={styles.dropdownIcon}>
                              {expandedTreatments[`treatments_${i}`]
                                ? "▼"
                                : "▶"}
                            </Text>
                          </TouchableOpacity>

                          {expandedTreatments[`treatments_${i}`] && (
                            <ScrollView
                              style={styles.dropdownContent}
                              nestedScrollEnabled={true}
                            >
                              {renderTreatmentSection(
                                disease.treatments,
                                "chemical",
                                i
                              )}
                              {renderTreatmentSection(
                                disease.treatments,
                                "biological",
                                i
                              )}
                              {renderTreatmentSection(
                                disease.treatments,
                                "prevention",
                                i
                              )}
                            </ScrollView>
                          )}
                        </View>
                      )}

                      {/* Similar Images Dropdown */}
                      {disease.similar_images.length > 0 && (
                        <View style={styles.dropdownSection}>
                          <TouchableOpacity
                            style={styles.dropdownHeader}
                            onPress={() => toggleSimilarImages(i)}
                          >
                            <Text style={styles.dropdownTitle}>
                              🖼️ Similar Images
                            </Text>
                            <Text style={styles.dropdownIcon}>
                              {expandedSimilarImages[`similar_${i}`]
                                ? "▼"
                                : "▶"}
                            </Text>
                          </TouchableOpacity>

                          {expandedSimilarImages[`similar_${i}`] && (
                            <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              style={styles.similarImagesContainer}
                            >
                              {disease.similar_images.map(
                                (img: any, idx: number) => (
                                  <TouchableOpacity
                                    key={idx}
                                    onPress={() => setZoomedImage(img.url)}
                                  >
                                    <Image
                                      key={idx}
                                      source={{ uri: img.url_small }}
                                      style={styles.similarImage}
                                    />
                                  </TouchableOpacity>
                                )
                              )}
                            </ScrollView>
                          )}
                        </View>
                      )}
                      {/* Recommendeded products*/}
                      <View style={styles.dropdownSection}>
                        <TouchableOpacity
                          style={styles.dropdownHeader}
                          onPress={() => fetchRecommendedProducts(disease.name)}
                        >
                          <Text style={styles.dropdownTitle}>
                            🛍️ Recommended Products
                          </Text>
                          <Text style={styles.dropdownIcon}>
                            {recommendedProducts[`disease_${disease.name}`]
                              ?.response
                              ? "▼"
                              : "▶"}
                          </Text>
                        </TouchableOpacity>

                        {recommendedProducts[`disease_${disease.name}`]
                          ?.loading ? (
                          <View style={styles.loadingProducts}>
                            <ActivityIndicator size="small" color="#00D084" />
                            <Text style={styles.loadingProductsText}>
                              Finding best products...
                            </Text>
                          </View>
                        ) : (
                          recommendedProducts[`disease_${disease.name}`]
                            ?.response && (
                            <ScrollView
                              style={styles.dropdownContent}
                              nestedScrollEnabled={true}
                            >
                              <Text style={styles.productText}>
                                {
                                  recommendedProducts[`disease_${disease.name}`]
                                    .response
                                }
                              </Text>
                            </ScrollView>
                          )
                        )}
                      </View>

                      {/* Learn More Link */}
                      {disease.infoLink && (
                        <TouchableOpacity
                          style={styles.learnMoreButton}
                          onPress={() => Linking.openURL(disease.infoLink!)}
                        >
                          <Text style={styles.learnMoreText}>
                            📚 Learn More
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.healthyPlantCard}>
                  <Text style={styles.healthyPlantIcon}>🌱</Text>
                  <Text style={styles.healthyPlantTitle}>Great News!</Text>
                  <Text style={styles.healthyPlantText}>
                    No diseases detected. Your plant looks healthy!
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Empty State */}
          {!analysis && !loading && images.length === 0 && (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Text style={styles.emptyStateIconText}>🌿</Text>
              </View>
              <Text style={styles.emptyStateTitle}>Plant Health Analysis</Text>
              <Text style={styles.emptyStateText}>
                Upload photos of your plants to get instant health analysis and
                treatment recommendations
              </Text>
            </View>
          )}
        </ScrollView>

        <AnalysisSidebar
          isVisible={isSidebarVisible}
          onClose={() => setIsSidebarVisible(false)}
          analysisHistory={analysisHistory}
          currentAnalysisId={analysisId}
          onLoadAnalysis={loadAnalysis}
          onDeleteAnalysis={deleteAnalysis}
          onStartNewAnalysis={startNewAnalysis}
        />
        <ImageZoomModal
          visible={!!zoomedImage}
          imageUrl={zoomedImage}
          onClose={() => setZoomedImage(null)}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#010409",
    marginTop: 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 20 : 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#21262D",
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
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  content: {
    padding: 20,
  },
  uploadSection: {
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: "#00D084",
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#00D084",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  analyzeButton: {
    backgroundColor: "#00A86B",
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#00D084",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: "#30363D",
    shadowOpacity: 0,
    elevation: 0,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  imageContainer: {
    backgroundColor: "#161B22",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  imageScrollView: {
    marginTop: 8,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 12,
  },
  imageThumb: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#21262D",
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  resultContainer: {
    marginTop: 24,
  },
  resultTitle: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 20,
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
  healthStatusCard: {
    backgroundColor: "#161B22",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  healthStatusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  healthLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  healthBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  healthyBadge: {
    backgroundColor: "#00A86B",
  },
  unhealthyBadge: {
    backgroundColor: "#EF4444",
  },
  healthBadgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  confidenceText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },
  diseasesSection: {
    marginTop: 8,
  },
  diseaseCard: {
    backgroundColor: "#161B22",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  diseaseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 12,
  },
  probabilityBadge: {
    backgroundColor: "#00D084",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  probabilityText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  diseaseDescription: {
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 20,
    marginBottom: 12,
  },
  classificationContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  classificationLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
    marginRight: 8,
  },
  classificationText: {
    fontSize: 14,
    color: "#94A3B8",
    flex: 1,
  },
  dropdownSection: {
    marginBottom: 16,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0D1117",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  dropdownTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  dropdownIcon: {
    fontSize: 14,
    color: "#00D084",
    fontWeight: "600",
  },
  dropdownContent: {
    backgroundColor: "#0D1117",
    borderRadius: 12,
    marginTop: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#21262D",
    maxHeight: 200, // Limit height and enable scrolling
  },
  treatmentSection: {
    marginBottom: 16,
  },
  treatmentTypeTitle: {
    fontSize: 15,
    color: "#00D084",
    fontWeight: "600",
    marginBottom: 8,
  },
  treatmentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  treatmentBullet: {
    color: "#00D084",
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  treatmentText: {
    fontSize: 14,
    color: "#94A3B8",
    flex: 1,
    lineHeight: 20,
  },
  similarImagesContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  similarImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  learnMoreButton: {
    backgroundColor: "#00D084",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 12,
  },
  learnMoreText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  healthyPlantCard: {
    backgroundColor: "#161B22",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#00D084",
    shadowColor: "#00D084",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  healthyPlantIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  healthyPlantTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 8,
  },
  healthyPlantText: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 22,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    fontSize: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 24,
  },

  loadingProducts: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#0D1117",
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  loadingProductsText: {
    marginLeft: 12,
    color: "#94A3B8",
    fontSize: 14,
  },

  productItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  productBullet: {
    color: "#00D084",
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  productText: {
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 20,
  },
});
