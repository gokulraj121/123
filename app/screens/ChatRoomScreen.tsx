import { View, Text, StyleSheet, TextInput, FlatList, Image, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Users, Send, Paperclip, Camera } from 'lucide-react-native';
import { useState, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  isMe: boolean;
}

interface ChatRoom {
  id: string;
  name: string;
  avatar?: string;
  isGroup: boolean;
  members?: {
    id: string;
    name: string;
    avatar?: string;
  }[];
}

// Mock data - replace with actual data from your backend
const mockCurrentUser = {
  id: 'current-user',
  name: 'Me',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
};

const mockMessages: Message[] = [
  {
    id: '1',
    text: "Hey everyone! Who's up for a game?",
    sender: {
      id: 'user1',
      name: 'Alice',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    timestamp: '10:30 AM',
    isMe: false,
  },
  {
    id: '2',
    text: "I'm in! What are we playing?",
    sender: {
      id: 'current-user',
      name: 'Me',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    timestamp: '10:31 AM',
    isMe: true,
  },
  // Add more mock messages as needed
];

export default function ChatRoomScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const chatRoom: ChatRoom = {
    id: id as string,
    name: 'Gaming Squad',
    isGroup: true,
    members: [
      { id: 'user1', name: 'Alice', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
      { id: 'user2', name: 'Bob', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
      { id: 'user3', name: 'Charlie', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
    ],
  };

  if (!id) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.errorContainer}>
          <Text style={styles.errorText}>Invalid chat room</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </LinearGradient>
      </View>
    );
  }

  const handleSend = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: mockCurrentUser,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
      };

      setMessages([...messages, message]);
      setNewMessage('');
      
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.isMe ? styles.myMessage : styles.otherMessage]}>
      {!item.isMe && chatRoom.isGroup && (
        <Text style={styles.senderName}>{item.sender.name}</Text>
      )}
      <View style={[styles.messageBubble, item.isMe ? styles.myBubble : styles.otherBubble]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.gradient}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <ChevronLeft color="#FF3B30" size={24} />
          </Pressable>
          <Text style={styles.headerTitle}>{chatRoom.name}</Text>
          {chatRoom.isGroup && (
            <Pressable style={styles.headerButton}>
              <Users color="#FF3B30" size={24} />
            </Pressable>
          )}
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.chatContainer}
          keyboardVerticalOffset={0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <Pressable style={styles.attachButton}>
                <Paperclip color="#888" size={24} />
              </Pressable>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor="#666"
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
                maxHeight={100}
              />
              <Pressable style={styles.cameraButton}>
                <Camera color="#888" size={24} />
              </Pressable>
              <Pressable 
                style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
                onPress={handleSend}
                disabled={!newMessage.trim()}
              >
                <Send color={newMessage.trim() ? '#FF3B30' : '#666'} size={24} />
              </Pressable>
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    height: Platform.OS === 'ios' ? 90 : 60,
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
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  senderName: {
    color: '#888',
    fontSize: 12,
    marginBottom: 2,
    marginLeft: 12,
  },
  messageBubble: {
    borderRadius: 20,
    padding: 12,
  },
  myBubble: {
    backgroundColor: '#FF3B30',
  },
  otherBubble: {
    backgroundColor: '#333',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputWrapper: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: '#1a1a1a',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  attachButton: {
    padding: 4,
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 8,
    color: '#fff',
    fontSize: 16,
    minHeight: 36,
    maxHeight: 100,
  },
  cameraButton: {
    padding: 4,
  },
  sendButton: {
    padding: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

