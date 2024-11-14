import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleRegister = () => {
    // Validasi register
    if (password !== confirmPassword) {
      Alert.alert('Password tidak cocok');
      return;
    }

    // Simulasi sukses registrasi
    Alert.alert('Registrasi berhasil!');
    router.push('/'); // Arahkan kembali ke halaman login tanpa tanda "/"
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Masukkan email"
        style={{ borderWidth: 1, marginBottom: 12 }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Masukkan password"
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 12 }}
      />
      <Text>Konfirmasi Password:</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Konfirmasi password"
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 12 }}
      />
      <Button title="Register" onPress={handleRegister} />
      <Button
        title="Sudah punya akun? Login"
        onPress={() => router.push('/')} // Ganti menjadi login
      />
    </View>
  );
};

export default RegisterScreen;
