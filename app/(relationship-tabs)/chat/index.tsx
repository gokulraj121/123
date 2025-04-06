import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function RelationshipChatScreen() {
  const router = useRouter();

  const handleChatPress = () => {
    router.push('/screens/chat-room/relationship');
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.container}>
      <View style={styles.header}>
        <MessageCircle color="#FF3B30" size={32} />
        <Text style={styles.title}>Couple Chat</Text>
      </View>
      <Pressable style={styles.content} onPress={handleChatPress}>
        <Text style={styles.text}>Tap to start chatting with your partner!</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});

