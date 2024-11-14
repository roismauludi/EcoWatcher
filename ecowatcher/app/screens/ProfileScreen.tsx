import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header dengan gambar profil dan info pengguna */}
      <LinearGradient colors={["#2ECC71", "#27AE60"]} style={styles.header}>
        <View style={styles.profileContainer}>
          {/* Gambar profil */}
          <Image
            source={{ uri: "https://placekitten.com/200/200" }} // Placeholder gambar profil
            style={styles.profileImage}
          />
          {/* Nama dan nomor telepon */}
          <Text style={styles.profileName}>Bagas Kebab</Text>
          <Text style={styles.profilePhone}>0899-3415-875</Text>
        </View>
      </LinearGradient>

      {/* Pengaturan Aplikasi */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Pengaturan Aplikasi</Text>
        <TouchableOpacity style={styles.sectionItem}>
          <Text style={styles.sectionText}>Pengaturan Profil</Text>
          <Ionicons name="chevron-forward" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sectionItem}>
          <Text style={styles.sectionText}>Pengaturan Keamanan</Text>
          <Ionicons name="chevron-forward" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Informasi Umum */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Informasi Umum</Text>
        <TouchableOpacity style={styles.sectionItem}>
          <Text style={styles.sectionText}>Tentang Kami</Text>
          <Ionicons name="chevron-forward" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sectionItem}>
          <Text style={styles.sectionText}>Syarat & Ketentuan</Text>
          <Ionicons name="chevron-forward" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sectionItem}>
          <Text style={styles.sectionText}>Kebijakan Privasi</Text>
          <Ionicons name="chevron-forward" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Tombol Keluar */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>

      {/* Versi Aplikasi */}
      <Text style={styles.versionText}>Versi Aplikasi 1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "white",
  },
  profileName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  profilePhone: {
    color: "white",
    fontSize: 16,
  },
  sectionContainer: {
    backgroundColor: "white",
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#27AE60",
    marginBottom: 10,
    fontWeight: "bold",
  },
  sectionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  sectionText: {
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#2ECC71",
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 30,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  versionText: {
    textAlign: "center",
    color: "#888",
    fontSize: 14,
  },
});

export default ProfileScreen;
