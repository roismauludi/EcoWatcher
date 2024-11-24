import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';  // Pastikan ini diimport
import CONFIG from './config';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nama, setNama] = useState('');
  const [jenisBank, setJenisBank] = useState('');
  const [namaRekening, setNamaRekening] = useState('');
  const [noRekening, setNoRekening] = useState('');
  const router = useRouter();  // Gunakan useRouter dari expo-router

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Password tidak cocok');
      return;
    }

    try {
      const response = await fetch(`${CONFIG.API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          nama,
          jenisBank,
          namaRekening,
          noRekening,
        }),
      });

      if (response.ok) {
        Alert.alert('Registrasi berhasil!', '', [
          {
            text: 'OK',
            onPress: () => {
              console.log('Navigasi ke halaman login dipanggil');
              router.replace('/login'); // Pastikan rute ini sesuai dengan rute halaman login
            },
          },
        ]);
      } else {
        const errorMessage = await response.text();
        Alert.alert('Gagal mendaftarkan pengguna', errorMessage);
      }
    } catch (error) {
      console.error('Gagal mendaftarkan pengguna:', error);
      Alert.alert('Gagal mendaftarkan pengguna', 'Terjadi kesalahan saat menghubungi server');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Daftar Akun</Text>
      
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Masukkan email"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        value={nama}
        onChangeText={setNama}
        placeholder="Masukkan nama"
        style={styles.input}
      />
      <TextInput
        value={jenisBank}
        onChangeText={setJenisBank}
        placeholder="Masukkan jenis bank"
        style={styles.input}
      />
      <TextInput
        value={namaRekening}
        onChangeText={setNamaRekening}
        placeholder="Masukkan nama rekening"
        style={styles.input}
      />
      <TextInput
        value={noRekening}
        onChangeText={setNoRekening}
        placeholder="Masukkan nomor rekening"
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Masukkan password"
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Konfirmasi password"
        secureTextEntry
        style={styles.input}
      />
      <Button title="Register" onPress={handleRegister} color="#2ECC71" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2ECC71',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default RegisterScreen;