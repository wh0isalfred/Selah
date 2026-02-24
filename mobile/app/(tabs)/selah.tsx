import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  Animated, Platform, KeyboardAvoidingView, Keyboard, FlatList, Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, Check, Send } from 'lucide-react-native';
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

  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState<{id: string, text: string, index: number}[]>([]);
  const [pandaSide, setPandaSide] = useState<'left' | 'right'>('right');

  const morphAnim = useRef(new Animated.Value(0)).current; 
  const iconAnim = useRef(new Animated.Value(0)).current;  
  const pandaPopAnim = useRef(new Animated.Value(0)).current;
  const barAnims = useRef([
    new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0),
  ]).current;

  useEffect(() => {
    Animated.timing(morphAnim, { toValue: isListening ? 1 : 0, duration: 350, useNativeDriver: false }).start();
    Animated.timing(iconAnim, { toValue: isListening ? 1 : 0, duration: 350, useNativeDriver: true }).start();
    
    if (isListening) {
      const animations = barAnims.map((anim, i) => 
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, { toValue: 1, duration: 200 + (i * 50), useNativeDriver: false }),
            Animated.timing(anim, { toValue: 0, duration: 200 + (i * 50), useNativeDriver: false }),
          ])
        )
      );
      Animated.parallel(animations).start();
    }
  }, [isListening]);

  useEffect(() => {
    if (note.length > 0 || isListening) {
      Animated.spring(pandaPopAnim, { toValue: 1, friction: 8, useNativeDriver: true }).start();
    } else {
      Animated.timing(pandaPopAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    }
  }, [note.length, isListening]);

  const handleAction = () => {
    if (isListening) setIsListening(false);
    if (note.trim().length > 0) {
      setHistory([{ id: Date.now().toString(), text: note, index: history.length + 1 }, ...history]);
      setNote('');
      setPandaSide(prev => prev === 'left' ? 'right' : 'left');
      Keyboard.dismiss();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} 
        >
          {/* 1. NOTEBOOK AREA (FLEX 1 ensures it shrinks) */}
          <View style={{ flex: 1 }}>
            <View style={styles.notebookLines} pointerEvents="none">
              <View style={[styles.redMarginLine, { backgroundColor: isDark ? '#ef4444' : '#f87171', opacity: 0.12 }]} />
              {[...Array(30)].map((_, i) => (
                <View key={i} style={[styles.line, { backgroundColor: isDark ? '#334155' : '#cbd5e1' }]} />
              ))}
            </View>

            <FlatList
              data={history}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.entryRow}>
                  <View style={styles.marginArea}><Text style={[styles.entryNumber, { color: themeColors.text }]}>{item.index}</Text></View>
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
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={() => (
                <View style={styles.entryRow}>
                  <View style={styles.marginArea}><Text style={[styles.entryNumber, { color: themeColors.text }]}>{history.length + 1}</Text></View>
                  <Text style={[styles.activeNoteText, { color: themeColors.text, paddingLeft: 15 }]}>{note}</Text>
                </View>
              )}
            />
          </View>

          {/* 2. FIXED INPUT AREA */}
          <View style={styles.inputWrapper}>
            <Animated.View style={[styles.panda, { 
                [pandaSide]: 45,
                transform: [{ translateY: pandaPopAnim.interpolate({ inputRange: [0, 1], outputRange: [40, -68] }) }, { rotate: pandaSide === 'left' ? '-10deg' : '10deg' }],
                opacity: pandaPopAnim
            }]}>
              <Text style={{ fontSize: 40 }}>🐼</Text>
            </Animated.View>

            <View style={[styles.pod, { backgroundColor: isDark ? '#1e293b' : '#FFF', borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
              <Animated.View style={[styles.blackOut, { width: morphAnim.interpolate({ inputRange: [0, 1], outputRange: [0, width - 40] }) }]} />

              <View style={styles.podContent}>
                {!isListening ? (
                  <View style={styles.inputRow}>
                    <TextInput
                      placeholder="Speak your Selah..."
                      placeholderTextColor="#94a3b8"
                      style={[styles.textInput, { color: themeColors.text }]}
                      value={note}
                      onChangeText={setNote}
                      cursorColor={Theme.colors.primary}
                    />
                    <TouchableOpacity onPress={() => setIsListening(true)} style={styles.iconPadding}>
                      <Mic size={20} color="#94a3b8" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.listeningRow}>
                    <View style={styles.visualizer}>
                      {barAnims.map((anim, i) => (
                        <Animated.View key={i} style={[styles.bar, { 
                          height: anim.interpolate({ inputRange: [0, 1], outputRange: [8, 26] }),
                          backgroundColor: '#FFF'
                        }]} />
                      ))}
                    </View>
                    <Text style={styles.listeningText}>Listening....</Text>
                  </View>
                )}

                <View style={styles.fabContainer}>
                  <TouchableOpacity onPress={handleAction} style={[styles.fab, { backgroundColor: Theme.colors.primary }]}>
                    <Animated.View style={styles.iconContainerInner}>
                      <Animated.View style={{ 
                        ...StyleSheet.absoluteFillObject,
                        justifyContent: 'center', alignItems: 'center',
                        opacity: iconAnim.interpolate({ inputRange: [0, 0.4], outputRange: [1, 0] }),
                        transform: [{ rotate: iconAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }]
                      }}>
                        <Send size={22} color="#FFF" />
                      </Animated.View>
                      
                      <Animated.View style={{ 
                        ...StyleSheet.absoluteFillObject,
                        justifyContent: 'center', alignItems: 'center',
                        opacity: iconAnim.interpolate({ inputRange: [0.6, 1], outputRange: [0, 1] }),
                        transform: [{ rotate: iconAnim.interpolate({ inputRange: [0, 1], outputRange: ['-180deg', '0deg'] }) }]
                      }}>
                        <Check size={26} color="#FFF" />
                      </Animated.View>
                    </Animated.View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notebookLines: { ...StyleSheet.absoluteFillObject, paddingTop: 40 },
  line: { width: '100%', height: 1, marginBottom: LINE_HEIGHT - 1, opacity: 0.15 },
  redMarginLine: { position: 'absolute', left: MARGIN_LEFT, width: 1.5, height: '100%' },
  listContent: { paddingBottom: 20, paddingTop: 40 },
  entryRow: { flexDirection: 'row', alignItems: 'flex-start' },
  marginArea: { width: MARGIN_LEFT, alignItems: 'center' },
  entryNumber: { fontSize: 13, opacity: 0.3, lineHeight: LINE_HEIGHT, fontFamily: 'monospace' },
  activeNoteText: { flex: 1, fontSize: 17, lineHeight: LINE_HEIGHT, fontWeight: '500' },
  entryContent: { flex: 1, height: LINE_HEIGHT - 4, overflow: 'hidden', justifyContent: 'center', paddingLeft: 15 }, // SHIFTED TEXT
  inkStroke: { fontSize: 22, fontWeight: '900', letterSpacing: -5, transform: [{ skewX: '-20deg' }], opacity: 0.8 },
  inputWrapper: { paddingHorizontal: 20, paddingBottom: 20 },
  panda: { position: 'absolute', zIndex: -1 },
  pod: { width: '100%', height: 74, borderRadius: 24, overflow: 'hidden', borderWidth: 1, elevation: 12 },
  blackOut: { position: 'absolute', right: 0, height: '100%', backgroundColor: '#09090b' },
  podContent: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingRight: 8 },
  inputRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  textInput: { flex: 1, fontSize: 17, fontWeight: '500' },
  iconPadding: { padding: 10 },
  listeningRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  visualizer: { flexDirection: 'row', alignItems: 'center', height: 35, marginRight: 15 },
  bar: { width: 3.5, borderRadius: 2, marginHorizontal: 2 },
  listeningText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  fabContainer: { width: 58, height: 58, justifyContent: 'center', alignItems: 'center' },
  fab: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  iconContainerInner: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }, // FIXED SIZE FOR CENTERING
});