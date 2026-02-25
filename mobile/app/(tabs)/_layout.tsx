// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import BottomTabNavigator from "../../components/navigation/BottomTab";

export default function TabsLayout() {
  return (
    <Tabs
      // This tells Expo Router to use your custom UI instead of the default bar
      tabBar={(props) => <BottomTabNavigator {...props} />}
      screenOptions={{
        headerShown: false,
        // When using a custom tabBar, some tabBarStyle props are ignored 
        // unless handled inside the custom component itself.
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Selah" }} />
      <Tabs.Screen name="notes" options={{ title: "Notes" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}