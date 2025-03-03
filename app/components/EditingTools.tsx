import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EditingToolsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  resetAdjustments: () => void;
}

export default function EditingTools({ activeTab, setActiveTab, resetAdjustments }: EditingToolsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'filters' && styles.activeTab]}
        onPress={() => setActiveTab('filters')}
      >
        <Ionicons
          name="color-filter"
          size={24}
          color={activeTab === 'filters' ? '#2196F3' : '#888'}
        />
        <Text style={[styles.tabText, activeTab === 'filters' && styles.activeTabText]}>
          Filters
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'adjust' && styles.activeTab]}
        onPress={() => setActiveTab('adjust')}
      >
        <Ionicons
          name="contrast"
          size={24}
          color={activeTab === 'adjust' ? '#2196F3' : '#888'}
        />
        <Text style={[styles.tabText, activeTab === 'adjust' && styles.activeTabText]}>
          Adjust
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={resetAdjustments}
      >
        <Ionicons name="refresh" size={24} color="#888" />
        <Text style={styles.tabText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabText: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  activeTabText: {
    color: '#2196F3',
  },
});