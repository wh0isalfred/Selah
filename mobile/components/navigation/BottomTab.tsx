import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Bird, BookOpen, User } from 'lucide-react-native'; 
import { Colors } from '../../constants/colors';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function BottomTabNavigator({ state, descriptors, navigation }: any) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme] as any;

  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Determine which icon to show based on route name
        let IconComponent = Bird;
        let label = "Selah";

        if (route.name === 'notes') {
          IconComponent = BookOpen;
          label = "Notes";
        } else if (route.name === 'profile') {
          IconComponent = User;
          label = "Profile";
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.8}
            style={[
              styles.tabItem,
              isFocused && { backgroundColor: '#FFF1F0' } // Your peach pill
            ]}
          >
            <IconComponent 
              size={24} 
              color={isFocused ? theme.primary : theme.tabInactive} 
              strokeWidth={isFocused ? 2.5 : 2}
            />
            {isFocused && (
              <Text style={[styles.label, { color: theme.primary }]}>
                {label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    paddingTop: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // Shadow for the floating effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '700',
  },
});