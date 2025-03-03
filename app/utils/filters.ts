import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export const applyFilter = async (imageUri: string, filterType: string) => {
  try {
    switch (filterType) {
      case 'normal':
        return imageUri;
      
      case 'grayscale':
        const result = await manipulateAsync(
          imageUri,
          [
            { brightness: -0.5 },
            { contrast: 2 }
          ],
          { format: SaveFormat.JPEG }
        );
        return result.uri;
      
      case 'sepia':
        const sepiaResult = await manipulateAsync(
          imageUri,
          [
            { brightness: 0.1 },
            { contrast: 1.1 }
          ],
          { format: SaveFormat.JPEG }
        );
        return sepiaResult.uri;

      default:
        console.warn('Unsupported filter type:', filterType);
        return imageUri;
    }
  } catch (error) {
    console.error('Filter application error:', error);
    return imageUri;
  }
};