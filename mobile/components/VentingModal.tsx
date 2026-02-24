import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions,
  Animated
} from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Send } from 'lucide-react-native';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';
import { useColorScheme } from '../hooks/useColorScheme';

const { width } = Dimensions.get('window');

const PROMPTS = [
  "What's the current vibe, Alfred?",
  "Capture this moment...",
  "Tell me a win from today!",
  "What are you reflecting on?",
  "Empty your mind here.",
  "Share some good news!"
];

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

  const [activePrompt, setActivePrompt] = useState(PROMPTS[0]);

  // ANIMATION VALUES
  const slideAnim = useRef(new Animated.Value(45)).current; // Panda slide
  const fadeAnim = useRef(new Animated.Value(0)).current;   // Panda fade
  const typingScale = useRef(new Animated.Value(1)).current; // Card growth when typing
  const entryAnim = useRef(new Animated.Value(0)).current;  // Modal entry pop

  useEffect(() => {
    if (isVisible) {
      const randomPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
      setActivePrompt(randomPrompt);

      // ENTRY ANIMATION: Pop the modal out
      entryAnim.setValue(0);
      Animated.spring(entryAnim, {
        toValue: 1,
        friction: 8,
        tension: 30, // Controlled speed for that "not too fast" look
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, entryAnim]);

  useEffect(() => {
    const shouldShow = note && note.length > 0;
    
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: shouldShow ? 0 : 45, 
        useNativeDriver: true,
        friction: 6,
        tension: 40,
      }),
      Animated.timing(fadeAnim, {
        toValue: shouldShow ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(typingScale, {
        toValue: shouldShow ? 1.03 : 1, 
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      })
    ]).start();
  }, [note, slideAnim, fadeAnim, typingScale]);

  return (
    <Modal
      animationType="none" // Disabled default to use our custom entryAnim
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.modalOverlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.keyboardView}
        >
          {/* Combine entry scale with typing scale */}
          <Animated.View style={{
            width: '100%',
            alignItems: 'center',
            opacity: entryAnim, // Fades in as it grows
            transform: [
              { scale: entryAnim }, // Initial bloom
              { scale: typingScale } // Typing expansion
            ]
          }}>
            
            {/* PANDA WRAPPER */}
            <View style={styles.pandaPositioner}>
              <Animated.View style={[
                styles.pandaContainer,
                { 
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }] 
                }
              ]}>
                 <Text style={{ fontSize: 36 }}>🐼</Text>
                 <View style={styles.pandaPaws}>
                    <View style={[styles.paw, { backgroundColor: isDark ? '#475569' : '#000' }]} />
                    <View style={[styles.paw, { backgroundColor: isDark ? '#475569' : '#000' }]} />
                 </View>
              </Animated.View>
            </View>

            {/* SELAH CARD */}
            <View style={[
              styles.selahCard, 
              { backgroundColor: isDark ? '#1e293b' : '#FFFFFF' }
            ]}>
              <View style={styles.verticalLine} />

              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X color={Theme.colors.muted} size={22} />
                </TouchableOpacity>
                
                <Text style={[styles.modalTitle, { color: themeColors.text }]}>Selah</Text>
                
                <TouchableOpacity 
                  onPress={onSend}
                  disabled={note.length === 0}
                  style={styles.sendButton}
                >
                  <Send 
                    color={note.length > 0 ? Theme.colors.primary : Theme.colors.muted} 
                    size={22} 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  multiline
                  placeholder={activePrompt}
                  placeholderTextColor={Theme.colors.muted}
                  style={[styles.textInput, { color: isDark ? '#cbd5e1' : '#334155' }]}
                  autoFocus={true}
                  value={note}
                  onChangeText={setNote}
                  selectionColor={Theme.colors.primary}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
  },
  pandaPositioner: {
    width: width * 0.85, 
    alignItems: 'flex-start',
    paddingLeft: 22,
    zIndex: 0,
  },
  pandaContainer: {
    marginBottom: -8, 
    alignItems: 'center',
  },
  pandaPaws: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 45,
    marginTop: -8,
  },
  paw: {
    width: 12,
    height: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  selahCard: {
    width: width * 0.85,
    height: 300, 
    borderRadius: 28,
    paddingVertical: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 15,
    zIndex: 1,
  },
  verticalLine: {
    position: 'absolute',
    left: 60,
    top: 0,
    bottom: 0,
    width: 1.5,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
    flex: 1,
    textAlign: 'center',
    marginRight: 10,
  },
  closeButton: { 
    width: 40,
    alignItems: 'flex-start',
  },
  sendButton: { 
    width: 40,
    alignItems: 'flex-end',
  },
  inputWrapper: {
    flex: 1,
    paddingLeft: 75,
    paddingRight: 25,
  },
  textInput: {
    flex: 1,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '400',
  },
});