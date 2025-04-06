import { View, Text, StyleSheet, ImageBackground, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Heart } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PlatformSelect() {
  const singleScale = useSharedValue(1);
  const coupleScale = useSharedValue(1);

  const handleSinglePress = () => {
    router.replace('/(tabs)/');
  };

  const handleCouplePress = () => {
    router.replace('/(relationship-tabs)/');
  };

  const singleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: singleScale.value }],
  }));

  const coupleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: coupleScale.value }],
  }));

  const handlePressIn = (platform: 'single' | 'couple') => {
    if (platform === 'single') {
      singleScale.value = withSpring(0.95);
    } else {
      coupleScale.value = withSpring(0.95);
    }
  };

  const handlePressOut = (platform: 'single' | 'couple') => {
    if (platform === 'single') {
      singleScale.value = withSpring(1);
    } else {
      coupleScale.value = withSpring(1);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2940&auto=format&fit=crop' }}
      style={styles.container}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Choose Your Platform</Text>
          <Text style={styles.subtitle}>Select how you want to use the app</Text>

          <View style={styles.optionsContainer}>
            <AnimatedPressable
              style={[styles.option, singleAnimatedStyle]}
              onPress={handleSinglePress}
              onPressIn={() => handlePressIn('single')}
              onPressOut={() => handlePressOut('single')}
            >
              <LinearGradient
                colors={['#FF3B30', '#FF69B4']}
                style={styles.optionGradient}
              >
                <User color="#fff" size={48} />
                <Text style={styles.optionTitle}>Single</Text>
                <Text style={styles.optionDescription}>
                  Play games, meet new people, and make friends
                </Text>
              </LinearGradient>
            </AnimatedPressable>

            <AnimatedPressable
              style={[styles.option, coupleAnimatedStyle]}
              onPress={handleCouplePress}
              onPressIn={() => handlePressIn('couple')}
              onPressOut={() => handlePressOut('couple')}
            >
              <LinearGradient
                colors={['#FF69B4', '#FF3B30']}
                style={styles.optionGradient}
              >
                <Heart color="#fff" size={48} />
                <Text style={styles.optionTitle}>Couple</Text>
                <Text style={styles.optionDescription}>
                  Play with your partner and connect with other couples
                </Text>
              </LinearGradient>
            </AnimatedPressable>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
  },
  optionsContainer: {
    gap: 20,
  },
  option: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  optionGradient: {
    padding: 20,
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  optionDescription: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.8,
  },
});

