import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Plus } from 'lucide-react-native';

interface FABProps {
  onPress?: () => void; // The ? makes it optional
}

export function FAB({ onPress }: FABProps) {
  return (
    <TouchableOpacity 
      style={styles.button} 
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Plus color="white" size={28} strokeWidth={3} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 25, 
    bottom: Platform.OS === 'ios' ? 100 : 50, 
    width: 64,
    height: 64,
    borderRadius: 25,
    backgroundColor: '#000', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    zIndex: 9999, // High z-index to stay above tabs
  },
    scrollContent: { 
    paddingTop: 10, 
    paddingBottom: 160, // Keep this high so the last item clears the FAB
    alignItems: 'center' 
    },
});