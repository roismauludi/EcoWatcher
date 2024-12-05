import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Checkbox } from "expo-checkbox";
import { useSelectedItems } from "../(tabs)/context/SelectedItemsContext"; // Pastikan path ini sesuai
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type RootParamList = {
  Penyetoran: undefined;
};

export default function TongScreen() {
  const { selectedItems, setSelectedItems } = useSelectedItems(); // Menggunakan context
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  // Dummy items
  const dummyItems = [
    {
      id: "1",
      title: "Botol Kaca",
      points: "1500 Poin / Kg",
      type: "Non-Organik Kaca",
      image: require("../../assets/images/botol_kaca.png"),
    },
    {
      id: "2",
      title: "Besi Tua",
      points: "2000 Poin / Kg",
      type: "Non-Organik",
      image: require("../../assets/images/besi-padu.png"),
    },
  ];

  const [selectAll, setSelectAll] = useState(false);

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedItems(dummyItems.map((item) => item.id)); // Menambahkan semua item ke selectedItems
    } else {
      setSelectedItems([]);
    }
  };

  const handleDelete = () => {
    console.log("Menghapus item:", selectedItems);
    setSelectedItems([]);
    setSelectAll(false);
  };

  const renderItem = ({
    item,
  }: {
    item: {
      id: string;
      title: string;
      points: string;
      type: string;
      image: any;
    };
  }) => (
    <View style={styles.itemContainer}>
      <Checkbox
        value={selectedItems.includes(item.id)}
        onValueChange={() => {
          if (selectedItems.includes(item.id)) {
            setSelectedItems(selectedItems.filter((id) => id !== item.id));
          } else {
            setSelectedItems([...selectedItems, item.id]);
          }
        }}
      />
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemType}>{item.type}</Text>
        <Text style={styles.itemPoints}>{item.points}</Text>
      </View>
      <TouchableOpacity style={styles.detailButton}>
        <Text style={styles.detailButtonText}>Detail</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tong Sampah</Text>
      </View>

      <View style={styles.actionRow}>
        <View style={styles.selectAll}>
          <Checkbox value={selectAll} onValueChange={toggleSelectAll} />
          <Text style={styles.selectAllText}>Pilih Semua</Text>
        </View>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.deleteText}>Hapus</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={dummyItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>Tidak ada item di tong sampah.</Text>}
      />

      {/* Bagian Total Sampah */}
      {selectedItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>Total Sampah</Text>
          <Text style={styles.itemCount}>
            {selectedItems.length} Jenis Sampah
          </Text>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => navigation.navigate("Penyetoran")}
          >
            <Text style={styles.submitButtonText}>Setorkan</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 2,
  },
  header: {
    backgroundColor: "#35C759",
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  selectAll: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectAllText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  deleteText: {
    fontSize: 16,
    color: "#E53935",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemType: {
    fontSize: 14,
    color: "#777",
    marginVertical: 2,
  },
  itemPoints: {
    fontSize: 14,
    color: "#35C759",
    fontWeight: "600",
  },
  detailButton: {
    backgroundColor: "#E8F5E9",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  detailButtonText: {
    color: "#35C759",
    fontWeight: "bold",
  },
  footer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: {
    fontSize: 16,
    color: "#333",
  },
  itemCount: {
    fontSize: 16,
    color: "#777",
  },
  submitButton: {
    backgroundColor: "#35C759",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
