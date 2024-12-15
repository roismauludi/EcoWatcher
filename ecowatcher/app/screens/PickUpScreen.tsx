import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import CONFIG from './../config';

interface PickupItem {
  itemId: string;
  name: string;
  type: string;
  description: string;
  points: number;
  image: string;
}

// Pemetaan gambar lokal
const imageMapping: { [key: string]: any } = {
  "monitor-lcd.jpg": require("../../assets/images/elektronik/monitor-lcd.jpg"),
  "monitor-tabung.jpg": require("../../assets/images/elektronik/monitor-tabung.jpg"),
  "botol_kaca.png": require("../../assets/images/kaca/botol_kaca.png"),
  "pecahan_kaca.png": require("../../assets/images/kaca/pecahan_kaca.png"),
  "buku.jpg": require("../../assets/images/kertas/buku.jpg"),
  "duplex.png": require("../../assets/images/kertas/duplex.png"),
  "kardus.png": require("../../assets/images/kertas/kardus.png"),
  "kertas_nota.png": require("../../assets/images/kertas/kertas_nota.png"),
  "aluminium.png": require("../../assets/images/logam/aluminium.png"),
  "besi-padu.png": require("../../assets/images/logam/besi-padu.png"),
  "kuningan.png": require("../../assets/images/logam/kuningan.png"),
  "kaleng.png": require("../../assets/images/logam/kaleng.png"),
  "minyak_jelantah.png": require("../../assets/images/minyak/minyak_jelantah.png"),
  "botol-atom.png": require("../../assets/images/plastik/botol-atom.png"),
  "botol_plastik.png": require("../../assets/images/plastik/botol_plastik.png"),
  "ember_plastik.png": require("../../assets/images/plastik/ember_plastik.png"),
  "gelas_plastik.png": require("../../assets/images/plastik/gelas_plastik.png"),
  default: require("../../assets/images/default.png"),
};

const getImageSource = (imageName: string) => {
  console.log("Image requested:", imageName);  
  return imageMapping[imageName] || imageMapping["default"];
};

// Komponen utama
export default function PickUpScreen() {
  const [activeTab, setActiveTab] = useState("Diproses");
  const [loading, setLoading] = useState(true);
  const [pickupData, setPickupData] = useState<any[]>([]); // Menyimpan data pickup
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${CONFIG.API_URL}/api/get-pickups`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        if (result.data) {
          setPickupData(result.data); // Asumsikan data pickup ada di "data"
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderDiprosesContent = () => {
    const filteredData = pickupData.filter(item => item.status === "Pending");
  
    if (filteredData.length === 0) {
      return <Text style={styles.placeholderText}>Tidak ada data yang diproses.</Text>;
    }
  
    return filteredData.map((item, index) => (
      <View style={styles.contentContainer} key={index}>
        <Text style={styles.sectionTitle}>Perlu Dijemput</Text>
        <View style={styles.cardContainer}>
          {item.items && item.items.map((subItem: PickupItem, idx: number) => {
            const pointUnit = subItem.type === "Non-organik-elektronik" ? "/ unit" : "/ Kg";
  
            return (
              <View style={styles.card} key={idx}>
                <Image
                  source={getImageSource(subItem.image)} // Menggunakan pemetaan gambar lokal
                  style={styles.cardImage}
                />
                <View style={styles.cardDetails}>
                  <Text style={styles.cardTitle}>{subItem.name || "Tidak diketahui"}</Text>
                  <Text style={styles.cardSubtitle}>{subItem.type || "Jenis tidak diketahui"}</Text>
                  <Text style={styles.cardPoints}>{subItem.points || 0} Poin {pointUnit}</Text>
                </View>
              </View>
            );
          })}
        </View>
  
        <View style={styles.detailInfoContainer}>
          <Text style={styles.infoText}>
            <Text style={{ fontWeight: "bold" }}>Total Sampah: </Text>
            {item.items ? item.items.length : 0} Sampah
          </Text>
          <Text style={styles.infoText}>
            <Text style={{ fontWeight: "bold" }}>Sampah akan dijemput pada: </Text>
            {item.pickUpDate
              ? new Date(item.pickUpDate).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }) + ' pukul 15:00'
              : "Tanggal tidak tersedia"}
          </Text>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => navigation.navigate('Rincian', { id: item.id })}
          >
            <Text style={styles.detailButtonText}>Lihat Rincian</Text>
          </TouchableOpacity>
          <Text style={styles.infoText}>
            <Text style={{ fontWeight: "bold" }}>No. Antrean: </Text>
            {item.queueNumber || "Tidak tersedia"}
          </Text>
        </View>
      </View>
    ));
  };
  

  return (
    <View style={styles.container}>
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

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#25C05D" />
        ) : activeTab === "Diproses" ? (
          renderDiprosesContent()
        ) : (
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