import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';
import EditingTools from './components/EditingTools';
import FiltersList from './components/FiltersList';
import AdjustmentSlider from './components/AdjustmentSlider';
import SaveButton from './components/SaveButton';
import { applyFilter } from './utils/filters';
import { adjustImage } from './utils/adjustments';
import * as FileSystem from 'expo-file-system';

export default function EditorScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('filters');
  const [currentFilter, setCurrentFilter] = useState('normal');
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
  });
  const [currentAdjustment, setCurrentAdjustment] = useState('brightness');
  const [savingImage, setSavingImage] = useState(false);

  useEffect(() => {
    const prepareImage = async () => {
      if (!imageUri) {
        console.error('No image URI provided');
        Alert.alert(
          'No Image', 
          'No image was provided. Please select an image to edit.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
        return;
      }
  
      setLoading(true);
      try {
        // Try to process the image directly first
        const processedResult = await manipulateAsync(
          imageUri,
          [{ resize: { width: 1200 } }],
          { 
            compress: 0.8, 
            format: SaveFormat.JPEG
          }
        );
  
        // Save processed image to cache
        const filename = `${Date.now()}.jpg`;
        const cacheUri = `${FileSystem.cacheDirectory}${filename}`;
        
        await FileSystem.moveAsync({
          from: processedResult.uri,
          to: cacheUri
        });
  
        // Verify the file exists in cache
        const cacheFileInfo = await FileSystem.getInfoAsync(cacheUri);
        if (!cacheFileInfo.exists) {
          throw new Error('Failed to save processed image');
        }
  
        setOriginalImage(cacheUri);
        setEditedImage(cacheUri);
      } catch (error) {
        console.error('Error preparing image:', error);
        Alert.alert(
          'Error',
          'Failed to process the image. Please try another image.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } finally {
        setLoading(false);
      }
    };
  
    prepareImage();
  }, [imageUri]);

  useEffect(() => {
    applyChanges();
  }, [currentFilter, adjustments]);

  const applyChanges = async () => {
    if (!originalImage) return;
    
    setLoading(true);
    try {
      // If no changes, return original
      if (currentFilter === 'normal' && 
          adjustments.brightness === 0 && 
          adjustments.contrast === 0 && 
          adjustments.saturation === 0) {
        setEditedImage(originalImage);
        return;
      }
  
      // Process image in steps to prevent memory issues
      let processedUri = originalImage;
  
      // Step 1: Apply filter
      if (currentFilter !== 'normal') {
        try {
          const filteredImage = await applyFilter(processedUri, currentFilter);
          if (filteredImage) {
            processedUri = filteredImage;
          }
        } catch (filterError) {
          console.warn('Filter application failed:', filterError);
        }
      }
  
      // Step 2: Apply adjustments if any are non-zero
      if (adjustments.brightness !== 0 || 
          adjustments.contrast !== 0 || 
          adjustments.saturation !== 0) {
        try {
          const adjustedImage = await adjustImage(processedUri, adjustments);
          if (adjustedImage) {
            processedUri = adjustedImage;
          }
        } catch (adjustError) {
          console.warn('Adjustment application failed:', adjustError);
        }
      }
  
      setEditedImage(processedUri);
    } catch (error) {
      console.error('Error applying changes:', error);
      // Fallback to original image
      setEditedImage(originalImage);
      Alert.alert('Error', 'Failed to apply changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
  };

  const handleAdjustmentChange = (type: string, value: number) => {
    setAdjustments(prev => ({
      ...prev,
      [type]: value
    }));
  };

  useEffect(() => {
    if (imageUri) {
      // Simply trust the imageUri without validation for now
      setOriginalImage(imageUri as string);
      setEditedImage(imageUri as string);
    } else {
      console.error('No image URI provided');
      Alert.alert(
        'No Image',
        'No image was provided. Please select an image to edit.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  }, [imageUri]);

  const resetAdjustments = () => {
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
    });
    setCurrentFilter('normal');
  };

  const saveImage = async () => {
    if (!editedImage) return;
    
    setSavingImage(true);
    try {
      // Request permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to save photos');
        return;
      }
      
      // Save the image
      const asset = await MediaLibrary.createAssetAsync(editedImage);
      await MediaLibrary.createAlbumAsync('PhotoEditor', asset, false);
      
      Alert.alert('Success', 'Image saved to gallery!');
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save the image');
    } finally {
      setSavingImage(false);
    }
  };

  if (!originalImage || !editedImage) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.imageContainer}>
        {loading ? (
          <View style={[styles.image, styles.loadingOverlay]}>
            <ActivityIndicator size="large" color="#2196F3" />
          </View>
        ) : (
          <Image source={{ uri: editedImage }} style={styles.image} resizeMode="contain" />
        )}
      </View>
      
      <EditingTools 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        resetAdjustments={resetAdjustments}
      />
      
      <View style={styles.editingArea}>
        {activeTab === 'filters' ? (
          <FiltersList
            currentFilter={currentFilter}
            onSelectFilter={handleFilterChange}
            imageUri={originalImage}
          />
        ) : (
          <View style={styles.adjustmentsContainer}>
            <View style={styles.adjustmentTabs}>
              <TouchableOpacity
                style={[
                  styles.adjustmentTab,
                  currentAdjustment === 'brightness' && styles.activeAdjustmentTab
                ]}
                onPress={() => setCurrentAdjustment('brightness')}
              >
                <Text style={styles.adjustmentTabText}>Brightness</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.adjustmentTab,
                  currentAdjustment === 'contrast' && styles.activeAdjustmentTab
                ]}
                onPress={() => setCurrentAdjustment('contrast')}
              >
                <Text style={styles.adjustmentTabText}>Contrast</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.adjustmentTab,
                  currentAdjustment === 'saturation' && styles.activeAdjustmentTab
                ]}
                onPress={() => setCurrentAdjustment('saturation')}
              >
                <Text style={styles.adjustmentTabText}>Saturation</Text>
              </TouchableOpacity>
            </View>
            
            <AdjustmentSlider
              type={currentAdjustment}
              value={adjustments[currentAdjustment as keyof typeof adjustments]}
              onChange={(value) => handleAdjustmentChange(currentAdjustment, value)}
            />
          </View>
        )}
      </View>
      
      <SaveButton onSave={saveImage} loading={savingImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  editingArea: {
    height: 150,
    backgroundColor: '#1E1E1E',
  },
  adjustmentsContainer: {
    flex: 1,
  },
  adjustmentTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  adjustmentTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeAdjustmentTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  adjustmentTabText: {
    color: '#fff',
    fontSize: 14,
  },
});