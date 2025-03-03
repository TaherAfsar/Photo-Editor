import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarStyle: {
        backgroundColor: '#121212',
        borderTopColor: '#333',
      },
      tabBarActiveTintColor: '#2196F3',
      tabBarInactiveTintColor: '#888',
      headerStyle: {
        backgroundColor: '#121212',
      },
      headerTintColor: '#fff',
    }}>
      <Tabs.Screen
        name="photo-editor"
        options={{
          title: 'Photo Editor',
          tabBarIcon: ({ color }) => <Ionicons name="camera" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Ionicons name="grid" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}