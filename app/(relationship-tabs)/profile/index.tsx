import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User } from 'lucide-react-native';

export default function ProfileScreen() {
  return (
    <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.container}>
      <View style={styles.header}>
        <User color="#FF3B30" size={32} />
        <Text style={styles.title}>Couple Profile</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>Couple profile settings coming soon!</Text>
      </View>
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
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontFamily: 'DancingScript-Bold',
    fontSize: 32,
    color: '#fff',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});