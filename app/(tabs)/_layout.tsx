import { color } from "@/utils/color";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useWindowDimensions } from "react-native";

const _layout = () => {
  const { width, height } = useWindowDimensions();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.primary,
        tabBarInactiveTintColor: "gray",

        tabBarStyle: {},
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Add",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="add" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
