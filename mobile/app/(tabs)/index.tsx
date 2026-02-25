import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView, Animated, Easing, Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Send, Bird } from 'lucide-react-native'; 

import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { useColorScheme } from '../../hooks/useColorScheme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme] as any;
  
  const [note, setNote] = useState('');
  const [entriesToday, setEntriesToday] = useState(0);

  // --- FLOATING ANIMATION ---
  const floatAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15], 
  });

  const handleSaveSelah = () => {
    if (note.trim().length > 0) {
      setEntriesToday(prev => prev + 1);
      setNote('');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: theme.text }]}>Selah</Text>
              <Text style={[styles.subtitle, { color: theme.tabInactive }]}>
                Pause and find peace
              </Text>
            </View>
            <TouchableOpacity hitSlop={15}>
              <Settings size={22} color={theme.text} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>

          {/* RESPONSIVE SPACER: This pushes the content down based on screen height */}
          <View style={{ height: SCREEN_HEIGHT * 0.05 }} />

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Animated.View style={{ transform: [{ translateY }] }}>
              <View style={styles.doveContainer}>
                <Bird size={SCREEN_HEIGHT * 0.1} color={theme.primary} strokeWidth={1.2} fill="#FFF1F0" />
              </View>
            </Animated.View>
            <Text style={[styles.instructionText, { color: theme.text }]}>
              Write your thoughts and feelings here.{"\n"}
              Selah&apos;s listening. 🕊️
            </Text>
          </View>

          {/* Main Selah Card */}
          <View style={[styles.card, { 
            backgroundColor: theme.background, 
            borderColor: theme.border,
            borderRadius: Theme.roundness.large 
          }]}>
            <View style={[styles.inputContainer, { backgroundColor: theme.cardBackground }]}>
              <TextInput
                style={[styles.textInput, { color: theme.text }]}
                placeholder="How are you feeling today?"
                placeholderTextColor={theme.tabInactive}
                multiline
                value={note}
                onChangeText={setNote}
                blurOnSubmit={true}
                onSubmitEditing={handleSaveSelah}
                returnKeyType="send"
              />
            </View>

            <View style={styles.cardFooter}>
              <Text style={[styles.entryCount, { color: theme.tabInactive }]}>
                {entriesToday} entries today
              </Text>
              
              <TouchableOpacity 
                onPress={handleSaveSelah}
                disabled={note.trim().length === 0}
                style={[
                  styles.saveButton, 
                  { 
                    backgroundColor: note.trim().length > 0 ? (theme.primaryDark || '#FF7B66') : theme.primary,
                    opacity: note.trim().length > 0 ? 1 : 0.6 
                  }
                ]}
              >
                <Send size={18} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>Save Selah</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* BOTTOM SPACER: Ensures the card doesn't hit the bottom on huge tablets */}
          <View style={{ height: SCREEN_HEIGHT * 0.1 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { 
    paddingHorizontal: Theme.spacing.lg, 
    paddingTop: 10,
    flexGrow: 1, // Crucial for responsive vertical centering
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10
  },
  title: { 
    fontSize: 34, 
    fontWeight: '800', 
    letterSpacing: -1.5,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontStyle: 'italic',
    transform: [{ skewX: '-2deg' }]
  },
  subtitle: { 
    fontSize: 15, 
    marginTop: 2,
    fontWeight: '500'
  },
  heroSection: { 
    alignItems: 'center', 
    marginBottom: 30,
  },
  doveContainer: { 
    marginBottom: 15,
    shadowColor: '#FF9E8D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  instructionText: { 
    textAlign: 'center', 
    fontSize: 18, 
    lineHeight: 26, 
    fontWeight: '500',
    opacity: 0.9
  },
  card: { 
    borderWidth: 1, 
    padding: Theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3
  },
  inputContainer: { 
    borderRadius: Theme.roundness.medium, 
    minHeight: SCREEN_HEIGHT * 0.2, // Responsive height for the input area
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md
  },
  textInput: { 
    fontSize: 18, 
    lineHeight: 26, 
    textAlignVertical: 'top' 
  },
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  entryCount: { 
    fontSize: 14, 
    fontWeight: '600' 
  },
  saveButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12, 
    paddingHorizontal: 22, 
    borderRadius: 30,
  },
  saveButtonText: { 
    color: '#FFF', 
    fontWeight: '700', 
    fontSize: 15 
  }
});