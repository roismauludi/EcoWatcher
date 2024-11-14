import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';

// Mendefinisikan tipe untuk item katalog
interface CatalogItem {
  id: string;
  name: string;
  type: string;
  points: number;
  image: any;
  category: string;
  description: string;
}

const catalogData: CatalogItem[] = [
  {
    id: '1',
    name: 'Aluminium',
    type: 'Non-Organik Logam',
    points: 6700,
    image: require('../../assets/images/aluminium.png'),
    category: 'Logam',
    description: 'Limbah aluminium adalah jenis limbah non-organik logam yang dapat didaur ulang.',
  },
  {
    id: '2',
    name: 'Besi Padu',
    type: 'Non-Organik Logam',
    points: 2000,
    image: require('../../assets/images/besi-padu.png'),
    category: 'Logam',
    description: 'Limbah besi padu merupakan limbah non-organik logam yang dapat didaur ulang.',
  },
  {
    id: '3',
    name: 'Botol Plastik',
    type: 'Non-Organik Plastik',
    points: 2000,
    image: require('../../assets/images/botol-atom.png'),
    category: 'Plastik',
    description: 'Limbah botol atom merupakan limbah plastik yang dapat didaur ulang.',
  },
  {
    id: '4',
    name: 'Botol Kaca',
    type: 'Non-Organik Kaca',
    points: 1500,
    image: require('../../assets/images/botol-kaca.png'),
    category: 'Kaca',
    description: 'Limbah botol kaca merupakan suatu limbah berbahan dasar kaca yang memiliki waktu penguraian hingga 1 juta tahun.',
  },
  // Tambahkan item lainnya di sini
];

const CatalogScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchText, setSearchText] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  // Filter data berdasarkan kategori dan teks pencarian
  const filteredData = catalogData.filter(item => {
    const matchCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchSearchText = item.name.toLowerCase().includes(searchText.toLowerCase());
    return matchCategory && matchSearchText;
  });

  const handleItemPress = (item: CatalogItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Katalog Sampah</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari sampah?"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>

      {/* Filter Jenis Sampah */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {['Semua', 'Elektronik', 'Kaca', 'Kertas', 'Logam', 'Plastik'].map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.filterButton, selectedCategory === category && styles.filterButtonSelected]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.filterText, selectedCategory === category && styles.filterTextSelected]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Daftar Katalog Sampah */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)} style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemType}>{item.type}</Text>
            <Text style={styles.itemPoints}>{item.points} Poin / Kg</Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal untuk Menampilkan Detail Item */}
      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Image source={selectedItem.image} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{selectedItem.name}</Text>
              <Text style={styles.modalText}>{selectedItem.type}</Text>
              <Text style={styles.modalPoints}>{selectedItem.points} Poin / Kg</Text>
              <Text style={styles.modalDescription}>{selectedItem.description}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>Tambahkan ke Tong</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    marginVertical: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchInput: {
    marginTop: 10,
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  filterScroll: {
    marginVertical: 10,
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    marginRight: 8,
    minWidth: 80,
  },
  filterButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    fontSize: 12,
    color: '#333',
  },
  filterTextSelected: {
    color: '#fff',
  },
  card: {
    flex: 1,
    margin: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemType: {
    fontSize: 14,
    color: '#666',
  },
  itemPoints: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#4CAF50',
    padding: 20,
  },
  modalContent: {
    alignItems: 'center',
    paddingBottom: 20, // Added padding to give space between the content and the button
  },
  modalImage: {
    width: 200,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalText: {
    fontSize: 16,
    color: '#fff',
  },
  modalPoints: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalDescription: {
    fontSize: 14,
    color: '#fff',
    marginVertical: 10,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default CatalogScreen;
