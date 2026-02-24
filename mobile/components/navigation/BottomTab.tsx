import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Home, NotebookPen, PawPrint, User } from 'lucide-react-native'; //
import { Colors } from '../../constants/colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export function BottomTab({ state, descriptors, navigation }: BottomTabBarProps) {
  const colorScheme = (useColorScheme() ?? 'light') as keyof typeof Colors;
  const themeColors = Colors[colorScheme];

  // Map icons to the route names defined in your (tabs)/_layout.tsx
  const iconMap: Record<string, React.ElementType> = {
    index: Home,
    selah: PawPrint, // Panda placeholder
    notes: NotebookPen,
    profile: User,
  };

  return (
    <View style={[
      styles.container, 
      { backgroundColor: themeColors.background, borderTopColor: themeColors.border }
    ]}>
      {state.routes.map((route, index) => {
  // If the route name isn't in our iconMap, don't render it at all
        if (!iconMap[route.name]) return null;

        const isFocused = state.index === index;
        const Icon = iconMap[route.name];

        return (
            <TouchableOpacity
            key={route.key}
            onPress={() => !isFocused && navigation.navigate(route.name)}
            style={styles.tabItem}
            activeOpacity={0.7}
            >
            <Icon 
                size={28} 
                color={isFocused ? themeColors.tint : themeColors.tabIconDefault} 
                strokeWidth={isFocused ? 2.5 : 2}
            />
            </TouchableOpacity>
                );
            })}
       
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // Tall, premium height
    height: Platform.OS === 'ios' ? 105 : 90, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingTop: 15,
    borderTopWidth: 1,
    paddingHorizontal: 15,
    // Soft shadow for elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 25,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});