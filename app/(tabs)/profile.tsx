import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Edit2, Heart, Trophy, MessageCircle } from 'lucide-react-native';

interface Stats {
  games: number;
  friends: number;
  points: number;
}

interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  stats: Stats;
  interests: string[];
}

const mockProfile: UserProfile = {
  name: 'Alex Johnson',
  username: '@alexj',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  bio: 'Passionate gamer looking for fun and friendship. Love competitive games and meeting new people!',
  stats: {
    games: 156,
    friends: 48,
    points: 2750,
  },
  interests: ['Gaming', 'Adventure', 'Strategy', 'Puzzle', 'Social'],
};

export default function ProfileScreen() {
  const renderStat = (label: string, value: number) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.container}>
      <View style={styles.header}>
        <User color="#FF3B30" size={32} />
        <Text style={styles.title}>Profile</Text>
        <Pressable style={styles.settingsButton}>
          <Settings color="#fff" size={24} />
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: mockProfile.avatar }} style={styles.avatar} />
          <Pressable style={styles.editButton}>
            <Edit2 color="#fff" size={20} />
          </Pressable>
        </View>

        <Text style={styles.name}>{mockProfile.name}</Text>
        <Text style={styles.username}>{mockProfile.username}</Text>
        <Text style={styles.bio}>{mockProfile.bio}</Text>

        <View style={styles.statsContainer}>
          {renderStat('Games', mockProfile.stats.games)}
          {renderStat('Friends', mockProfile.stats.friends)}
          {renderStat('Points', mockProfile.stats.points)}
        </View>

        <View style={styles.interestsContainer}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestTags}>
            {mockProfile.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Pressable style={styles.actionButton}>
            <Heart color="#FF69B4" size={24} />
            <Text style={styles.actionText}>Favorites</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Trophy color="#FFD700" size={24} />
            <Text style={styles.actionText}>Achievements</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <MessageCircle color="#4A90E2" size={24} />
            <Text style={styles.actionText}>Messages</Text>
          </Pressable>
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
    flex: 1,
    fontSize: 32,
    color: '#fff',
    marginLeft: 10,
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FF69B4',
  },
  editButton: {
    position: 'absolute',
    right: '30%',
    bottom: 0,
    backgroundColor: '#FF69B4',
    padding: 8,
    borderRadius: 20,
  },
  name: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  username: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  bio: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  interestsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestTag: {
    backgroundColor: 'rgba(255,105,180,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestText: {
    color: '#fff',
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
  },
});
