import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AntDesign, Entypo, FontAwesome6 } from "@expo/vector-icons";

type RootStackParamList = {
  Penyetoran: undefined;
  AddAddress: undefined;
  // ... tambahkan screen lain jika ada
};

export default function AddAddressScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
      {/* Informasi Pemilik */}
      <View>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "400",
            marginBottom: 8,
            marginLeft: 0,
          }}
        >
          Informasi Pemilik
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
          Nama
        </Text>
        <TextInput
          placeholder="Masukkan nama lengkap!"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#D3D3D3",
            marginBottom: 16,
            paddingVertical: 4,
          }}
        />
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
          No. Handphone
        </Text>
        <TextInput
          placeholder="Masukkan nomor handphone!"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#D3D3D3",
            marginBottom: 16,
            paddingVertical: 4,
          }}
        />
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
          Label Alamat
        </Text>
        <TextInput
          placeholder="Masukkan label alamat!"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#D3D3D3",
            marginBottom: 16,
            paddingVertical: 4,
          }}
        />
      </View>

      {/* Alamat */}
      <View>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "400",
            marginBottom: 8,
            marginLeft: 0,
          }}
        >
          Alamat
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
          Kota / Kabupaten
        </Text>
        <TextInput
          placeholder="Masukkan kota atau kabupaten!"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#D3D3D3",
            marginBottom: 16,
            paddingVertical: 4,
          }}
        />
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
          Kecamatan
        </Text>
        <TextInput
          placeholder="Masukkan kecamatan!"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#D3D3D3",
            marginBottom: 16,
            paddingVertical: 4,
          }}
        />
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
          Kode Pos
        </Text>
        <TextInput
          placeholder="Masukkan kode pos!"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#D3D3D3",
            marginBottom: 16,
            paddingVertical: 4,
          }}
        />
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
          Detail Lain
        </Text>
        <TextInput
          placeholder="Masukkan detail alamat!"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#D3D3D3",
            marginBottom: 16,
            paddingVertical: 4,
          }}
        />
      </View>

      {/* Button Atur Berdasarkan Pinpoint */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 10,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <Entypo
          name="location-pin"
          size={16}
          color="black"
          className="w-6 h-6"
          style={{
            marginRight: 5,
            marginTop: 1,
          }}
        />
        <Text style={{ fontSize: 16, color: "#404040", flex: 1 }}>
          Atur Berdasarkan Pinpoint
        </Text>
        <AntDesign
          name="right"
          size={16}
          color="black"
          className="w-6 h-6"
          style={{
            marginTop: 3,
            marginRight: 99,
          }}
        />
      </TouchableOpacity>

      {/* Button Simpan */}
      <TouchableOpacity
        style={{
          backgroundColor: "#25c05d",
          borderRadius: 10,
          padding: 16,
          alignItems: "center",
          marginBottom: 16,
        }}
        onPress={() => navigation.navigate("Penyetoran")}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          Simpan Alamat
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
