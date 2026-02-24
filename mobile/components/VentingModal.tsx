import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
//   Dimensions
} from 'react-native';
import { X, Send } from 'lucide-react-native';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';
import { useColorScheme } from '../hooks/useColorScheme';

// const { width } = Dimensions.get('window');

interface VentingModalProps {
  isVisible: boolean;
  onClose: () => void;
  note: string;
  setNote: (text: string) => void;
  onSend: () => void;
}

export default function VentingModal({ isVisible, onClose, note, setNote, onSend }: VentingModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={[
            styles.modalContent, 
            { backgroundColor: isDark ? '#1e293b' : '#FFF' }
          ]}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color={Theme.colors.muted} size={24} />
            </TouchableOpacity>
            
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>New Rant</Text>
            
            <TouchableOpacity 
              onPress={onSend}
              disabled={note.length === 0}
              style={styles.sendButton}
            >
              <Send 
                color={note.length > 0 ? Theme.colors.primary : Theme.colors.muted} 
                size={24} 
              />
            </TouchableOpacity>
          </View>

          {/* Input Area */}
          <View style={styles.inputWrapper}>
            <View style={[styles.miniPanda, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
              <Text style={{ fontSize: 18 }}>🐼</Text>
            </View>
            
            <TextInput
              multiline
              placeholder="What's bothering you, Alfred?"
              placeholderTextColor={Theme.colors.muted}
              style={[styles.textInput, { color: themeColors.text }]}
              autoFocus={true}
              value={note}
              onChangeText={setNote}
              selectionColor={Theme.colors.primary}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Dimmed background
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '85%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  closeButton: {
    padding: 4,
  },
  sendButton: {
    padding: 4,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  miniPanda: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 19,
    lineHeight: 26,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
});