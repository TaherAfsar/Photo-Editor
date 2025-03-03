import { Redirect } from 'expo-router';

export default function Home() {
  // Redirect to the photo editor tab by default
  return <Redirect href="/(tabs)/photo-editor" />;
}