import { useAuth } from '../../hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Send, Users } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { 
  FlatList, 
  KeyboardAvoidingView, 
  Platform as RNPlatform, 
  Pressable, 
  StyleSheet, 
  Text, 
  TextInput, 
  View 
} from 'react-native';

interface ChatRoom {
  id: string;
  name: string;
  is_group: boolean;
  created_at: string;
  members: {
    id: string;
    user_id: string;
    chat_room_id: string;
    profile: {
      id: string;
      username: string;
      avatar_url: string;
    };
  }[];
}

interface Message {
  id: string;
  text: string;
  created_at: string;
  user_id: string;
  chat_room_id: string;
  profile: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

export default function ChatRoomScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  // Get the chat room ID from params
  const chatRoomId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (!chatRoomId || !user) return;

    const fetchChatRoom = async () => {
      let query = supabase
        .from('chat_rooms')
        .select(`
          *,
          members:chat_room_members(
            *,
            profile:profiles(*)
          )
        `)
        .eq('id', chatRoomId);

      // If it's a direct chat, we need to check both users are members
      if (!params.is_group) {
        query = query.contains('member_ids', [user.id]);
      }

      const { data: room, error } = await query.single();

      if (error) {
        console.error('Error fetching chat room:', error);
        // Navigate back if chat room not found or user doesn't have access
        router.back();
        return;
      }

      setChatRoom(room);
    };

    const fetchMessages = async () => {
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('chat_room_id', chatRoomId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(messages || []);
      setLoading(false);
    };

    fetchChatRoom();
    fetchMessages();

    // Real-time subscription for new messages
    const subscription = supabase
      .channel(`room:${chatRoomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_room_id=eq.${chatRoomId}`,
      }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages(current => [...current, newMessage]);
        // Scroll to bottom when new message arrives
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [chatRoomId, user]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user || !chatRoom) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          text: newMessage.trim(),
          chat_room_id: chatRoom.id,
          user_id: user.id,
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading || !chatRoom) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.gradient}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.headerButton}>
            <ChevronLeft color="#FF3B30" size={28} />
          </Pressable>
          <Text style={styles.headerTitle}>{chatRoom.name}</Text>
          {chatRoom.is_group && (
            <Pressable style={styles.headerButton}>
              <Users color="#FF3B30" size={24} />
            </Pressable>
          )}
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          renderItem={({ item }) => (
            <View style={[
              styles.messageContainer,
              item.user_id === user?.id ? styles.myMessage : styles.otherMessage
            ]}>
              <LinearGradient
                colors={item.user_id === user?.id ? ['#FF3B30', '#FF69B4'] : ['#333', '#444']}
                style={[styles.messageBubble]}
              >
                <Text style={styles.messageText}>{item.text}</Text>
              </LinearGradient>
              <Text style={styles.timestamp}>
                {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          )}
        />

        <KeyboardAvoidingView
          behavior={RNPlatform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={RNPlatform.OS === 'ios' ? 90 : 0}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#666"
            multiline
          />
          <Pressable onPress={handleSend} style={styles.sendButton}>
            <Send color="#FF3B30" size={24} />
          </Pressable>
        </KeyboardAvoidingView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: RNPlatform.OS === 'ios' ? 60 : 20,
    height: RNPlatform.OS === 'ios' ? 90 : 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 20,
    padding: 12,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#fff',
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
});






