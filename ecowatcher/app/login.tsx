import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Crypto from "expo-crypto";

// Definisikan tipe untuk stack parameter list
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  AdminDashboard: undefined;
};

// Definisikan tipe untuk navigation prop
type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Silakan isi email dan password");
      return;
    }

    setIsLoading(true);
    try {
      // Hash password terlebih dahulu
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );

      // Cari user berdasarkan email di Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Error", "Email tidak ditemukan");
        setIsLoading(false);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Bandingkan password yang di-hash
      if (userData.password !== hashedPassword) {
        Alert.alert("Error", "Password salah");
        setIsLoading(false);
        return;
      }

      // Login berhasil
      console.log("Login berhasil, UserID:", userDoc.id);

      // Tambahkan log untuk debugging
      console.log("User Data:", userData);
      console.log("User Level:", userData?.level);

      if (!userData) {
        Alert.alert("Error", "Data pengguna tidak ditemukan");
        setIsLoading(false);
        return;
      }

      // Validasi level pengguna
      console.log("Checking role:", userData.level);
      console.log("Is penyumbang?", userData.level === "penyumbang");
      console.log("Is pengelola?", userData.level === "pengelola");

      if (userData.level !== "penyumbang" && userData.level !== "pengelola") {
        console.log("Role tidak valid:", userData.level);
        Alert.alert(
          "Akses Ditolak",
          "Anda tidak memiliki akses ke aplikasi ini"
        );
        setIsLoading(false);
        return;
      }

      // Arahkan ke halaman yang sesuai berdasarkan level
      switch (userData.level) {
        case "pengelola":
          navigation.replace("AdminDashboard");
          break;
        case "penyumbang":
          navigation.replace("MainTabs");
          break;
        default:
          Alert.alert("Error", "Level pengguna tidak valid");
          setIsLoading(false);
      }
    } catch (error) {
      console.error("Login Error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan yang tidak diketahui";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Masukkan email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Masukkan password"
        secureTextEntry
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <Button
          title={isLoading ? "Memuat..." : "Login"}
          onPress={handleLogin}
          disabled={isLoading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Register"
          onPress={() => navigation.navigate("Register")}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    marginBottom: 10,
  },
});
