import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import moment from 'moment';
import CONFIG from './../config';

// Define the type for pickup items and address
interface Address {
  Kode_pos: string;
  Kecamatan: string;
  label_Alamat: string;
  No_tlp: string;
  'kota-kabupaten': string;
  Detail_Alamat: string;
  Nama: string;
}

interface PickupItem {
  itemId: string;
  name: string;
  type: string;
  description: string;
  points: number;
  image: string;
}

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
  if (!imageName) {
    console.log("Image name is missing");
    return imageMapping["default"]; // Fallback to a default image
  }

  console.log("Image requested:", imageName);
  return imageMapping[imageName] || imageMapping["default"];
};

const formatScheduleDate = (isoDate: string) => {
  return moment(isoDate).format('dddd, D MMMM YYYY');
};

const RincianPenjemputan = () => {
  const [pickups, setPickups] = useState<PickupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<Address | null>(null);
  const [schedule, setSchedule] = useState('');
  const [photos, setPhotos] = useState<string[]>([]); // State untuk foto kamera
  const [isNoteExpanded, setIsNoteExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PickupItem | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${CONFIG.API_URL}/api/get-pickups`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.data && result.data.length > 0) {
          const firstPickup = result.data[1];
          setPickups(firstPickup.items);
          setAddress(firstPickup.address);

          // Set foto kamera
          if (firstPickup.photos && firstPickup.photos.length > 0) {
            setPhotos(firstPickup.photos);
          }

          // Format tanggal dengan moment.js
          const formattedDate = moment(firstPickup.pickUpDate).format('dddd, D MMMM YYYY');
          setSchedule(formattedDate);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDetailPress = (item: PickupItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  if (loading) {
    return <Text>Memuat data...</Text>; // Show loading message while data is being fetched
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alamat Penjemputan</Text>
        <View style={styles.addressContainer}>
          {address && (
            <>
              <Text style={styles.addressName}>
                {address.Nama} <Text style={styles.tag}>{address.label_Alamat}</Text>
              </Text>
              <Text style={styles.addressDetails}>
                {address.Detail_Alamat}, {address.Kecamatan}, {address['kota-kabupaten']} {address.Kode_pos}
              </Text>
              <Text style={styles.addressDetails}>{address.No_tlp}</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Item Penjemputan</Text>
        {pickups.map((item) => (
          <View key={item.itemId} style={styles.card}>
            <Image source={getImageSource(item.image)} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardType}>{item.type}</Text>
              <Text style={styles.cardPoints}>{item.points} Points</Text>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => handleDetailPress(item)}
              >
                <Text style={styles.detailButtonText}>Detail</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Foto Kamera</Text>
        <ScrollView horizontal>
          {photos.map((photo, index) => {
            // Mengganti backslash dengan slash untuk memastikan path gambar valid
            const formattedPhoto = photo.replace(/\\/g, '/');
            console.log(`Formatted Photo Path [${index}]:`, formattedPhoto);

            return (
              <Image
                key={index}
                source={{ uri: `${CONFIG.API_URL}/${formattedPhoto}` }}  // Menambahkan URL API sebelum path gambar
                style={styles.cameraPhoto}
                onError={(error) => console.log(`Error loading image [${index}]:`, error.nativeEvent)}
              />
            );
          })}
        </ScrollView>
      </View>


      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Jadwal Penjemputan</Text>
        <View style={styles.scheduleContainer}>
          <AntDesign name="calendar" size={24} color="#00796b" style={styles.calendarIcon} />
          <Text style={styles.scheduleDate}>{schedule}</Text>
        </View>
      </View>

      {/* Keterangan expandable */}
      <View style={styles.section}>
          <TouchableOpacity
            onPress={() => setIsNoteExpanded(!isNoteExpanded)}
            style={styles.expandButton}
          >
        <Text style={styles.expandButtonText}>
        {isNoteExpanded ? 'Tutup' : 'Tampilkan Lebih Banyak'}
        </Text>
        <AntDesign
          name={isNoteExpanded ? 'up' : 'down'}
          size={16}
          color="black"
          style={styles.expandIcon}
        />
          </TouchableOpacity>
          {isNoteExpanded && (
          <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            Penjemputan akan dilakukan pukul 15:00.
          </Text>
          <Text style={styles.noteTextSub}>
            Harap memastikan bahwa sampah telah dipisahkan sesuai jenisnya sebelum penjemputan. 
            Pastikan juga alamat yang diberikan benar untuk mempermudah proses penjemputan.
          </Text>
        </View>
        
          )}
      </View>

      <TouchableOpacity style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Batalkan</Text>
      </TouchableOpacity>

      {/* Modal to show item details */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                <Text style={styles.modalDescription}>{selectedItem.description}</Text>
                <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
                  <Text style={styles.modalCloseButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addressContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  addressName: {
    fontWeight: 'bold',
  },
  tag: {
    color: 'green',
  },
  addressDetails: {
    color: '#555',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardImage: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  cardType: {
    color: '#555',
  },
  cardPoints: {
    color: 'green',
  },
  detailButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  detailButtonText: {
    color: 'green',
    fontWeight: 'bold',
  },
  cameraPhoto: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  scheduleContainer: {
    backgroundColor: '#e0f7fa',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#26c6da',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection: 'row',  // Menambahkan flexDirection row agar ikon dan teks berada dalam satu baris
    alignItems: 'center',  // Menjaga ikon dan teks berada di tengah vertikal
  },
  calendarIcon: {
    marginRight: 12,  // Memberikan jarak antara ikon dan teks
  },
  scheduleDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796b',
    textAlign: 'center',
    flex: 1,  // Agar teks menyesuaikan sisa ruang setelah ikon
  },
 expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',  // Center content horizontally
  },
  expandButtonText: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.6)',  // Transparent black text color
    marginRight: 8,
  },
  expandIcon: {
    marginLeft: 8,
  },
  noteContainer: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginTop: 8,
  },
  noteText: {
    color: '#555',
    fontSize: 14,
  },
  noteTextSub: {
    fontSize: 14,
    color: '#555', // Lighter color for the rest of the text
    marginTop: 4, // Adds a little space between the top and bottom parts
  },
  cancelButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'green',
  },
  cancelButtonText: {
    color: 'green',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  modalCloseButton: {
    alignSelf: 'center',
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});


export default RincianPenjemputan;
