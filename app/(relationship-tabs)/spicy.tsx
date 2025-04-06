import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState, useCallback, useEffect } from 'react';
import { Flame } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

interface Position {
  id: number;
  name: string;
  description: string;
}

const positions: Position[] = [
  {
    id: 1,
    name: "Lotus Blossom",
    description: "A romantic and intimate position where partners face each other closely.",
  },
  {
    id: 2,
    name: "Crescent Moon",
    description: "A gentle side-lying position perfect for intimate moments.",
  },
  {
    id: 3,
    name: "Ocean Waves",
    description: "A rhythmic position that brings partners closer together.",
  },
  {
    id: 4,
    name: "Mountain Peak",
    description: "An elevated position that creates deep connection.",
  },
  {
    id: 5,
    name: "Secret Garden",
    description: "A private and intimate position for passionate moments.",
  },
];

export default function SpicyScreen() {
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const progress = useSharedValue(0);

  const getRandomPosition = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * positions.length);
    return positions[randomIndex];
  }, []);

  useEffect(() => {
    setCurrentPosition(getRandomPosition());
  }, []);

  const resetCard = useCallback(() => {
    scale.value = 1;
    opacity.value = 1;
    progress.value = 0;
    setIsRevealed(false);
    setCurrentPosition(getRandomPosition());
  }, [getRandomPosition]);

  const checkRevealThreshold = useCallback((currentProgress: number) => {
    if (currentProgress > 0.5 && !isRevealed) {
      setIsRevealed(true);
      opacity.value = withSpring(0);
    }
  }, [isRevealed]);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withSpring(1.02);
    })
    .onUpdate((event) => {
      // Calculate progress based on movement
      const newProgress = Math.min((progress.value + Math.abs(event.velocityX + event.velocityY) / 5000), 1);
      progress.value = newProgress;
      runOnJS(checkRevealThreshold)(newProgress);
    })
    .onEnd(() => {
      scale.value = withSpring(1);
      if (progress.value > 0.5) {
        opacity.value = withSpring(0);
        runOnJS(setIsRevealed)(true);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleNewCard = () => {
    resetCard();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.container}>
        <View style={styles.header}>
          <Flame color="#FF3B30" size={32} />
          <Text style={styles.title}>Spicy Positions</Text>
        </View>

        <View style={styles.content}>
          <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.card, animatedStyle]}>
              <View style={styles.cardContent}>
                <LinearGradient
                  colors={['#FF3B30', '#FF69B4']}
                  style={[styles.cardInner, styles.revealedLayer]}
                >
                  <View style={styles.revealedContent}>
                    <Text style={styles.positionName}>{currentPosition?.name}</Text>
                    <Text style={styles.positionDescription}>
                      {currentPosition?.description}
                    </Text>
                  </View>
                </LinearGradient>

                <Animated.View style={[styles.cardInner, styles.scratchLayer, overlayStyle]}>
                  <LinearGradient
                    colors={['#4A4A4A', '#2D2D2D']}
                    style={styles.scratchMask}
                  >
                    <View style={styles.hiddenContent}>
                      <Flame color="#fff" size={48} />
                      <Text style={styles.scratchText}>
                        Rub to Reveal
                      </Text>
                    </View>
                  </LinearGradient>
                </Animated.View>
              </View>
            </Animated.View>
          </GestureDetector>

          <Pressable
            style={[styles.button, isRevealed ? styles.buttonActive : styles.buttonDisabled]}
            onPress={handleNewCard}
            disabled={!isRevealed}
          >
            <Text style={styles.buttonText}>New Card</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </GestureHandlerRootView>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    width: '100%',
    height: '100%',
  },
  cardInner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  revealedLayer: {
    zIndex: 1,
  },
  scratchLayer: {
    zIndex: 2,
    backgroundColor: '#2D2D2D',
  },
  scratchMask: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenContent: {
    alignItems: 'center',
    gap: 20,
  },
  scratchText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
  },
  revealedContent: {
    alignItems: 'center',
  },
  positionName: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 20,
  },
  positionDescription: {
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    marginTop: 40,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    minWidth: 200,
  },
  buttonActive: {
    backgroundColor: '#FF3B30',
  },
  buttonDisabled: {
    backgroundColor: '#4A4A4A',
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});