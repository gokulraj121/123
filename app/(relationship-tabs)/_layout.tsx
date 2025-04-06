import { Tabs } from 'expo-router';
import { Gamepad as GamepadIcon, Users as Users2, MessageCircle, User } from 'lucide-react-native';

export default function RelationshipTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333',
        },
        tabBarActiveTintColor: '#FF69B4',
        tabBarInactiveTintColor: '#888',
      }}>
      <Tabs.Screen
        name="games"
        options={{
          title: 'Games',
          tabBarIcon: ({ color, size }) => <GamepadIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="coop-games"
        options={{
          title: 'Co-op Games',
          tabBarIcon: ({ color, size }) => <Users2 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}