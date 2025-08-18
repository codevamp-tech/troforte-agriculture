"use client"

import ParallaxScrollView from "@/components/ParallaxScrollView"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import * as DocumentPicker from "expo-document-picker"
import { useState } from "react"
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function HomeScreen() {
  const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadedUris, setUploadedUris] = useState<string[]>([])

  const pickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: "*/*",
      })
      if (!result.canceled) {
        const newFiles = result.assets
        setFiles((prev) => [...prev, ...newFiles])
        await uploadSelectedFiles(newFiles)
      }
    } catch (error) {
      console.error("Error picking files:", error)
    }
  }

  const uploadSelectedFiles = async (selectedFiles: DocumentPicker.DocumentPickerAsset[]) => {
    setUploading(true)
    console.log("inside file upload")
    for (const file of selectedFiles) {
      try {
        const formData = new FormData()
        formData.append("file", {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/octet-stream",
        } as any)

        const res = await fetch("http://192.168.29.228:4000/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        })

        const data = await res.json()
        console.log("✅ Uploaded:", data.file?.filename || file.name)
        setUploadedUris((prev) => [...prev, file.uri])
      } catch (err) {
        console.error("❌ Upload error for", file.name, err)
      }
    }
    setUploading(false)
  }

  const isUploaded = (uri: string) => uploadedUris.includes(uri)

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: "#010409", dark: "#010409" }} headerImage={<View />} >
      <ThemedView style={[styles.container, { paddingTop: 0 }]}>
        <ThemedText type="title" style={styles.title}>
          📁 Upload Files
        </ThemedText>
        <Text style={styles.subtitle}>Select documents to upload for analysis</Text>

        <TouchableOpacity style={styles.uploadButton} onPress={pickFiles} disabled={uploading}>
          <Text style={styles.buttonText}>📂 Choose File(s)</Text>
        </TouchableOpacity>

        {uploading && (
          <View style={styles.uploadingIndicator}>
            <ActivityIndicator size="small" color="#00D084" />
            <Text style={styles.uploadingText}>Uploading files...</Text>
          </View>
        )}

        {files.length > 0 ? (
          <View style={styles.fileList}>
            {files.map((file, index) => (
              <View key={file.uri} style={[styles.fileItem, index === files.length - 1 && styles.lastFileItem]}>
                <View style={styles.fileIconContainer}>
                  <Text style={styles.fileIcon}>📄</Text>
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>{file.name}</Text>
                  <Text style={styles.fileType}>{file.mimeType || "Unknown type"}</Text>
                </View>
                <View style={styles.statusContainer}>
                  {isUploaded(file.uri) ? (
                    <View style={styles.successIndicator}>
                      <Text style={styles.uploadSuccess}>✅</Text>
                    </View>
                  ) : uploading ? (
                    <ActivityIndicator size="small" color="#00D084" />
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Text style={styles.emptyStateIconText}>📁</Text>
            </View>
            <Text style={styles.emptyText}>No files selected yet</Text>
            <Text style={styles.emptyHint}>Select files to get started</Text>
          </View>
        )}
      </ThemedView>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: "#010409", // Dark background matching chat theme
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
    color: "#FFFFFF",
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
    letterSpacing: -0.5,
    textShadowColor: "#00D084",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#94A3B8",
    marginBottom: 32,
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
    lineHeight: 22,
  },
  uploadButton: {
    backgroundColor: "#00D084", // Bright green matching chat theme
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    shadowColor: "#00D084",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  uploadingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 12,
    backgroundColor: "#161B22",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  uploadingText: {
    color: "#94A3B8",
    fontSize: 14,
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
    fontWeight: "500",
  },
  fileList: {
    backgroundColor: "#161B22", // Dark card background
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#21262D",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#21262D",
  },
  lastFileItem: {
    borderBottomWidth: 0,
  },
  fileIconContainer: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0D1117",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#21262D",
  },
  fileIcon: {
    fontSize: 20,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  fileType: {
    fontSize: 13,
    color: "#94A3B8",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  statusContainer: {
    width: 32,
    alignItems: "center",
  },
  successIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#00A86B",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00D084",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  uploadSuccess: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    backgroundColor: "#161B22",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#21262D",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateIcon: {
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
  emptyStateIconText: {
    fontSize: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E2E8F0",
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  emptyHint: {
    fontSize: 15,
    color: "#64748B",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
    lineHeight: 22,
  },
})
