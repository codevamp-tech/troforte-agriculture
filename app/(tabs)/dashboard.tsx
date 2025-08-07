"use client"

import { useFocusEffect } from "@react-navigation/native"
import { useCallback, useState } from "react"
import {
    ActivityIndicator,
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"

export default function Dashboard() {
  const [weather, setWeather] = useState<any>(null)
  const [news, setNews] = useState<any[]>([])
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [newsLoading, setNewsLoading] = useState(false)

  useFocusEffect(
  useCallback(() => {
    let isActive = true
    const fetchData = async () => {
      if (isActive) {
        setWeatherLoading(true)
        setNewsLoading(true)
      }

      try {
        // Weather fetch
        const weatherRes = await fetch(
          "https://api.weatherapi.com/v1/current.json?key=baab7ac143cb4e1a8f570642241505&q=Sydney&aqi=no"
        )
        const weatherData = await weatherRes.json()
        if (isActive && weatherData?.current && weatherData?.location) {
          setWeather(weatherData)
        }
        setWeatherLoading(false)

        // News fetch
        const newsRes = await fetch("http://192.168.1.17:4000/api/news/agriculture")
        const newsData = await newsRes.json()
        if (isActive && newsData?.success) {
          setNews(newsData.data)
        }
      } catch (e: any) {
        console.log("Error:", e.message)
      } finally {
        if (isActive) {
          setWeatherLoading(false)
          setNewsLoading(false)
        }
      }
    }

    fetchData()
    return () => {
      isActive = false
    }
  }, [])
)


  const handleNewsPress = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err))
  }

  if (weatherLoading  || !weather || !weather.current || !weather.location) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#010409" />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#00D084" />
            <Text style={styles.loadingText}>Loading dashboard...</Text>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  const { current, location } = weather

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#010409" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Good day! 👋</Text>
          <Text style={styles.dashboardTitle}>Your Dashboard</Text>
        </View>

        {/* Weather Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionIcon}>🌤️</Text>
              <Text style={styles.sectionTitle}>Current Weather</Text>
            </View>
            <Text style={styles.locationText}>{location.name}</Text>
          </View>

          <View style={styles.weatherCard}>
            <View style={styles.weatherMainInfo}>
              <View style={styles.weatherIconContainer}>
                <Image source={{ uri: `https:${current.condition.icon}` }} style={styles.weatherIcon} />
              </View>
              <View style={styles.weatherTempContainer}>
                <Text style={styles.temperature}>{current.temp_c}°</Text>
                <Text style={styles.feelsLike}>Feels like {current.feelslike_c}°</Text>
                <Text style={styles.weatherCondition}>{current.condition.text}</Text>
              </View>
            </View>

            <View style={styles.weatherDetails}>
              <View style={styles.weatherDetailRow}>
                <View style={styles.weatherDetailItem}>
                  <Text style={styles.weatherDetailIcon}>💨</Text>
                  <Text style={styles.weatherDetailLabel}>Wind</Text>
                  <Text style={styles.weatherDetailValue}>
                    {current.wind_kph} km/h {current.wind_dir}
                  </Text>
                </View>
                <View style={styles.weatherDetailItem}>
                  <Text style={styles.weatherDetailIcon}>💧</Text>
                  <Text style={styles.weatherDetailLabel}>Humidity</Text>
                  <Text style={styles.weatherDetailValue}>{current.humidity}%</Text>
                </View>
              </View>
              <View style={styles.weatherDetailRow}>
                <View style={styles.weatherDetailItem}>
                  <Text style={styles.weatherDetailIcon}>🔆</Text>
                  <Text style={styles.weatherDetailLabel}>UV Index</Text>
                  <Text style={styles.weatherDetailValue}>{current.uv}</Text>
                </View>
                <View style={styles.weatherDetailItem}>
                  <Text style={styles.weatherDetailIcon}>📍</Text>
                  <Text style={styles.weatherDetailLabel}>Location</Text>
                  <Text style={styles.weatherDetailValue}>
                    {location.region}, {location.country}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* News Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionIcon}>📰</Text>
              <Text style={styles.sectionTitle}>Agriculture News</Text>
            </View>
          </View>

          {newsLoading ? (
            <View style={styles.newsLoadingContainer}>
              <ActivityIndicator size="small" color="#00D084" />
              <Text style={styles.newsLoadingText}>Loading latest news...</Text>
            </View>
          ) : news.length === 0 ? (
            <View style={styles.noNewsContainer}>
              <View style={styles.noNewsIconContainer}>
                <Text style={styles.noNewsIcon}>📰</Text>
              </View>
              <Text style={styles.noNewsText}>No news articles found</Text>
              <Text style={styles.noNewsSubtext}>Check back later for updates</Text>
            </View>
          ) : (
            <View style={styles.newsContainer}>
              {news.map((article, index) => (
                <TouchableOpacity
                  key={article.id || index}
                  style={styles.newsCard}
                  onPress={() => handleNewsPress(article.href)}
                  activeOpacity={0.8}
                >
                  {article.image && (
                    <View style={styles.newsImageContainer}>
                      <Image source={{ uri: article.image }} style={styles.newsImage} resizeMode="cover" />
                    </View>
                  )}
                  <View style={styles.newsContent}>
                    <Text style={styles.newsTitle} numberOfLines={2}>
                      {article.title}
                    </Text>
                    <Text style={styles.newsDescription} numberOfLines={3}>
                      {article.description?.substring(0, 150)}...
                    </Text>
                    <View style={styles.newsFooter}>
                      <Text style={styles.newsSource}>{article.source?.domain || "Unknown"}</Text>
                      <Text style={styles.newsDate}>{new Date(article.published_at).toLocaleDateString()}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#010409", // Dark background matching chat theme
  },
  container: {
    flex: 1,
    backgroundColor: "#010409", // Dark background matching chat theme
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingCard: {
    backgroundColor: "#161B22", // Darker card background
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#21262D",
    shadowColor: "#00D084",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#94A3B8", // Light text matching chat theme
    fontWeight: "500",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: "#94A3B8", // Lighter gray for secondary text
    fontWeight: "500",
  },
  dashboardTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF", // White text
    marginTop: 4,
    letterSpacing: -0.5,
    textShadowColor: "#00D084",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF", // White text
  },
  locationText: {
    fontSize: 14,
    color: "#94A3B8", // Lighter gray for secondary text
    marginLeft: 36,
    fontWeight: "500",
  },
  weatherCard: {
    backgroundColor: "#161B22", // Darker card background
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#21262D",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  weatherMainInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  weatherIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#0D1117", // Darker background for icon
    borderWidth: 1,
    borderColor: "#21262D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  weatherIcon: {
    width: 64,
    height: 64,
  },
  weatherTempContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: "800",
    color: "#FFFFFF", // White text
    lineHeight: 56,
  },
  feelsLike: {
    fontSize: 14,
    color: "#94A3B8", // Lighter gray for secondary text
    marginBottom: 4,
    fontWeight: "500",
  },
  weatherCondition: {
    fontSize: 16,
    color: "#E2E8F0", // Light text
    fontWeight: "600",
    textTransform: "capitalize",
  },
  weatherDetails: {
    backgroundColor: "#0D1117", // Main background color for details section
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  weatherDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  weatherDetailItem: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  weatherDetailIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  weatherDetailLabel: {
    fontSize: 12,
    color: "#94A3B8", // Lighter gray for secondary text
    fontWeight: "500",
    marginBottom: 2,
  },
  weatherDetailValue: {
    fontSize: 13,
    color: "#FFFFFF", // White text
    fontWeight: "600",
    textAlign: "center",
  },
  newsContainer: {
    marginTop: 8,
  },
  newsLoadingContainer: {
    backgroundColor: "#161B22", // Darker card background
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#21262D",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  newsLoadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#94A3B8", // Light text
    fontWeight: "500",
  },
  noNewsContainer: {
    backgroundColor: "#161B22", // Darker card background
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#21262D",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  noNewsIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0D1117",
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
  noNewsIcon: {
    fontSize: 32,
  },
  noNewsText: {
    fontSize: 18,
    color: "#FFFFFF", // White text
    fontWeight: "600",
    marginBottom: 8,
  },
  noNewsSubtext: {
    fontSize: 15,
    color: "#94A3B8", // Lighter gray for secondary text
    fontWeight: "400",
  },
  newsCard: {
    backgroundColor: "#161B22", // Darker card background
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#21262D",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  newsImageContainer: {
    height: 200,
    backgroundColor: "#0D1117", // Darker background for image placeholder
  },
  newsImage: {
    width: "100%",
    height: "100%",
  },
  newsContent: {
    padding: 20,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF", // White text
    lineHeight: 24,
    marginBottom: 12,
  },
  newsDescription: {
    fontSize: 14,
    color: "#94A3B8", // Lighter gray for secondary text
    lineHeight: 20,
    marginBottom: 16,
    fontWeight: "400",
  },
  newsFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#21262D", // Darker border
  },
  newsSource: {
    fontSize: 12,
    color: "#00D084", // Green accent for source
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  newsDate: {
    fontSize: 12,
    color: "#94A3B8", // Lighter gray for secondary text
    fontWeight: "500",
  },
})
