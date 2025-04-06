import { View, Text, StyleSheet, Pressable, Modal, TextInput, Keyboard, KeyboardAvoidingView, Platform, BackHandler } from 'react-native';
import { Users, UserPlus, X, ChevronLeft } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface AddChatModalProps {
  visible: boolean;
  onClose: () => void;
  onNewContact: () => void;
  onNewGroup: (groupData: { name: string; description: string }) => void;
}

export default function AddChatModal({ visible, onClose, onNewContact, onNewGroup }: AddChatModalProps) {
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const buttonOpacity = useSharedValue(1);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        buttonOpacity.value = withTiming(0);
      }
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        buttonOpacity.value = withTiming(1);
      }
    );

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showGroupModal) {
        if (isKeyboardVisible) {
          Keyboard.dismiss();
          return true;
        }
        handleGroupCancel();
        return true;
      }
      return false;
    });

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
      backHandler.remove();
    };
  }, [showGroupModal, isKeyboardVisible]);

  const handleGroupCreate = () => {
    if (groupName.trim()) {
      Keyboard.dismiss();
      onNewGroup({ name: groupName.trim(), description: groupDescription.trim() });
      setShowGroupModal(false);
      setGroupName('');
      setGroupDescription('');
      onClose();
    }
  };

  const handleGroupCancel = () => {
    Keyboard.dismiss();
    setShowGroupModal(false);
    setGroupName('');
    setGroupDescription('');
  };

  const handleNewGroupPress = () => {
    setShowGroupModal(true);
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonOpacity.value === 0 ? 100 : 0 }],
  }));

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible && !showGroupModal}
        onRequestClose={onClose}
      >
        <Pressable style={styles.overlay} onPress={onClose}>
          <View style={styles.modalContent}>
            <Pressable style={styles.option} onPress={onNewContact}>
              <UserPlus color="#FF3B30" size={24} />
              <Text style={styles.optionText}>New Contact</Text>
            </Pressable>
            
            <View style={styles.divider} />
            
            <Pressable style={styles.option} onPress={handleNewGroupPress}>
              <Users color="#FF3B30" size={24} />
              <Text style={styles.optionText}>New Group</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showGroupModal}
        onRequestClose={() => {
          if (isKeyboardVisible) {
            Keyboard.dismiss();
          } else {
            handleGroupCancel();
          }
        }}
      >
        <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.fullScreenContainer}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardView}
          >
            {/* Header */}
            <View style={styles.header}>
              <Pressable onPress={handleGroupCancel} style={styles.backButton}>
                <ChevronLeft color="#FF3B30" size={28} />
              </Pressable>
              <Text style={styles.headerTitle}>New Group</Text>
              <Pressable 
                onPress={handleGroupCreate}
                style={[
                  styles.createButton,
                  !groupName.trim() && styles.createButtonDisabled
                ]}
                disabled={!groupName.trim()}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </Pressable>
            </View>

            {/* Group Icon and Name */}
            <View style={styles.groupInfoSection}>
              <View style={styles.groupIconPlaceholder}>
                <Users color="#FF3B30" size={32} />
              </View>
              <TextInput
                style={styles.groupNameInput}
                placeholder="Group Name"
                placeholderTextColor="#666"
                value={groupName}
                onChangeText={setGroupName}
                returnKeyType="next"
                maxLength={30}
              />
            </View>

            {/* Description Input */}
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Group Description</Text>
              <TextInput
                style={styles.descriptionInput}
                placeholder="What's this group about?"
                placeholderTextColor="#666"
                value={groupDescription}
                onChangeText={setGroupDescription}
                multiline
                numberOfLines={4}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                maxLength={200}
              />
              <Text style={styles.characterCount}>
                {groupDescription.length}/200
              </Text>
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  centerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2d2d2d',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  groupModalContent: {
    backgroundColor: '#2d2d2d',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    marginBottom: Platform.OS === 'ios' ? 0 : 20,
  },
  groupModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  groupModalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#444',
  },
  createButton: {
    backgroundColor: '#FF3B30',
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fullScreenContainer: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  groupInfoSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  groupIconPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupNameInput: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 59, 48, 0.3)',
  },
  descriptionSection: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    margin: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '600',
  },
  descriptionInput: {
    color: '#fff',
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
    paddingTop: 8,
  },
  characterCount: {
    color: '#666',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
});


