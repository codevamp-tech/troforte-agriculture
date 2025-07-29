import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUris, setUploadedUris] = useState<string[]>([]);

  const pickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: '*/*',
      });

      if (!result.canceled) {
        const newFiles = result.assets;
        setFiles((prev) => [...prev, ...newFiles]);
        await uploadSelectedFiles(newFiles);
      }
    } catch (error) {
      console.error('Error picking files:', error);
    }
  };

  const uploadSelectedFiles = async (selectedFiles: DocumentPicker.DocumentPickerAsset[]) => {
    setUploading(true);

    for (const file of selectedFiles) {
      try {
        const formData = new FormData();

        formData.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
        } as any);

        const res = await fetch('http://192.168.1.6:4000/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        const data = await res.json();
        console.log('✅ Uploaded:', data.file?.filename || file.name);
        setUploadedUris((prev) => [...prev, file.uri]);
      } catch (err) {
        console.error('❌ Upload error for', file.name, err);
      }
    }

    setUploading(false);
  };

  const isUploaded = (uri: string) => uploadedUris.includes(uri);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<View />}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>📁 Upload Files</ThemedText>

        <View style={styles.buttonContainer}>
          <Button title="📂 Choose File(s)" onPress={pickFiles} color="#007AFF" />
        </View>

        {uploading && (
          <View style={styles.uploadingIndicator}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.uploadingText}>Uploading...</Text>
          </View>
        )}

        <FlatList
          data={files}
          keyExtractor={(item) => item.uri}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No files selected yet.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.fileItem}>
              <Text style={styles.fileName}>📄 {item.name}</Text>
              <Text style={styles.fileType}>Type: {item.mimeType}</Text>
              {isUploaded(item.uri) && (
                <Text style={styles.uploadSuccess}>✅ Uploaded Successfully</Text>
              )}
            </View>
          )}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1D2939',
  },
  buttonContainer: {
    alignSelf: 'stretch',
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#E0F0FF',
  },
  uploadingIndicator: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  uploadingText: {
    fontSize: 14,
    color: '#444',
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  fileItem: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  fileType: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
  uploadSuccess: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '500',
    color: '#38A169',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginTop: 20,
  },
});
