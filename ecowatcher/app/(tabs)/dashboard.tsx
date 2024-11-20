import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EcoPoinCard from "../../components/EcoPoinCard";
import ActionSection from "../../components/ActionSection";

const { width } = Dimensions.get("window");

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Dashboard"
>;

interface UserData {
  nama: string;
  foto: any; // Bisa berupa URL string atau require() untuk gambar default
}

function Dashboard() {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const [userData, setUserData] = useState<UserData>({
    nama: 'Pengguna',
    foto: require('../../assets/images/default.jpg'), // Foto default
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      if (!userEmail) {
        Alert.alert('Error', 'Sesi pengguna tidak ditemukan');
        navigation.replace('Login');
        return;
      }

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const data = userDoc.data() as UserData;
        setUserData({
          nama: data.nama || 'Pengguna',
          foto: data.foto || require('../../assets/images/default.jpg'),
        });
      } else {
        Alert.alert('Error', 'Data pengguna tidak ditemukan');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Gagal mengambil data pengguna');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image
            source={typeof userData.foto === 'string' ? { uri: userData.foto } : userData.foto}
            style={styles.profileImage}
          />
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>Selamat Datang</Text>
            <Text style={styles.username}>{userData.nama}</Text>
          </View>
        </View>
      </View>

      {/* EcoPoint Section */}
      <View>
        <EcoPoinCard />
      </View>

      {/* Actions Section */}
      <View style={styles.actions}>
        <ActionSection />
      </View>

      {/* Blog Section */}
      <View style={styles.blogSection}>
        <Text style={styles.blogSectionTitle}>Artikel Terbaru</Text>
        {/* Konten blog lainnya */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#fff",
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 16,
  },
  username: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  userPoint: {
    color: "#fff",
    fontSize: 16,
  },
  actions: {
    marginTop: 20,
  },
  blogSection: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  blogSectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default Dashboard; // Hanya ada satu ekspor default
