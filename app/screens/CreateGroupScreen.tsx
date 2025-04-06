import { View, Text, StyleSheet, TextInput, Pressable, Image, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Search, X, ChevronLeft, Check } from 'lucide-react-native';
import { useState } from 'react';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  selected?: boolean;
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Parker',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '2',
    name: 'John Smith',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  // Add more mock contacts as needed
];

export default function CreateGroupScreen({ navigation, onGroupCreated }: any) {
  const [groupName, setGroupName] = useState('');
  const [contacts, setContacts] = useState(mockContacts);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);

  const toggleContact = (contact: Contact) => {
    if (selectedContacts.find(c => c.id === contact.id)) {
      setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedContacts.length > 0) {
      const newGroup = {
        name: groupName.trim(),
        members: selectedContacts.map(contact => ({
          id: contact.id,
          name: contact.name,
          avatar: contact.avatar
        })),
        description: '', // Optional: Add description field if needed
      };
      
      // Pass the created group back to the chat screen
      onGroupCreated(newGroup);
      navigation.goBack();
    }
  };

  const renderContact = ({ item }: { item: Contact }) => {
    const isSelected = selectedContacts.some(c => c.id === item.id);
    
    return (
      <Pressable
        style={[styles.contactItem, isSelected && styles.contactItemSelected]}
        onPress={() => toggleContact(item)}
      >
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.contactName}>{item.name}</Text>
        {isSelected && (
          <View style={styles.checkmark}>
            <Check color="#fff" size={16} />
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft color="#FF3B30" size={28} />
        </Pressable>
        <Text style={styles.title}>New Group</Text>
        <Pressable
          onPress={handleCreateGroup}
          style={[
            styles.createButton,
            (!groupName.trim() || selectedContacts.length === 0) && styles.createButtonDisabled
          ]}
          disabled={!groupName.trim() || selectedContacts.length === 0}
        >
          <Text style={styles.createButtonText}>Create</Text>
        </Pressable>
      </View>

      <View style={styles.groupNameContainer}>
        <Users color="#FF3B30" size={24} />
        <TextInput
          style={styles.groupNameInput}
          placeholder="Group Name"
          placeholderTextColor="#666"
          value={groupName}
          onChangeText={setGroupName}
        />
      </View>

      <View style={styles.selectedContainer}>
        <FlatList
          data={selectedContacts}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.selectedContact}>
              <Image source={{ uri: item.avatar }} style={styles.selectedAvatar} />
              <Pressable
                style={styles.removeButton}
                onPress={() => toggleContact(item)}
              >
                <X color="#fff" size={12} />
              </Pressable>
            </View>
          )}
        />
      </View>

      <View style={styles.searchContainer}>
        <Search color="#888" size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts"
          placeholderTextColor="#666"
        />
      </View>

      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contactList}
      />
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
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  groupNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    margin: 20,
    padding: 15,
    borderRadius: 15,
  },
  groupNameInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
  selectedContainer: {
    height: 70,
    paddingHorizontal: 20,
  },
  selectedContact: {
    marginRight: 10,
  },
  selectedAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    margin: 20,
    padding: 10,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    marginLeft: 10,
  },
  contactList: {
    padding: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  contactItemSelected: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  contactName: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  checkmark: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
