import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Timer, Heart, Flame, Sparkles } from 'lucide-react-native';
import { games, Game, GameMode } from '../../(tabs)';

// Game content based on game type and mode
const gameContent = {
  'truth-dare': {
    romantic: {
      truths: [
        "What's your favorite memory of us together?",
        "When did you first realize you were falling for me?",
        "What's your ideal romantic date with me?",
        "What's the most thoughtful thing I've done for you?",
        "What's one thing you'd like us to do together that we haven't yet?",
      ],
      dares: [
        "Give your partner a gentle massage for 1 minute",
        "Write a short love note and read it out loud",
        "Do your best romantic dance move",
        "Give your partner three compliments",
        "Create a heart shape with your hands and take a photo together",
      ],
    },
    fun: {
      truths: [
        "What's the silliest thing you've done to make me laugh?",
        "What's your most embarrassing moment with me?",
        "What's the weirdest dream you've had about us?",
        "What's a funny nickname you secretly want to call me?",
        "What's the most ridiculous thing we've done together?",
      ],
      dares: [
        "Do your best impression of me",
        "Make up a silly song about our relationship",
        "Do a funny dance for 30 seconds",
        "Take a funny selfie together",
        "Exchange clothes for the next round",
      ],
    },
    spicy: {
      truths: [
        "What's your favorite physical feature of mine?",
        "What's your biggest turn-on about me?",
        "What's a romantic fantasy you'd like to try with me?",
        "What's the most attractive thing I do without realizing?",
        "Where's the most adventurous place you'd like to kiss me?",
      ],
      dares: [
        "Give your partner a sensual neck massage",
        "Whisper something seductive in your partner's ear",
        "Do your most alluring dance move",
        "Feed each other something sweet",
        "Kiss for 10 seconds",
      ],
    },
    extreme: {
      truths: [
        "What's your wildest fantasy involving us?",
        "What's something intimate you've always wanted to try?",
        "What's the most passionate moment we've shared?",
        "What's something that instantly turns you on?",
        "What's a secret desire you haven't told me yet?",
      ],
      dares: [
        "Give a sensual massage for 2 minutes",
        "Demonstrate your favorite intimate position",
        "Remove one piece of clothing",
        "Create a steamy scene together",
        "Role-play a passionate scenario",
      ],
    },
  },
  'would-you-rather': {
    romantic: [
      "Would you rather have a candlelit dinner at home or a fancy restaurant date?",
      "Would you rather go on a beach vacation or a mountain getaway together?",
      "Would you rather surprise me with gifts or receive surprise gifts from me?",
      "Would you rather have a quiet night in or an adventurous date night?",
      "Would you rather dance together in the rain or stargaze on a clear night?",
    ],
    fun: [
      "Would you rather switch phones for a day or switch wardrobes?",
      "Would you rather always have to speak in rhymes or sing everything you say?",
      "Would you rather have a pet monkey or a pet penguin?",
      "Would you rather be famous together or rich but unknown?",
      "Would you rather never be able to use emojis or never use GIFs again?",
    ],
    spicy: [
      "Would you rather have a romantic bath together or a steamy shower?",
      "Would you rather have a massage or give a massage?",
      "Would you rather have a private dance or receive one?",
      "Would you rather try a new position or perfect a favorite one?",
      "Would you rather have a romantic morning or a passionate night?",
    ],
    extreme: [
      "Would you rather try role-playing or try a new location?",
      "Would you rather use ice or hot wax?",
      "Would you rather be dominant or submissive?",
      "Would you rather try bondage or sensory deprivation?",
      "Would you rather focus on giving or receiving pleasure?",
    ],
  },
  'never-have-i-ever': {
    romantic: [
      "Never have I ever written a love letter",
      "Never have I ever planned a surprise date",
      "Never have I ever slow danced in public",
      "Never have I ever made a romantic playlist",
      "Never have I ever cooked a romantic dinner",
    ],
    fun: [
      "Never have I ever sent an embarrassing text to the wrong person",
      "Never have I ever stalked an ex on social media",
      "Never have I ever faked being sick to spend time together",
      "Never have I ever forgotten an important date",
      "Never have I ever pretended to like a gift",
    ],
    spicy: [
      "Never have I ever sent a spicy selfie",
      "Never have I ever been caught making out",
      "Never have I ever had a romantic dream about someone else",
      "Never have I ever played strip games",
      "Never have I ever been handcuffed",
    ],
    extreme: [
      "Never have I ever role-played",
      "Never have I ever been caught in the act",
      "Never have I ever used toys",
      "Never have I ever done it in public",
      "Never have I ever had a threesome fantasy",
    ],
  },
  'memory-challenge': {
    romantic: [
      "What was I wearing on our first date?",
      "Where did we have our first kiss?",
      "What's my favorite romantic movie?",
      "What's my idea of a perfect date?",
      "What's my favorite flower?",
    ],
    fun: [
      "What's my most embarrassing moment?",
      "What's my go-to karaoke song?",
      "What's my favorite comfort food?",
      "What's my most used emoji?",
      "What's my favorite meme?",
    ],
  },
  'date-ideas': {
    romantic: [
      "Sunset picnic in the park",
      "Couples cooking class",
      "Wine tasting experience",
      "Stargazing night",
      "Dance lesson together",
    ],
    fun: [
      "Arcade game challenge",
      "Theme park adventure",
      "Karaoke night",
      "Paint and sip class",
      "Escape room challenge",
    ],
    spicy: [
      "Private spa day",
      "Couples massage session",
      "Romantic photoshoot",
      "Late night swim",
      "Intimate dinner at home",
    ],
  },
  'night-planner': {
    romantic: [
      "Netflix and chill with your favorite romantic movies",
      "Cook dinner together and have a candlelit meal",
      "Take a bubble bath together",
      "Give each other massages",
      "Create a cozy fort and tell stories",
    ],
    fun: [
      "Game night with snacks and drinks",
      "Dance party with your favorite songs",
      "Make desserts together",
      "Have a pillow fight",
      "Do a fun couple's challenge",
    ],
    spicy: [
      "Romantic movie marathon in bed",
      "Give each other sensual massages",
      "Play strip card games",
      "Take a steamy shower together",
      "Role-play your fantasies",
    ],
    extreme: [
      "Try new intimate positions",
      "Use toys and accessories",
      "Play domination games",
      "Try bondage and restraints",
      "Explore new fantasies",
    ],
  },
};

const getModeIcon = (mode: GameMode) => {
  switch (mode) {
    case 'romantic':
      return Heart;
    case 'fun':
      return Sparkles;
    case 'spicy':
    case 'extreme':
      return Flame;
    default:
      return Heart;
  }
};

const getRandomItem = (array: string[]) => {
  if (!array || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
};

const isValidMode = (mode: any): mode is GameMode => {
  return ['romantic', 'fun', 'spicy', 'extreme'].includes(mode);
};

export default function GamePlayScreen() {
  const params = useLocalSearchParams<{ id: string; mode: GameMode }>();
  
  // Validate params
  if (!params || !params.id || !isValidMode(params.mode)) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.errorContainer}>
          <Text style={styles.errorText}>Invalid game parameters</Text>
          <Pressable 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </LinearGradient>
      </View>
    );
  }

  const { id, mode } = params;
  const game = games.find((g) => g.id === id);

  // Validate game exists
  if (!game) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.errorContainer}>
          <Text style={styles.errorText}>Game not found</Text>
          <Pressable 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </LinearGradient>
      </View>
    );
  }

  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [choice, setChoice] = useState<'truth' | 'dare' | null>(null);
  const [currentContent, setCurrentContent] = useState<string | null>(null);
  const [points, setPoints] = useState({ player1: 0, player2: 0 });
  const [completed, setCompleted] = useState(false);
  const [timer, setTimer] = useState(game.timePerRound);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const ModeIcon = getModeIcon(mode);

  useEffect(() => {
    if (choice && timer > 0 && !completed) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleComplete(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [choice, completed]);

  const handleChoice = (selected: 'truth' | 'dare') => {
    if (id === 'truth-dare') {
      if (!gameContent[id][mode] || !gameContent[id][mode][`${selected}s`]) {
        console.error('Invalid game content');
        return;
      }

      setChoice(selected);
      const questions = gameContent[id][mode][`${selected}s`];
      const randomContent = getRandomItem(questions);
      
      if (!randomContent) {
        console.error('No content available');
        return;
      }

      setCurrentContent(randomContent);
    } else {
      // For other games, just get a random item from the array
      const content = gameContent[id]?.[mode];
      if (!content) {
        console.error('Invalid game content');
        return;
      }

      const randomContent = getRandomItem(content);
      if (!randomContent) {
        console.error('No content available');
        return;
      }

      setChoice('truth'); // Use truth as default for non-truth-or-dare games
      setCurrentContent(randomContent);
    }

    setTimer(game.timePerRound);
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleComplete = (success: boolean) => {
    setCompleted(true);
    const pointsEarned = success ? game.points.completion + game.points.bonus : 0;
    setPoints((prev) => ({
      ...prev,
      [`player${currentPlayer}`]: prev[`player${currentPlayer}`] + pointsEarned,
    }));

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNextTurn = () => {
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    setChoice(null);
    setCurrentContent(null);
    setCompleted(false);
    setTimer(game.timePerRound);

    Animated.sequence([
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(spinAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <LinearGradient colors={[game.color, `${game.color}dd`]} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#fff" size={24} />
        </Pressable>
        <View style={styles.modeContainer}>
          <ModeIcon color="#fff" size={24} />
          <Text style={styles.modeText}>{mode}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.scoreBoard}>
          <View style={[styles.playerScore, currentPlayer === 1 && styles.activePlayer]}>
            <Text style={styles.playerText}>Player 1</Text>
            <Text style={styles.scoreText}>{points.player1}</Text>
          </View>
          <View style={[styles.playerScore, currentPlayer === 2 && styles.activePlayer]}>
            <Text style={styles.playerText}>Player 2</Text>
            <Text style={styles.scoreText}>{points.player2}</Text>
          </View>
        </View>

        {!choice ? (
          <Animated.View 
            style={[
              styles.choiceContainer,
              {
                transform: [
                  { scale: scaleAnim },
                  {
                    rotate: spinAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.turnText}>Player {currentPlayer}'s Turn</Text>
            <View style={styles.choices}>
              {id === 'truth-dare' ? (
                <>
                  <Pressable
                    style={[styles.choiceButton, { backgroundColor: '#4A90E2' }]}
                    onPress={() => handleChoice('truth')}
                  >
                    <Text style={styles.choiceText}>Truth</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.choiceButton, { backgroundColor: '#FF3B30' }]}
                    onPress={() => handleChoice('dare')}
                  >
                    <Text style={styles.choiceText}>Dare</Text>
                  </Pressable>
                </>
              ) : (
                <Pressable
                  style={[styles.choiceButton, { backgroundColor: '#4A90E2', minWidth: 200 }]}
                  onPress={() => handleChoice('truth')}
                >
                  <Text style={styles.choiceText}>Get Question</Text>
                </Pressable>
              )}
            </View>
          </Animated.View>
        ) : (
          <Animated.View 
            style={[
              styles.challengeContainer,
              { opacity: fadeAnim },
            ]}
          >
            {game.timePerRound > 0 && (
              <View style={styles.timerContainer}>
                <Timer color="#fff" size={24} />
                <Text style={styles.timerText}>{timer}s</Text>
              </View>
            )}
            <Text style={styles.challengeType}>
              {id === 'truth-dare' ? choice.toUpperCase() : game.title.toUpperCase()}
            </Text>
            <Text style={styles.challengeText}>{currentContent}</Text>
            {!completed && (
              <View style={styles.actionButtons}>
                <Pressable
                  style={[styles.actionButton, { backgroundColor: '#FF3B30' }]}
                  onPress={() => handleComplete(false)}
                >
                  <Text style={styles.actionButtonText}>Skip</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, { backgroundColor: '#4CD964' }]}
                  onPress={() => handleComplete(true)}
                >
                  <Text style={styles.actionButtonText}>Complete</Text>
                </Pressable>
              </View>
            )}
            {completed && (
              <Pressable
                style={[styles.actionButton, { backgroundColor: '#007AFF' }]}
                onPress={handleNextTurn}
              >
                <Text style={styles.actionButtonText}>Next Turn</Text>
              </Pressable>
            )}
          </Animated.View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: 16,
  },
  modeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  modeText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  playerScore: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: '45%',
  },
  activePlayer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 2,
    borderColor: '#fff',
  },
  playerText: {
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    fontSize: 16,
  },
  scoreText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: 24,
    marginTop: 4,
  },
  choiceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  turnText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  choices: {
    flexDirection: 'row',
    gap: 20,
  },
  choiceButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    minWidth: 120,
  },
  choiceText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  challengeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  timerText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: 20,
  },
  challengeType: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: 28,
    marginBottom: 20,
  },
  challengeText: {
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  actionButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    minWidth: 120,
  },
  actionButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});