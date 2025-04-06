import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router } from 'expo-router';
import { games, Game, GameMode } from '../(tabs)';
import { ArrowLeft, Timer, Users as UsersIcon } from 'lucide-react-native';

export default function GameScreen() {
  const { id } = useLocalSearchParams();
  const game = games.find((g) => g.id === id) as Game;

  if (!game) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Game not found</Text>
      </View>
    );
  }

  const handleModeSelect = (mode: GameMode) => {
    // Navigate to the game session with selected mode
    router.push({
      pathname: `/games/${id}/play`,
      params: { mode },
    });
  };

  return (
    <LinearGradient colors={[game.color, `${game.color}dd`]} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#fff" size={24} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.gameInfo}>
          <game.icon color="#fff" size={48} />
          <Text style={styles.title}>{game.title}</Text>
          <Text style={styles.description}>{game.description}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <UsersIcon color="#fff" size={20} />
              <Text style={styles.statText}>
                {game.minPlayers} {game.maxPlayers > game.minPlayers ? `-${game.maxPlayers}` : ''} Players
              </Text>
            </View>
            {game.timePerRound > 0 && (
              <View style={styles.stat}>
                <Timer color="#fff" size={20} />
                <Text style={styles.statText}>
                  {game.timePerRound}s per round
                </Text>
              </View>
            )}
          </View>

          <View style={styles.pointsContainer}>
            <Text style={styles.pointsTitle}>Points</Text>
            <Text style={styles.pointsText}>Completion: {game.points.completion}</Text>
            <Text style={styles.pointsText}>Bonus: +{game.points.bonus}</Text>
          </View>
        </View>

        <View style={styles.modesContainer}>
          <Text style={styles.modesTitle}>Select Mode</Text>
          <View style={styles.modes}>
            {game.modes.map((mode) => (
              <Pressable
                key={mode}
                style={[
                  styles.modeButton,
                  { backgroundColor: mode === 'extreme' ? '#FF3B30' : 'rgba(255,255,255,0.2)' },
                ]}
                onPress={() => handleModeSelect(mode)}
              >
                <Text style={styles.modeButtonText}>{mode}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
  content: {
    flex: 1,
    padding: 20,
  },
  gameInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 32,
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 10,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  statText: {
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    fontSize: 14,
  },
  pointsContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 20,
    borderRadius: 20,
    width: '100%',
  },
  pointsTitle: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  pointsText: {
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  modesContainer: {
    marginTop: 40,
  },
  modesTitle: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  modes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  modeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: '48%',
  },
  modeButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
  },
});