import { AntDesign, Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Calendar } from "react-native-calendars";

type RootStackParamList = {
  PickUp: undefined;
  AddAddress: undefined;
  // ... tambahkan screen lain jika ada
};

export default function PenyetoranScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // State untuk kontrol modal dan tanggal yang dipilih
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    "Jumat, 11 Agustus 2024"
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 0,
          borderBottomWidth: 1,
          borderBottomColor: "#D3D3D3",
        }}
      ></View> */}

      {/* Alamat Penjemputan */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 5 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>
            Alamat Penjemputan
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("AddAddress")}>
            <Text style={{ color: "#25c05d", fontWeight: "bold" }}>
              Tambah Alamat
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{ backgroundColor: "#f3f3f3", borderRadius: 10, padding: 16 }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>
            Rumah
          </Text>
          <Text style={{ fontSize: 15, color: "#25c05d" }}>Utama</Text>
          <Text style={{ fontSize: 14, color: "black" }}>
            Bagas Kebab (08993415875){"\n"}Jl. Sudirman, Sukajadi, Kec. Batam
            Kota.
          </Text>
        </View>
      </View>
      {/* Item Sampah */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 0 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>
            Item Sampah
          </Text>
          <TouchableOpacity>
            <Text style={{ color: "#25c05d", fontWeight: "bold" }}>
              Tambah Sampah?
            </Text>
          </TouchableOpacity>
        </View>
        {/* Card Items */}
        <View style={{ marginTop: 4, marginBottom: 4 }}>
          {/* Botol Kaca */}
          <View
            style={{
              backgroundColor: "#f3f3f3",
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
              shadowColor: "black",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Image
              source={require("../../assets/images/botol_kaca.png")}
              style={{ width: 41, height: 56.78, marginRight: 16 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", color: "black" }}
              >
                Botol Kaca
              </Text>
              <Text style={{ fontSize: 14, color: "gray" }}>
                Non-Organik Kaca
              </Text>
              <Text
                style={{ fontSize: 14, color: "#25c05d", fontWeight: "bold" }}
              >
                1500 Poin / Kg
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={{ color: "#25c05d", fontWeight: "bold" }}>
                Lihat Detail
              </Text>
            </TouchableOpacity>
          </View>
          {/* Ember Plastik */}
          <View
            style={{
              backgroundColor: "#f3f3f3",
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
              shadowColor: "black",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              marginTop: 10,
            }}
          >
            <Image
              source={require("../../assets/images/ember_plastik.png")}
              style={{ width: 46.4, height: 41.6, marginRight: 13 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", color: "black" }}
              >
                Ember Plastik
              </Text>
              <Text style={{ fontSize: 14, color: "gray" }}>
                Non-Organik Plastik
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#25c05d",
                  fontWeight: "bold",
                  marginTop: 4,
                }}
              >
                1400 Poin / Kg
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={{ color: "#25c05d", fontWeight: "bold" }}>
                Lihat Detail
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Foto Sampah */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "black",
            marginBottom: 8,
          }}
        >
          Foto Sampah
        </Text>
        <View style={{ flexDirection: "row", marginRight: 16, marginLeft: 16 }}>
          <TouchableOpacity
            style={{
              width: 20,
              height: 20,
              backgroundColor: "gray",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather
              name="camera"
              size={24}
              color="black"
              style={{ width: 10, height: 10 }}
            />
            <Text style={{ fontSize: 12, color: "gray", marginTop: 1 }}>
              Tambah Foto
            </Text>
          </TouchableOpacity>
          {/* Placeholder for additional images */}
          <Image
            source={require("../../assets/images/botol_kaca.png")}
            style={{ width: 20, height: 20, borderRadius: 10 }}
          />
          <Image
            source={require("../../assets/images/botol_kaca.png")}
            style={{ width: 20, height: 20, borderRadius: 10 }}
          />
        </View>
      </View>
      {/* Jadwal Penjemputan */}
      <View style={{ padding: 16, marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "black",
            marginBottom: 8,
          }}
        >
          Jadwal Penjemputan
        </Text>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#f3f3f3",
            borderRadius: 10,
            padding: 16,
          }}
          onPress={() => setModalVisible(true)} // Buka modal kalender
        >
          <Text style={{ fontSize: 14, color: "black", flex: 1 }}>
            {selectedDate}
          </Text>
          <AntDesign
            name="calendar"
            size={24}
            color="black"
            className="w-6 h-6"
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 12, color: "gray", marginTop: 2 }}>
          Kurir akan menjemput sampah Anda pada pukul 15:00 WIB.
        </Text>
      </View>

      {/* Modal Kalender */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              width: "90%",
              padding: 16,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              Agustus 2024
            </Text>
            <Calendar
              onDayPress={(day: { dateString: string }) => {
                const formattedDate = new Date(
                  day.dateString
                ).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });
                setSelectedDate(formattedDate);
                setModalVisible(false); // Tutup modal
              }}
              markedDates={{
                "2024-08-11": { selected: true, selectedColor: "#25c05d" },
              }}
              theme={{
                selectedDayBackgroundColor: "#25c05d",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#25c05d",
                arrowColor: "#25c05d",
              }}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 16,
                backgroundColor: "#25c05d",
                padding: 12,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
              >
                Lanjut
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Button Konfirmasi */}
      <View style={{ padding: 16 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#25c05d",
            borderRadius: 10,
            padding: 16,
            alignItems: "center",
            shadowColor: "black",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          onPress={() => navigation.navigate("PickUp")} /*Navigasi ke Pickup */
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Konfirmasi
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
