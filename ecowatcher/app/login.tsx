import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Pastikan Anda mengimpor db untuk Firestore
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Crypto from 'expo-crypto';

// Definisikan tipe untuk routes
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  AdminDashboard: undefined;
};

// Definisikan tipe untuk navigation
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Silakan isi email dan password');
      return;
    }

    setIsLoading(true);
    try {
      // Hash password
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );

      // Cari user berdasarkan email
      const usersRef = collection(db, 'users'); // Gunakan db untuk Firestore
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert('Error', 'Email tidak ditemukan');
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Verifikasi password
      if (userData.password !== hashedPassword) {
        Alert.alert('Error', 'Password salah');
        return;
      }

      // Simpan email ke AsyncStorage
      await AsyncStorage.setItem('userEmail', email);
      console.log('Email tersimpan:', email);

      // Validasi level pengguna
      if (userData.level !== 'penyumbang' && userData.level !== 'pengelola') {
        Alert.alert('Akses Ditolak', 'Anda tidak memiliki akses ke aplikasi ini');
        return;
      }

      // Arahkan ke halaman yang sesuai
      switch (userData.level) {
        case 'pengelola':
          navigation.replace('AdminDashboard');
          break;
        case 'penyumbang':
          navigation.replace('MainTabs');
          break;
        default:
          Alert.alert('Error', 'Level pengguna tidak valid');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat login');
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
        onPress={() => navigation.navigate('Register')}
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
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#2ECC71',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 20,
  },
  registerButtonText: {
    color: '#2ECC71',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LoginScreen;