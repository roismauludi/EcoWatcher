import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function PickupScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Pick Up</Text>
      </View> */}

      {/* Tabs */}
      <View style={styles.tabs}>
        <Text style={[styles.tabText, styles.activeTab]}>Diproses</Text>
        <Text style={styles.tabText}>Dijemput</Text>
        <Text style={styles.tabText}>Ditimbang</Text>
        <Text style={styles.tabText}>Selesai</Text>
      </View>

      {/* Konten Diproses */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Perlu Dijemput</Text>

        {/* Card Item 1 */}
        <View style={styles.card}>
          <Image
            source={require("../../assets/images/botol_kaca.png")}
            style={styles.cardImage}
          />
          <View style={styles.cardDetails}>
            <Text style={styles.cardTitle}>Botol Kaca</Text>
            <Text style={styles.cardSubtitle}>Non-Organik Kaca</Text>
            <Text style={styles.cardPoints}>1500 Poin / Kg</Text>
          </View>
        </View>

        {/* Card Item 2 */}
        <View style={styles.card}>
          <Image
            source={require("../../assets/images/ember_plastik.png")}
            style={styles.cardImage}
          />
          <View style={styles.cardDetails}>
            <Text style={styles.cardTitle}>Ember Plastik</Text>
            <Text style={styles.cardSubtitle}>Non-Organik Plastik</Text>
            <Text style={styles.cardPoints}>1400 Poin / Kg</Text>
          </View>
        </View>

        {/* Informasi Penjemputan */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Sampah akan dijemput pada{" "}
            <Text style={styles.infoHighlight}>22-08-2024 : 15:00 WIB</Text>
          </Text>
        </View>

        {/* Nomor Antrean */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            No. Antrean: <Text style={styles.infoHighlight}>BGS1204200065</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // header: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   paddingHorizontal: 16,
  //   paddingVertical: 16,
  //   backgroundColor: "#25c05d",
  // },
  // headerTitle: {
  //   color: "white",
  //   fontWeight: "bold",
  //   fontSize: 20,
  //   marginLeft: 16,
  // },
  icon: {
    width: 24,
    height: 24,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f3f3f3",
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 14,
    color: "gray",
    fontWeight: "bold",
  },
  activeTab: {
    color: "#25c05d",
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    alignItems: "center",
  },
  cardImage: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  cardDetails: {
    flex: 1,
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
  cardPoints: {
    fontSize: 14,
    color: "#25c05d",
    fontWeight: "bold",
  },
  infoBox: {
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: "black",
  },
  infoHighlight: {
    color: "#25c05d",
    fontWeight: "bold",
  },
});
