import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Definisikan tipe untuk stack parameter list
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  AdminDashboard: undefined;
};

// Definisikan tipe untuk navigation prop
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }) {
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
      // Autentikasi pengguna
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login berhasil, UID:', userCredential.user.uid);
      
      // Cek level pengguna di Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();
      
      // Tambahkan log untuk debugging
      console.log('User Data:', userData);
      console.log('User Level:', userData?.level);
      
      if (!userData) {
        Alert.alert('Error', 'Data pengguna tidak ditemukan');
        return;
      }

      // Validasi level pengguna
      console.log('Checking role:', userData.role);
      console.log('Is penyumbang?', userData.level === 'penyumbang');
      console.log('Is pengelola?', userData.level === 'pengelola');

      if (userData.level !== 'penyumbang' && userData.level !== 'pengelola') {
        console.log('Role tidak valid:', userData.level);
        Alert.alert('Akses Ditolak', 'Anda tidak memiliki akses ke aplikasi ini');
        await auth.signOut();
        return;
      }

      // Arahkan ke halaman yang sesuai berdasarkan level
      switch (userData.level) {
        case 'pengelola':
          navigation.replace('AdminDashboard');
          break;
        case 'penyumbang':
          navigation.replace('MainTabs');
          break;
        default:
          Alert.alert('Error', 'Level pengguna tidak valid');
          await auth.signOut();
      }
    } catch (error) {
      console.error('Login Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email</Text>
      <TextInput 
        value={email} 
        onChangeText={setEmail} 
        placeholder="Masukkan email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      
      <Text>Password</Text>
      <TextInput 
        value={password} 
        onChangeText={setPassword} 
        placeholder="Masukkan password" 
        secureTextEntry
        style={styles.input}
      />
      
      <Button 
        title={isLoading ? "Memuat..." : "Login"} 
        onPress={handleLogin}
        disabled={isLoading}
      />
      <Button 
        title="Register" 
        onPress={() => navigation.navigate('Register')}
        disabled={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  }
});