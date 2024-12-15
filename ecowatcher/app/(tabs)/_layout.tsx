import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { SelectedItemsProvider } from "../(tabs)/context/SelectedItemsContext";

import LoginScreen from "../auth/login";
import RegisterScreen from "../auth/register";
import DashboardScreen from "./dashboard"; // Your Dashboard Screen
import TongScreen from "./TongSampah"; // Other screens
import RiwayatScreen from "../screens/RiwayatScreen";
import EducationScreen from "./edukasisampah";
import CatalogScreen from "../screens/CatalogScreen"; // Import CatalogScreen
import DropPointScreen from "../screens/DropPointScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AddAddressScreen from "../screens/AddAddressScreen";
import PenyetoranScreen from "../screens/PenyetoranScreen";
import PickupScreen from "../screens/PickUpScreen";
import RincianScreen from "../screens/RincianScreen";
import DijemputScreen from "../screens/DijemputScreen";
import DitimbangScreen from "../screens/DitimbangScreen";
import SelesaiScreen from "../screens/SelesaiScreen";
import DibatalkanScreen from "../screens/DibatalkanScreen";
import TukarPointScreen from "../screens/TukarPointScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab navigation
function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Dashboard") {
            return <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />;
          } else if (route.name === "Tong") {
            return <Ionicons name={focused ? "trash" : "trash-outline"} size={size} color={color} />;
          } else if (route.name === "Riwayat") {
            return <FontAwesome5 name="history" size={size} color={color} solid={focused} />;
          } else if (route.name === "Profile") {
            return <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />;
          }
          return null;
        },
        tabBarActiveTintColor: "#1DB954",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Dashboard" options={{ headerShown: false }} component={DashboardScreen} />
      <Tab.Screen name="Tong" options={{ headerShown: false }} component={TongScreen} />
      <Tab.Screen name="Riwayat" component={RiwayatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Stack navigation
export default function MainTabs() {
  return (
    <SelectedItemsProvider>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Register" }} />
        <Stack.Screen name="MainTabs" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Catalog" component={CatalogScreen} options={{ title: "Katalog Sampah" }} />
        <Stack.Screen name="Tong" component={TongScreen} options={{ title: "Tong Sampah" }} />
        <Stack.Screen name="Penyetoran" component={PenyetoranScreen} options={{ title: "Penyetoran" }} />
        <Stack.Screen name="AddAddress" component={AddAddressScreen} options={{ title: "Tambah Alamat" }} />
        <Stack.Screen name="PickUp" component={PickupScreen} options={{ title: "Pick Up" }} />
        <Stack.Screen name="Rincian" component={RincianScreen} options={{ title: "Rincian" }} />
        <Stack.Screen name="Dijemput" component={DijemputScreen} options={{ title: "Dijemput" }} />
        <Stack.Screen name="Ditimbang" component={DitimbangScreen} options={{ title: "Ditimbang" }} />
        <Stack.Screen name="Selesai" component={SelesaiScreen} options={{ title: "Selesai" }} />
        <Stack.Screen name="Dibatalkan" component={DibatalkanScreen} options={{ title: "Dibatalkan" }} />
        <Stack.Screen name="TukarPoint" component={TukarPointScreen} options={{ title: "Tukar Poin" }} />
      </Stack.Navigator>
    </SelectedItemsProvider>
  );
}
