import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface AdjustmentSliderProps {
  type: string;
  value: number;
  onChange: (value: number) => void;
}

export default function AdjustmentSlider({ type, value, onChange }: AdjustmentSliderProps) {
  // Define ranges for different adjustment types
  const getRange = () => {
    switch (type) {
      case 'brightness':
        return { min: -100, max: 100 };
      case 'contrast':
        return { min: -100, max: 100 };
      case 'saturation':
        return { min: -100, max: 100 };
      default:
        return { min: -100, max: 100 };
    }
  };

  const { min, max } = getRange();

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <Text style={styles.rangeText}>{min}</Text>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          value={value}
          onValueChange={onChange}
          minimumTrackTintColor="#2196F3"
          maximumTrackTintColor="#444"
          thumbTintColor="#2196F3"
          step={1}
        />
        <Text style={styles.rangeText}>{max}</Text>
      </View>
      <Text style={styles.valueText}>{Math.round(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  rangeText: {
    color: '#888',
    fontSize: 12,
    width: 30,
    textAlign: 'center',
  },
  valueText: {
    color: '#2196F3',
    fontSize: 16,
    textAlign: 'center',
  },
});