// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { BottomTab } from "../../components/navigation/BottomTab";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomTab {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true, // This hides the bar when keyboard is up
        tabBarStyle: { position: 'absolute' } 
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="notes" options={{ title: "Notes" }} />
      <Tabs.Screen name="selah" options={{ title: "Selah" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}