import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ExploreScreen() {
  // This would typically come from an API or local storage
  const exampleImages = [
    { id: '1', uri: 'https://picsum.photos/id/1/300/300' },
    { id: '2', uri: 'https://picsum.photos/id/2/300/300' },
    { id: '3', uri: 'https://picsum.photos/id/3/300/300' },
    { id: '4', uri: 'https://picsum.photos/id/4/300/300' },
  ];

  const handleImagePress = (imageUri: string) => {
    router.push({
      pathname: '/editor',
      params: { imageUri }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Get inspired by edited photos</Text>
      </View>

      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Featured Edits</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {exampleImages.map((image) => (
            <TouchableOpacity 
              key={image.id} 
              style={styles.featuredItem}
              onPress={() => handleImagePress(image.uri)}
            >
              <Image source={{ uri: image.uri }} style={styles.featuredImage} />
              <View style={styles.overlay}>
                <Ionicons name="pencil" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Edits</Text>
        <View style={styles.recentGrid}>
          {exampleImages.map((image) => (
            <TouchableOpacity 
              key={image.id} 
              style={styles.recentItem}
              onPress={() => handleImagePress(image.uri)}
            >
              <Image source={{ uri: image.uri }} style={styles.recentImage} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 5,
  },
  featuredSection: {
    marginTop: 10,
    paddingLeft: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  horizontalScroll: {
    paddingBottom: 20,
  },
  featuredItem: {
    width: 250,
    height: 180,
    marginRight: 15,
    borderRadius: 10,
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentSection: {
    padding: 20,
  },
  recentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recentItem: {
    width: '48%',
    height: 150,
    marginBottom: 15,
    borderRadius: 10,
  },
  recentImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});