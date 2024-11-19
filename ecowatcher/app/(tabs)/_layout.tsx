import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { SelectedItemsProvider } from "../(tabs)/context/SelectedItemsContext"; // Pastikan path ini sesuai

import LoginScreen from "../login";
import RegisterScreen from "../register";
import DashboardScreen from "./dashboard"; // Your Dashboard Screen
import TongScreen from "./TongSampah"; // Other screens
import RiwayatScreen from "../screens/RiwayatScreen";
import EducationScreen from "./edukasisampah";
import CatalogScreen from "../screens/CatalogScreen"; // Import CatalogScreen
import PickUpScreen from "../screens/PickUpScreen";
import DropPointScreen from "../screens/DropPointScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Define the bottom tabs
function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Dashboard") {
            return (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Tong") {
            return (
              <Ionicons
                name={focused ? "trash" : "trash-outline"}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Riwayat") {
            // Menggunakan FontAwesome5 untuk ikon Riwayat
            return (
              <FontAwesome5
                name="history"
                size={size}
                color={color}
                solid={focused}
              />
            );
          } else if (route.name === "Profile") {
            return (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size}
                color={color}
              />
            );
          }

          return null; // Mengembalikan null jika tidak ada ikon yang cocok
        },
        tabBarActiveTintColor: "#1DB954", // Warna ikon saat aktif
        tabBarInactiveTintColor: "gray", // Warna ikon saat tidak aktif
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Tong" component={TongScreen} />
      <Tab.Screen name="Riwayat" component={RiwayatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main navigator with stack for advanced navigation
export default function MainTabs() {
  return (
    <SelectedItemsProvider>
      <Stack.Navigator initialRouteName="Login">
        {/* Login and Register Screens */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Register" }}
        />

        {/* Main Tab Navigator */}
        <Stack.Screen
          name="MainTabs"
          component={BottomTabs}
          options={{ headerShown: false }}
        />

        {/* Stack screen for Catalog navigation from Dashboard */}
        <Stack.Screen
          name="Catalog"
          component={CatalogScreen}
          options={{ title: "Katalog Sampah" }}
        />
      </Stack.Navigator>
    </SelectedItemsProvider>
  );
}