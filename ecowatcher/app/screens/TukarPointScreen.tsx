import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TukarPointScreen = () => {
  const [poinAktif, setPoinAktif] = useState<number>(0);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [rewards, setRewards] = useState<
    { id: string; name: string; pointRequired: number }[]
  >([
    { id: "1", name: "Voucher Belanja Rp50.000", pointRequired: 500 },
    { id: "2", name: "Paket Internet 5GB", pointRequired: 1000 },
    { id: "3", name: "Donasi Pohon", pointRequired: 1500 },
  ]);

  useEffect(() => {
    const fetchPoinData = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      setUserEmail(email);
      if (email) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const data = userDoc.data();
          setPoinAktif(data.point || 0); // Update poin aktif dari Firestore
        }
      }
    };

    fetchPoinData();
  }, []);

  const handleExchange = async (reward: {
    id: string;
    name: string;
    pointRequired: number;
  }) => {
    if (poinAktif >= reward.pointRequired) {
      try {
        if (userEmail) {
          // Kurangi poin pengguna di Firestore
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("email", "==", userEmail));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userDocRef = doc(db, "users", querySnapshot.docs[0].id);
            await updateDoc(userDocRef, {
              point: poinAktif - reward.pointRequired,
            });

            setPoinAktif((prev) => prev - reward.pointRequired); // Perbarui state poin aktif
            Alert.alert(
              "Penukaran Berhasil",
              `Anda telah menukar ${reward.pointRequired} poin untuk ${reward.name}.`
            );
          }
        }
      } catch (error) {
        Alert.alert("Kesalahan", "Terjadi kesalahan saat menukar poin.");
      }
    } else {
      Alert.alert("Poin Tidak Cukup", "Anda tidak memiliki cukup poin untuk hadiah ini.");
    }
  };

  return (
    <LinearGradient
      colors={["#27AE60", "#2ECC71"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Tukar Poin</Text>
        <Text style={styles.poinText}>Poin Aktif: {poinAktif} Poin</Text>
      </View>

      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.rewardItem}>
            <Text style={styles.rewardName}>{item.name}</Text>
            <Text style={styles.rewardPoint}>
              {item.pointRequired} Poin
            </Text>
            <TouchableOpacity
              style={styles.exchangeButton}
              onPress={() => handleExchange(item)}
            >
              <Text style={styles.exchangeButtonText}>Tukar</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  poinText: {
    fontSize: 18,
    color: "white",
    marginTop: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  rewardItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rewardPoint: {
    fontSize: 14,
    color: "#27AE60",
  },
  exchangeButton: {
    backgroundColor: "#27AE60",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  exchangeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default TukarPointScreen;
