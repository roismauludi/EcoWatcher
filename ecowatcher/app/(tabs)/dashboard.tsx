import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import EcoPoinCard from "@/components/EcoPoinCard";
import ActionSection from "@/components/ActionSection";

const { width } = Dimensions.get("window");

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Dashboard"
>;

export default function Dashboard() {
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/100" }}
            style={styles.profileImage}
          />
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>Selamat Datang</Text>
            <Text style={styles.username}>Pengguna</Text>
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
        <View style={styles.blogItem}>
          <Image
            style={styles.blogImage}
            source={{ uri: "https://via.placeholder.com/150" }}
          />
          <View style={styles.blogTextContainer}>
            <Text style={styles.blogCategory}>Blog & Artikel</Text>
            <Text style={styles.blogTitle}>
              EcoGreen: Solusi Tukar Sampah Jadi Berkah
            </Text>
            <Text style={styles.blogDate}>25 Juli 2022</Text>
          </View>
        </View>

        <View style={styles.blogItem}>
          <Image
            style={styles.blogImage}
            source={{ uri: "https://via.placeholder.com/150" }}
          />
          <View style={styles.blogTextContainer}>
            <Text style={styles.blogCategory}>Blog & Artikel</Text>
            <Text style={styles.blogTitle}>
              Raih Kekayaan Hanya Dengan Tutup Botol
            </Text>
            <Text style={styles.blogDate}>27 Juli 2022</Text>
          </View>
        </View>
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
    paddingVertical: 30,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  xpProgress: {
    backgroundColor: "#FFF8DC",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  xpText: {
    fontSize: 14,
    fontWeight: "500",
  },
  blogSection: {
    padding: 20,
  },
  blogSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  blogItem: {
    flexDirection: "row",
    marginBottom: 15,
  },
  blogImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  blogTextContainer: {
    flex: 1,
  },
  blogCategory: {
    fontSize: 12,
    color: "#888",
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  blogDate: {
    fontSize: 12,
    color: "#888",
  },
});
