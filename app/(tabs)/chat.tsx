import { View, Text, StyleSheet, FlatList, Pressable, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageCircle, Search, Plus, Users } from 'lucide-react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AddChatModal from '../components/AddChatModal';

interface ChatPreview {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  unread: number;
  isGroup?: boolean;
  members?: string[];
}

const mockChats: ChatPreview[] = [
  {
    id: '1',
    name: 'Gaming Squad',
    lastMessage: 'Alice: When are we playing next?',
    time: '2m ago',
    avatar: '', // Will show icon for groups
    unread: 3,
    isGroup: true,
    members: ['Alice', 'Bob', 'Charlie']
  },
  {
    id: '2',
    name: 'Sarah Parker',
    lastMessage: 'Hey! Want to play Truth or Dare?',
    time: '15m ago',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    unread: 2,
  },
  {
    id: '3',
    name: 'Family Group',
    lastMessage: 'Mom: Don\'t forget the dinner tonight!',
    time: '30m ago',
    avatar: '',
    unread: 5,
    isGroup: true,
    members: ['Mom', 'Dad', 'Sister']
  },
  {
    id: '4',
    name: 'John Smith',
    lastMessage: 'That was a fun game!',
    time: '1h ago',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    unread: 0,
  },
];

export default function ChatScreen() {
  const [chats, setChats] = useState<ChatPreview[]>(mockChats);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  const handleAddPress = () => {
    setIsModalVisible(true);
  };

  const handleNewContact = () => {
    setIsModalVisible(false);
    // TODO: Implement contact selection/creation
    console.log('Navigate to contacts');
  };

  const handleNewGroup = async (groupData: { name: string; description: string }) => {
    if (!user) return;

    try {
      // Create new chat room
      const { data: chatRoom, error: roomError } = await supabase
        .from('chat_rooms')
        .insert({
          name: groupData.name,
          is_group: true,
          created_by: user.id,
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Add current user as member
      const { error: memberError } = await supabase
        .from('chat_room_members')
        .insert({
          chat_room_id: chatRoom.id,
          user_id: user.id,
        });

      if (memberError) throw memberError;

      setIsModalVisible(false);
      
      // Navigate to the new group chat
      router.push({
        pathname: '/screens/chat-room/[id]',
        params: { 
          id: chatRoom.id,
          is_group: true
        }
      });
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const renderChatItem = ({ item }: { item: ChatPreview }) => (
    <Pressable
      style={styles.chatItem}
      onPress={() => router.push({
        pathname: '/screens/chat-room/[id]',
        params: { 
          id: item.id,
          is_group: item.isGroup
        }
      })}
    >
      {item.isGroup ? (
        <View style={styles.groupAvatar}>
          <Users color="#FF3B30" size={24} />
        </View>
      ) : (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      )}
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MessageCircle color="#FF3B30" size={32} />
            <Text style={styles.title}>Chat</Text>
          </View>
          <Pressable onPress={handleAddPress} style={styles.addButton}>
            <Plus color="#FF3B30" size={28} />
          </Pressable>
        </View>

        {/* Search Bar */}
        <Pressable style={styles.searchContainer}>
          <Search color="#888" size={20} />
          <Text style={styles.searchPlaceholder}>Search chats...</Text>
        </Pressable>

        {/* Chat List */}
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
        />

        {/* Add Chat Modal */}
        <AddChatModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onNewContact={handleNewContact}
          onNewGroup={handleNewGroup}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(26, 26, 26, 0.98)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 12,
    borderRadius: 12,
  },
  searchPlaceholder: {
    color: '#888',
    marginLeft: 10,
    fontSize: 16,
  },
  chatList: {
    paddingHorizontal: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  groupAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  chatInfo: {
    flex: 1,
    marginLeft: 15,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  chatTime: {
    color: '#888',
    fontSize: 14,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    color: '#888',
    fontSize: 15,
    flex: 1,
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});











