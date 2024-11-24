import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { auth } from "../firebaseConfig"; // Pastikan Firebase Authentication diatur dengan benar
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { signInWithEmailAndPassword } from "firebase/auth";

// Tipe parameter untuk navigator
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
};

// Tipe navigasi
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
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
      // Login dengan Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Simpan email ke AsyncStorage
      await AsyncStorage.setItem("userEmail", email);
      console.log("Email tersimpan:", email);
  
      // Pindah ke MainTabs
      navigation.replace("MainTabs"); // Pastikan ini sesuai dengan nama rute yang didefinisikan
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Login Error:", error.message);
        Alert.alert("Error", "Gagal login: " + error.message);
      } else {
        console.error("Login Error:", error);
        Alert.alert("Error", "Terjadi kesalahan saat login.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EcoWatcher</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Masuk</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate("Register")}
        disabled={isLoading}
      >
        <Text style={styles.registerButtonText}>
          Belum punya akun? Daftar disini
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#2ECC71",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButton: {
    marginTop: 20,
  },
  registerButtonText: {
    color: "#2ECC71",
    textAlign: "center",
    fontSize: 16,
  },
});

export default LoginScreen;
