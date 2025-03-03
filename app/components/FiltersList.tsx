import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';

// Define the filter names we'll use
const FILTERS = [
  'normal',
  'grayscale',
  'sepia'
];

interface FiltersListProps {
  currentFilter: string;
  onSelectFilter: (filter: string) => void;
  imageUri: string;
}

export default function FiltersList({ currentFilter, onSelectFilter, imageUri }: FiltersListProps) {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {FILTERS.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[styles.filterItem, currentFilter === filter && styles.selectedFilterItem]}
          onPress={() => onSelectFilter(filter)}
        >
          <View style={styles.imageContainer}>
            {imageUri ? (
              <Image 
                source={{ uri: imageUri }} 
                style={styles.filterPreview}
                onLoadStart={() => setIsImageLoading(true)}
                onLoadEnd={() => setIsImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setIsImageLoading(false);
                }}
              />
            ) : (
              <View style={styles.placeholderImage} />
            )}
            
            {isImageLoading && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="small" color="#2196F3" />
              </View>
            )}
            
            {imageError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>!</Text>
              </View>
            )}
          </View>
          <Text style={[styles.filterName, currentFilter === filter && styles.selectedFilterName]}>
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  filterItem: {
    marginRight: 15,
    alignItems: 'center',
    width: 80,
  },
  selectedFilterItem: {
    opacity: 1,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#222',
    position: 'relative',
  },
  filterPreview: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterName: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  selectedFilterName: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
});