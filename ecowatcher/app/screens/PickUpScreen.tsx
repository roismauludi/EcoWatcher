import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function PickUpScreen() {
  const [activeTab, setActiveTab] = useState("Diproses");

  const renderDiprosesContent = () => {
    return (
      <View style={styles.contentContainer}>
        {/* Header informasi */}
        <Text style={styles.sectionTitle}>Perlu Dijemput</Text>

        {/* Kartu horizontal */}
        <View style={styles.cardContainer}>
          {/* Kartu pertama */}
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

          {/* Kartu kedua */}
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
        </View>

        {/* Detail informasi */}
        <View style={styles.detailInfoContainer}>
          <Text style={styles.infoText}>
            <Text style={{ fontWeight: "bold" }}>Total Sampah: </Text>2 Sampah
          </Text>
          <Text style={styles.infoText}>
            <Text style={{ fontWeight: "bold" }}>
              Sampah akan dijemput pada:{" "}
            </Text>
            22-08-2024 • 15:00 WIB
          </Text>
          <TouchableOpacity style={styles.detailButton}>
            <Text style={styles.detailButtonText}>Lihat Rincian</Text>
          </TouchableOpacity>
          <Text style={styles.infoText}>
            <Text style={{ fontWeight: "bold" }}>No. Antrean: </Text>
            BGS1204200065
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backButton}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pick Up</Text>
      </View> */}

      {/* Tabs */}
      <View style={styles.tabs}>
        {["Diproses", "Dijemput", "Ditimbang", "Selesai", "Dibatalkan"].map(
          (tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
              <Text
                style={[styles.tabText, activeTab === tab && styles.activeTab]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === "Diproses" && renderDiprosesContent()}
        {activeTab !== "Diproses" && (
          <Text style={styles.placeholderText}>
            Konten untuk tab {activeTab} sedang dalam pengembangan.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tabText: {
    fontSize: 14,
    color: "#9E9E9E",
    fontWeight: "500",
  },
  activeTab: {
    color: "#25C05D",
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#25C05D",
  },
  content: {
    padding: 16,
  },
  contentContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#424242",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardImage: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },
  cardDetails: {
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#424242",
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#9E9E9E",
    textAlign: "center",
  },
  cardPoints: {
    fontSize: 12,
    color: "#25C05D",
    fontWeight: "bold",
  },
  detailInfoContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    color: "#424242",
  },
  detailButton: {
    backgroundColor: "#25C05D",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 16,
  },
  detailButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  placeholderText: {
    fontSize: 14,
    color: "#9E9E9E",
    textAlign: "center",
    marginTop: 50,
  },
});
