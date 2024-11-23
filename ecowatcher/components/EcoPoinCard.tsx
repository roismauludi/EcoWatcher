import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Import for gradient effect
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons"; // Import MaterialIcons for button icon

const EcoPoinCard = () => {
  return (
    <LinearGradient
      colors={["#2ECC71", "#27AE60"]} // Warna gradient yang lebih lembut
      style={styles.cardContainer}
    >
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <FontAwesome5 name="coins" size={24} color="white" />
          <Text style={styles.cardTitle}>EcoPoin</Text>
        </View>
        <Text style={styles.poinText}>Poin Aktif</Text>
        <Text style={styles.poinValue}>16500 Poin</Text>

        {/* Button Tukar Poin with Icon */}
        <TouchableOpacity style={styles.exchangeButton}>
          <MaterialIcons
            name="swap-horiz"
            size={24}
            color="white"
            style={styles.buttonIcon}
          />
          <Text style={styles.exchangeText}>Tukar Poin</Text>
        </TouchableOpacity>

        <View style={styles.poinDetails}>
          <View style={styles.poinItem}>
            <Ionicons
              name="arrow-down-circle-outline"
              size={20}
              color="white"
            />
            <Text style={styles.poinLabel}>Total Poin Masuk</Text>
            <Text style={styles.poinValueSmall}>26600 Poin</Text>
          </View>

          <View style={styles.poinItem}>
            <Ionicons name="arrow-up-circle-outline" size={20} color="white" />
            <Text style={styles.poinLabel}>Total Poin Keluar</Text>
            <Text style={styles.poinValueSmall}>10100 Poin</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20, // Sedikit lebih besar untuk tampilan yang lebih lembut
    padding: 20, // Lebih banyak padding untuk memberi lebih banyak ruang
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4, // Lebih besar untuk bayangan yang lebih jelas
    },
    shadowOpacity: 0.3, // Lebih jelas bayangannya
    shadowRadius: 6,
    elevation: 8, // Lebih tinggi untuk efek bayangan yang lebih kuat
  },
  cardContent: {
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12, // Memberikan lebih banyak ruang antara icon dan judul
  },
  cardTitle: {
    color: "white",
    fontSize: 22, // Ukuran font yang lebih besar
    fontWeight: "bold",
    marginLeft: 12, // Sedikit lebih banyak ruang antara icon dan teks
  },
  poinText: {
    color: "white",
    fontSize: 16, // Ukuran teks poin aktif sedikit lebih besar
    marginTop: 8, // Memberikan sedikit ruang sebelum nilai poin
  },
  poinValue: {
    color: "white",
    fontSize: 32, // Lebih besar untuk membuat angka lebih menonjol
    fontWeight: "bold",
  },
  exchangeButton: {
    marginTop: 12,
    backgroundColor: "#5EDB7E", // Hijau lembut sesuai desain
    borderRadius: 10, // Border yang lebih bulat sesuai desain
    flexDirection: "row", // Agar teks dan icon dalam satu baris
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  exchangeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 10, // Jarak antara icon dan teks
  },
  poinDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25, // Memberikan lebih banyak ruang sebelum detail poin
  },
  poinItem: {
    alignItems: "center",
  },
  poinLabel: {
    color: "white",
    fontSize: 14, // Sedikit lebih besar untuk teks label
  },
  poinValueSmall: {
    color: "white",
    fontSize: 18, // Lebih besar agar angka lebih menonjol
    fontWeight: "bold",
  },
});

export default EcoPoinCard;
