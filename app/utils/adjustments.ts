import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

interface Adjustments {
  brightness: number;
  contrast: number;
  saturation: number;
}

export const adjustImage = async (
  imageUri: string, 
  adjustments: Adjustments
) => {
  try {
    const actions = [];

    if (adjustments.brightness !== 0) {
      actions.push({ 
        brightness: adjustments.brightness 
      });
    }

    if (adjustments.contrast !== 0) {
      actions.push({ 
        contrast: 1 + adjustments.contrast 
      });
    }

    // Note: Since saturation is not directly supported, 
    // we'll use a combination of other operations
    if (adjustments.saturation !== 0) {
      const saturationValue = 1 + adjustments.saturation;
      actions.push({ 
        contrast: saturationValue,
        brightness: (1 - saturationValue) / 2
      });
    }

    if (actions.length === 0) {
      return imageUri;
    }

    const result = await manipulateAsync(
      imageUri,
      actions,
      { 
        format: SaveFormat.JPEG,
        compress: 0.8
      }
    );

    return result.uri;
  } catch (error) {
    console.error('Adjustment application error:', error);
    return imageUri;
  }
};