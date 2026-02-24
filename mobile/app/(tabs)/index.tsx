import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,   
  StatusBar,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { ChevronRight, Bell } from 'lucide-react-native';
import { Theme } from '../../constants/theme';
import { Colors } from '../../constants/colors';
import { GlobalStyles } from '../../styles/global';
import { useColorScheme } from '../../hooks/useColorScheme';

import VentingModal from '../../components/VentingModal';
import { FAB } from '../../components/navigation/FloatingActionButton';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const isTablet = width > 600;
  const contentWidth = isTablet ? 600 : width;

  const [isVenting, setIsVenting] = useState(false);
  const [note, setNote] = useState('');

  // --- Date Logic ---
  const today = new Date();
  const startOfWeek = new Date(today);
  const dayIndex = today.getDay(); 
  startOfWeek.setDate(today.getDate() - dayIndex);
  startOfWeek.setHours(0, 0, 0, 0);

  const weekLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'Sa'];
  const calendarDays = weekLabels.map((label, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    return {
      label,
      dateNum: date.getDate(),
      isToday: date.getFullYear() === today.getFullYear() &&
               date.getMonth() === today.getMonth() &&
               date.getDate() === today.getDate(),
    };
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.adaptiveWrapper, { maxWidth: contentWidth }]}>
          
          {/* 1. Header */}
          <View style={styles.header}>
            <View>
              <Text style={[GlobalStyles.title, { fontSize: isTablet ? 32 : width * 0.07, color: isDark ? Theme.colors.muted : themeColors.text }]}>
                Hey Alfred!
              </Text>
            </View>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
              <Bell size={isTablet ? 28 : width * 0.06} color={themeColors.text} />
              <View style={[styles.notifDot, { right: isTablet ? 8 : width * 0.02 }]} />
            </TouchableOpacity>
          </View>

          {/* 2. Calendar Strip */}
          <View style={styles.calendarContainer}>
            {calendarDays.map((item, i) => {
              const circleSize = isTablet ? 45 : width * 0.1;
              return (
                <View key={i} style={styles.dayCol}>
                  <Text style={[styles.dayText, { color: Theme.colors.muted, fontSize: isTablet ? 14 : width * 0.03 }]}>{item.label}</Text>
                  <View style={[styles.dateCircle, { width: circleSize, height: circleSize, borderRadius: circleSize / 2, backgroundColor: item.isToday ? Theme.colors.primary : 'transparent' }]}>
                    <Text style={[styles.dateText, { color: item.isToday ? '#FFF' : themeColors.text, fontSize: isTablet ? 16 : width * 0.035 }]}>{item.dateNum}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* 3. Panda Hero Zone (Static) */}
          <View style={styles.pandaHero}>
            <View style={[styles.pandaPlaceholder, { backgroundColor: themeColors.card, borderColor: themeColors.border, width: isTablet ? 220 : width * 0.45, height: isTablet ? 220 : width * 0.45, borderRadius: isTablet ? 110 : (width * 0.45) / 2 }]}>
               <Text style={{color: Theme.colors.muted, fontSize: isTablet ? 16 : width * 0.035}}>Panda Vibe Area</Text>
            </View>
            <Text style={[styles.promptText, { color: isDark ? Theme.colors.muted : themeColors.text, fontSize: isTablet ? 22 : width * 0.045 }]}>What&apos;s on your mind?</Text>
            <Text style={[styles.tapInstruction, { color: Theme.colors.primary }]}>Tap + to Selah</Text>
          </View>

          {/* 4. History */}
          <View style={styles.historySection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: isDark ? Theme.colors.muted : themeColors.text, fontSize: isTablet ? 20 : width * 0.045 }]}>Selah History</Text>
              <TouchableOpacity><Text style={{ color: Theme.colors.primary, fontWeight: '600', fontSize: isTablet ? 16 : width * 0.035 }}>See All</Text></TouchableOpacity>
            </View>
            <TouchableOpacity style={[GlobalStyles.card, { backgroundColor: themeColors.card }]}>
              <View style={styles.transactionContent}>
                <View style={[styles.vibeIndicator, { backgroundColor: Theme.colors.accent, height: isTablet ? 40 : width * 0.08 }]} />
                <View style={styles.transactionInfo}>
                  <Text style={[GlobalStyles.text, { fontWeight: '600', fontSize: isTablet ? 18 : width * 0.038, color: themeColors.text }]} numberOfLines={1}>Work stress is peaking today...</Text>
                  <Text style={{ color: Theme.colors.muted, fontSize: isTablet ? 14 : width * 0.03 }}>Yesterday 6:40 PM</Text>
                </View>
                <ChevronRight size={isTablet ? 24 : width * 0.045} color={Theme.colors.muted} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button Trigger */}
      <FAB onPress={() => setIsVenting(true)} />

      <VentingModal 
        isVisible={isVenting}
        onClose={() => setIsVenting(false)}
        note={note}
        setNote={setNote}
        onSend={() => {
          console.log("Sent:", note);
          setIsVenting(false);
          setNote('');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { paddingTop: 10, paddingBottom: 140, alignItems: 'center' },
  adaptiveWrapper: { width: '100%', paddingHorizontal: width * 0.06 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 30 },
  iconButton: { padding: 10, borderRadius: 12, borderWidth: 1, position: 'relative' },
  notifDot: { position: 'absolute', top: 10, width: 8, height: 8, backgroundColor: '#ef4444', borderRadius: 4, borderWidth: 1.5, borderColor: '#FFF' },
  calendarContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, paddingHorizontal: 5 },
  dayCol: { alignItems: 'center', flex: 1 },
  dayText: { fontWeight: '600', marginBottom: 10 },
  dateCircle: { justifyContent: 'center', alignItems: 'center' },
  dateText: { fontWeight: '700' },
  pandaHero: { alignItems: 'center', marginVertical: 20, width: '100%' },
  pandaPlaceholder: { borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  promptText: { fontWeight: '700', textAlign: 'center' },
  tapInstruction: { marginTop: 8,fontWeight: '500',fontSize: 13,opacity: 0.7,letterSpacing: 0.4, fontStyle: 'italic',},
  historySection: { marginTop: 30, width: '100%' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontWeight: '700' },
  transactionContent: { flexDirection: 'row', alignItems: 'center' },
  vibeIndicator: { width: 4, borderRadius: 2, marginRight: 12 },
  transactionInfo: { flex: 1 },
});