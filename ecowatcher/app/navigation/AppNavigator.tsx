// // app/navigation/AppNavigator.tsx
// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { NavigationContainer } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";
// import { FontAwesome5 } from "@expo/vector-icons";
// import { SelectedItemsProvider } from "../(tabs)/context/SelectedItemsContext"; // Pastikan path ini sesuai

// import LoginScreen from "../auth/login";
// import RegisterScreen from "../auth/register";
// import DashboardScreen from "../(tabs)/dashboard"; // Your Dashboard Screen
// import TongScreen from "../(tabs)/TongSampah"; // Other screens
// import RiwayatScreen from "../screens/RiwayatScreen";
// // import EducationScreen from "../(tabs)/edukasisampah";
// import CatalogScreen from "../screens/CatalogScreen"; // Import CatalogScreen
// import PickUpScreen from "../screens/PickUpScreen";
// import DropPointScreen from "../screens/DropPointScreen";
// import ProfileScreen from "../screens/ProfileScreen";
// import PenyetoranScreen from "../screens/PenyetoranScreen";
// import PickupScreen from "../screens/PickUpScreen";

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// // const AppNavigator = () => {
// //   return (
// //     <Stack.Navigator>
// //       <Stack.Screen name="TongSampah" component={TongScreen} />
// //       <Stack.Screen name="Penyetoran" component={PenyetoranScreen} />
// //     </Stack.Navigator>
// //   );
// // };
// // Define the bottom tabs
// function BottomTabs() {
//   return (
//     <Tab.Navigator
//       initialRouteName="Dashboard"
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           if (route.name === "Dashboard") {
//             return (
//               <Ionicons
//                 name={focused ? "home" : "home-outline"}
//                 size={size}
//                 color={color}
//               />
//             );
//           } else if (route.name === "Tong") {
//             return (
//               <Ionicons
//                 name={focused ? "trash" : "trash-outline"}
//                 size={size}
//                 color={color}
//               />
//             );
//           } else if (route.name === "Riwayat") {
//             // Menggunakan FontAwesome5 untuk ikon Riwayat
//             return (
//               <FontAwesome5
//                 name="history"
//                 size={size}
//                 color={color}
//                 solid={focused}
//               />
//             );
//           } else if (route.name === "Profile") {
//             return (
//               <Ionicons
//                 name={focused ? "person" : "person-outline"}
//                 size={size}
//                 color={color}
//               />
//             );
//           }

//           return null; // Mengembalikan null jika tidak ada ikon yang cocok
//         },
//         tabBarActiveTintColor: "#1DB954", // Warna ikon saat aktif
//         tabBarInactiveTintColor: "gray", // Warna ikon saat tidak aktif
//       })}
//     >
//       <Tab.Screen name="Dashboard" component={DashboardScreen} />
//       <Tab.Screen name="Tong" component={TongScreen} />
//       <Tab.Screen name="Riwayat" component={RiwayatScreen} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />
//     </Tab.Navigator>
//   );
// }

// // Main navigator with stack for advanced navigation
// export default function MainTabs() {
//   return (
//     <SelectedItemsProvider>
//       <Stack.Navigator initialRouteName="Login">
//         {/* Login and Register Screens */}
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen
//           name="Register"
//           component={RegisterScreen}
//           options={{ title: "Register" }}
//         />

//         {/* Main Tab Navigator */}
//         <Stack.Screen name="MainTabs" component={BottomTabs} />

//         {/* Stack screen for Catalog navigation from Dashboard */}
//         <Stack.Screen
//           name="Catalog"
//           component={CatalogScreen}
//           options={{ title: "Katalog Sampah" }}
//         />

//         <Stack.Screen
//           name="Penyetoran"
//           component={PenyetoranScreen}
//           options={{ title: "Penyetoran" }}
//         />
//         <Stack.Screen
//           name="PickUp"
//           component={PickupScreen}
//           options={{ title: "Pick Up" }}
//         />
//       </Stack.Navigator>
//     </SelectedItemsProvider>
//   );
// }
