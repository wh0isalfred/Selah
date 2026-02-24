import React from "react";
import { View} from "react-native";
import { Tabs } from "expo-router";
import { BottomTab } from "../../components/navigation/BottomTab";


export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => <BottomTab {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="notes" options={{ title: "Notes" }} />
        <Tabs.Screen name="selah" options={{ title: "Selah" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      </Tabs>
      
    </View>
  );
}