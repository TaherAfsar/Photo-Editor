import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform, Linking, Alert } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
const { SaveFormat } = ImageManipulator;

export default function PhotoEditorScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const requestPermission = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status === 'granted') {
        pickImage();
      } else if (status === 'denied') {
        Alert.alert(
          'Permission Required',
          'This app needs access to your photos to edit them. Please enable it in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => Platform.OS === 'ios' ? Linking.openURL('app-settings:') : Linking.openSettings() 
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      Alert.alert('Error', 'Failed to request permission');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
        aspect: [4, 3],
        exif: false,
        base64: false,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        if (!selectedImage.uri) {
          throw new Error('No image URI received');
        }
  
        // Pre-process the image to reduce size
        const processedResult = await manipulateAsync(
          selectedImage.uri,
          [{ resize: { width: 1200 } }],
          { compress: 0.8, format: SaveFormat.JPEG }
        );
  
        router.push({
          pathname: '/editor',
          params: { 
            imageUri: processedResult.uri,
            width: processedResult.width,
            height: processedResult.height
          }
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        'Error',
        'Failed to load the selected image. Please try a smaller image.',
        [{ text: 'OK' }]
      );
    }
  };

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to gallery. Please enable permissions in settings.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="image-outline" size={80} color="#2196F3" />
        <Text style={styles.title}>Photo Editor</Text>
        <Text style={styles.subtitle}>Transform your photos with powerful editing tools</Text>
        
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Select Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  }
});

async function manipulateAsync(uri: string, actions: { resize: { width: number; }; }[], options: { compress: number; format: any; }) {
  try {
    const result = await ImageManipulator.manipulateAsync(uri, actions, options);
    return result;
  } catch (error) {
    console.error('Error manipulating image:', error);
    throw error;
  }
}

// function manipulateAsync(uri: string, arg1: { resize: { width: number; }; }[], arg2: { compress: number; format: any; }) {
//   throw new Error('Function not implemented.');
// }
