import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  Animated, Platform, KeyboardAvoidingView, FlatList, Dimensions, Keyboard 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../../constants/theme';
import { Colors } from '../../constants/colors';
import { useColorScheme } from '../../hooks/useColorScheme';

const { width } = Dimensions.get('window');
const LINE_HEIGHT = 40; 
const MARGIN_LEFT = 50; 

export default function SelahScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const [note, setNote] = useState('');
  const [history, setHistory] = useState<{id: string, text: string, index: number}[]>([]);
  const [pandaSide, setPandaSide] = useState<'left' | 'right'>('right');

  const pandaPopAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (note.length > 0) {
      Animated.spring(pandaPopAnim, { toValue: 1, friction: 8, useNativeDriver: true }).start();
    } else {
      Animated.timing(pandaPopAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    }
  }, [note.length]);

  const handleAction = () => {
    if (note.trim().length > 0) {
      setHistory([{ id: Date.now().toString(), text: note, index: history.length + 1 }, ...history]);
      setNote('');
      setPandaSide(prev => prev === 'left' ? 'right' : 'left');
      // Dismissing keyboard on submit helps prevent UI jumps on some tablets
      // Keyboard.dismiss(); 
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // 'padding' is best for iOS, but 'height' is the secret for Android/Tablets
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // We set offset to 0 because we are inside a SafeAreaView which handles the status bar
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} 
      >
        <View style={styles.inner}>
          
          {/* NOTEBOOK LIST SECTION */}
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.entryRow}>
                <View style={styles.marginArea}>
                  <Text style={[styles.entryNumber, { color: themeColors.text }]}>{item.index}</Text>
                </View>
                <View style={styles.entryContent}>
                  <Text numberOfLines={1} style={[styles.inkStroke, { color: isDark ? '#475569' : '#94a3b8' }]}>{item.text}</Text>
                  <LinearGradient
                    colors={isDark ? ['rgba(15, 23, 42, 1)', 'rgba(30, 58, 138, 0)'] : ['rgba(255, 255, 255, 1)', 'rgba(219, 234, 254, 0)']}
                    start={{ x: 0, y: 0 }} end={{ x: 0.7, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                </View>
              </View>
            )}
            ListHeaderComponent={() => (
              <View style={styles.entryRow}>
                <View style={styles.marginArea}>
                  <Text style={[styles.entryNumber, { color: themeColors.text }]}>{history.length + 1}</Text>
                </View>
                <Text style={[styles.activeNoteText, { color: themeColors.text, paddingLeft: 15 }]}>{note}</Text>
              </View>
            )}
            contentContainerStyle={{ paddingTop: 40, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          />

          {/* FLOATING INPUT AREA - Fixed at the bottom of the container */}
          <View style={styles.inputWrapper}>
            <Animated.View
              style={[styles.panda, {
                [pandaSide]: 45,
                transform: [
                  { translateY: pandaPopAnim.interpolate({ inputRange: [0, 1], outputRange: [40, -68] }) },
                  { rotate: pandaSide === 'left' ? '-10deg' : '10deg' },
                ],
                opacity: pandaPopAnim
              }]}
            >
              <Text style={{ fontSize: 40 }}>🐼</Text>
            </Animated.View>

            <View style={[styles.pod, { 
              backgroundColor: isDark ? '#1e293b' : '#FFF',
              borderColor: isDark ? '#334155' : '#E2E8F0' 
            }]}>
              <View style={styles.podContent}>
                <TextInput
                  placeholder="Write your Selah..."
                  placeholderTextColor="#94a3b8"
                  style={[styles.textInput, { color: themeColors.text }]}
                  value={note}
                  onChangeText={setNote}
                  cursorColor={Theme.colors.primary}
                  // This ensures the keyboard behavior triggers correctly
                  multiline={false} 
                />
                <TouchableOpacity 
                  onPress={handleAction} 
                  style={[styles.fab, { backgroundColor: Theme.colors.primary }]}
                >
                  <Check size={26} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    justifyContent: 'flex-end', // Pushes the input area to the bottom
  },
  entryRow: { flexDirection: 'row', alignItems: 'flex-start' },
  marginArea: { width: MARGIN_LEFT, alignItems: 'center' },
  entryNumber: { fontSize: 13, opacity: 0.3, lineHeight: LINE_HEIGHT, fontFamily: 'monospace' },
  activeNoteText: { flex: 1, fontSize: 17, lineHeight: LINE_HEIGHT, fontWeight: '500' },
  entryContent: { flex: 1, height: LINE_HEIGHT - 4, overflow: 'hidden', justifyContent: 'center', paddingLeft: 1 },
  inkStroke: { fontSize: 22, fontWeight: '900', letterSpacing: -5, transform: [{ skewX: '-20deg' }], opacity: 0.8 },
  
  inputWrapper: { 
    paddingHorizontal: 20, 
    paddingBottom: Platform.OS === 'ios' ? 10 : 20, // Adjusted for different devices
    paddingTop: 10,
    width: '100%',
  },
  panda: { position: 'absolute', zIndex: -1 },
  pod: { 
    width: '100%', 
    height: 74, 
    borderRadius: 24, 
    borderWidth: 1, 
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  podContent: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingLeft: 20, 
    paddingRight: 8 
  },
  textInput: { flex: 1, fontSize: 17, fontWeight: '500' },
  fab: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
});