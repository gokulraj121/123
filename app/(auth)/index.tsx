import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Flame, Heart } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue 
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AuthScreen() {
  const loginScale = useSharedValue(1);
  const signupScale = useSharedValue(1);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  const loginAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: loginScale.value }],
  }));

  const signupAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: signupScale.value }],
  }));

  const handlePressIn = (button: 'login' | 'signup') => {
    if (button === 'login') {
      loginScale.value = withSpring(0.95);
    } else {
      signupScale.value = withSpring(0.95);
    }
  };

  const handlePressOut = (button: 'login' | 'signup') => {
    if (button === 'login') {
      loginScale.value = withSpring(1);
    } else {
      signupScale.value = withSpring(1);
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
          <Flame color="#FF3B30" size={48} />
          <Text style={styles.title}>Heatwaves</Text>
          <Text style={styles.subtitle}>Turn up the heat in your relationship</Text>
          
          <View style={styles.heartContainer}>
            <AnimatedPressable
              style={[styles.heartWrapper, styles.loginHeart, loginAnimatedStyle]}
              onPress={handleLogin}
              onPressIn={() => handlePressIn('login')}
              onPressOut={() => handlePressOut('login')}
            >
              <LinearGradient
                colors={['#FF3B30', '#FF69B4']}
                style={styles.heartGradient}
              >
                <Heart color="#fff" fill="#fff" size={32} />
                <Text style={styles.heartText}>Login</Text>
              </LinearGradient>
            </AnimatedPressable>

            <AnimatedPressable
              style={[styles.heartWrapper, styles.signupHeart, signupAnimatedStyle]}
              onPress={handleSignup}
              onPressIn={() => handlePressIn('signup')}
              onPressOut={() => handlePressOut('signup')}
            >
              <LinearGradient
                colors={['#FF69B4', '#FF3B30']}
                style={styles.heartGradient}
              >
                <Heart color="#fff" fill="#fff" size={32} />
                <Text style={styles.heartText}>Create{'\n'}Account</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'DancingScript-Bold',
    fontSize: 48,
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  },
  heartContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    gap: 20,
  },
  heartWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  loginHeart: {
    transform: [{ rotate: '-15deg' }],
  },
  signupHeart: {
    transform: [{ rotate: '15deg' }],
  },
  heartGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heartText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: 18,
    marginTop: 12,
    textAlign: 'center',
  },
});