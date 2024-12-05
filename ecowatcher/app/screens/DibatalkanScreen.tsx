import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function DibatalkanScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dibatalkan</Text>
      {/* Konten Dibatalkan */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pesanan Anda telah dibatalkan</Text>
        <Text style={styles.cardSubtitle}>
          Hubungi admin untuk info lebih lanjut
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f3f3f3",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "gray",
  },
});
