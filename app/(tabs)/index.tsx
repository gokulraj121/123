import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, MessageCircleQuestion, Brain, Users, Calendar, Coffee, HeartHandshake } from 'lucide-react-native';
import { router } from 'expo-router';

export type GameMode = 'romantic' | 'fun' | 'spicy' | 'extreme';

export interface Game {
  id: string;
  title: string;
  icon: any;
  color: string;
  description: string;
  modes: GameMode[];
  minPlayers: number;
  maxPlayers: number;
  timePerRound: number;
  points: {
    completion: number;
    bonus: number;
  };
}

export const games: Game[] = [
  {
    id: 'truth-dare',
    title: 'Truth or Dare',
    icon: MessageCircleQuestion,
    color: '#FF3B30',
    description: 'Answer spicy questions or perform daring acts',
    modes: ['romantic', 'fun', 'spicy', 'extreme'],
    minPlayers: 2,
    maxPlayers: 2,
    timePerRound: 60,
    points: {
      completion: 10,
      bonus: 5,
    },
  },
  {
    id: 'would-you-rather',
    title: 'Would You Rather?',
    icon: Users,
    color: '#4A90E2',
    description: 'Choose between two intriguing scenarios',
    modes: ['romantic', 'fun', 'spicy', 'extreme'],
    minPlayers: 2,
    maxPlayers: 2,
    timePerRound: 30,
    points: {
      completion: 5,
      bonus: 3,
    },
  },
  {
    id: 'never-have-i-ever',
    title: 'Never Have I Ever',
    icon: HeartHandshake,
    color: '#9B59B6',
    description: 'Reveal secrets and share experiences together',
    modes: ['romantic', 'fun', 'spicy', 'extreme'],
    minPlayers: 2,
    maxPlayers: 2,
    timePerRound: 30,
    points: {
      completion: 8,
      bonus: 4,
    },
  },
  {
    id: 'memory-challenge',
    title: 'Memory Challenge',
    icon: Brain,
    color: '#50E3C2',
    description: 'Test your knowledge about each other',
    modes: ['romantic', 'fun'],
    minPlayers: 2,
    maxPlayers: 2,
    timePerRound: 45,
    points: {
      completion: 8,
      bonus: 4,
    },
  },
  {
    id: 'date-ideas',
    title: 'Date Ideas',
    icon: Calendar,
    color: '#E74C3C',
    description: 'Get personalized date suggestions based on your preferences',
    modes: ['romantic', 'fun', 'spicy'],
    minPlayers: 2,
    maxPlayers: 2,
    timePerRound: 0,
    points: {
      completion: 12,
      bonus: 8,
    },
  },
  {
    id: 'night-planner',
    title: 'Night Planner',
    icon: Coffee,
    color: '#8E44AD',
    description: 'Get suggestions for a perfect night together',
    modes: ['romantic', 'fun', 'spicy', 'extreme'],
    minPlayers: 2,
    maxPlayers: 2,
    timePerRound: 0,
    points: {
      completion: 15,
      bonus: 10,
    },
  },
];

export default function GamesScreen() {
  const handleGamePress = (game: Game) => {
    router.push(`/games/${game.id}`);
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.container}>
      <View style={styles.header}>
        <Flame color="#FF3B30" size={32} />
        <Text style={styles.title}>Heatwaves</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Pressable 
                key={game.id} 
                style={styles.gameCard}
                onPress={() => handleGamePress(game)}
              >
                <LinearGradient
                  colors={[game.color, `${game.color}dd`]}
                  style={styles.gameCardGradient}
                >
                  <Icon color="#fff" size={32} />
                  <Text style={styles.gameTitle}>{game.title}</Text>
                  <Text style={styles.gameDescription}>{game.description}</Text>
                  <View style={styles.gameModes}>
                    {game.modes.map((mode) => (
                      <View 
                        key={mode} 
                        style={[
                          styles.modeTag,
                          { backgroundColor: mode === 'extreme' ? '#FF3B30' : 'rgba(255,255,255,0.2)' }
                        ]}
                      >
                        <Text style={styles.modeText}>{mode}</Text>
                      </View>
                    ))}
                  </View>
                </LinearGradient>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
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
    padding: 10,
  },
  grid: {
    padding: 10,
  },
  gameCard: {
    width: '100%',
    marginBottom: 15,
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
  gameCardGradient: {
    padding: 20,
  },
  gameTitle: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: 24,
    marginTop: 10,
  },
  gameDescription: {
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 5,
  },
  gameModes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  modeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  modeText: {
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    fontSize: 12,
    textTransform: 'capitalize',
  },
});