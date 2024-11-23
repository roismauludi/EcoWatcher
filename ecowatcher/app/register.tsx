import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../firebaseConfig"; // Pastikan firebaseConfig sudah dikonfigurasi dengan db
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore"; // Import Firestore
import { doc, setDoc } from "firebase/firestore"; // Tambahkan setDoc di sini
import * as Crypto from "expo-crypto";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [jenisBank, setJenisBank] = useState("");
  const [nama, setNama] = useState("");
  const [namaRekening, setNamaRekening] = useState("");
  const [noRekening, setNoRekening] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Password tidak cocok");
      return;
    }

    try {
      const digest = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );
      // Mendaftar pengguna dengan Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        digest
      );

      // Menyimpan data pengguna ke Firestore setelah registrasi sukses
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        nama,
        jenisBank,
        namaRekening,
        noRekening,
        level: "penyumbang", // Level otomatis diatur ke "penyumbang"
        point: 0, // Set default point ke 0
        password: digest, // Simpan password (harap pertimbangkan hashing password)
      });

      Alert.alert("Registrasi berhasil!");
      router.push("/"); // Arahkan kembali ke halaman login
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      Alert.alert("Gagal mendaftarkan pengguna", errorMessage);
    }
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
      <Text>Nama:</Text>
      <TextInput
        value={nama}
        onChangeText={setNama}
        placeholder="Masukkan nama"
        style={{ borderWidth: 1, marginBottom: 12 }}
      />
      <Text>Jenis Bank:</Text>
      <TextInput
        value={jenisBank}
        onChangeText={setJenisBank}
        placeholder="Masukkan jenis bank"
        style={{ borderWidth: 1, marginBottom: 12 }}
      />
      <Text>Nama Rekening:</Text>
      <TextInput
        value={namaRekening}
        onChangeText={setNamaRekening}
        placeholder="Masukkan nama rekening"
        style={{ borderWidth: 1, marginBottom: 12 }}
      />
      <Text>No Rekening:</Text>
      <TextInput
        value={noRekening}
        onChangeText={setNoRekening}
        placeholder="Masukkan nomor rekening"
        style={{ borderWidth: 1, marginBottom: 12 }}
        keyboardType="numeric"
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
        onPress={() => router.push("/")}
      />
    </View>
  );
};

export default RegisterScreen;
