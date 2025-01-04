import * as React from "react";
import { useState, useEffect } from "react";

import CTA from "example/components/CTA";
import InfoCard from "example/components/Cards/InfoCard";
import PageTitle from "example/components/Typography/PageTitle";
import RoundIcon from "example/components/RoundIcon";
import Layout from "example/containers/Layout";
import response, { ITableData } from "utils/demo/tableData";
import {
  ChatIcon,
  CartIcon,
  MoneyIcon,
  PeopleIcon,
  EditIcon,
  TrashIcon,
} from "icons";

import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  Select,
  Textarea,
} from "@roketid/windmill-react-ui";

// Fungsi untuk menentukan jenis badge
const getBadgeType = (status) => {
  switch (status) {
    case "Selesai":
      return "success";
    case "Dibatalkan":
      return "danger";
    case "Ditimbang":
      return "warning";
    case "Dijemput":
      return "primary";
    case "Diproses":
      return "neutral";
    default:
      return "neutral";
  }
};

function Dashboard() {
  const [activeTab, setActiveTab] = useState("semua");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [trackData, setTrackData] = useState([]);
  const [pickupModalOpen, setPickupModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ITableData | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [selectedItem, setSelectedItem] = useState(null); // Ta
  const [quantity, setQuantity] = useState(0); // Tambahkan state untuk quantity
  const [weightModalOpen, setWeightModalOpen] = useState(false);
  const [quantityChanged, setQuantityChanged] = useState(false); // State untuk menyimpan status perubahan quantity
  const resultsPerPage = 10;

  // Fetch data dari API saat komponen pertama kali di-mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/penyetoran/penyetoran");
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          console.error("Gagal mengambil data.");
        }
      } catch (error) {
        console.error("Error saat mengambil data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/pengguna/getuser");
      const result = await response.json();

      if (result.success) {
        setUsers(result.data);
      } else {
        console.error("Gagal mengambil data.");
      }
    } catch (error) {
      console.error("Error saat mengambil data:", error);
    } finally {
      setLoading(false); // Menghentikan loading setelah data diambil
    }
  };

  // Memanggil fetchData saat dibutuhkan (misalnya saat komponen di-render pertama kali)
  // Anda bisa menggunakan useEffect untuk memanggil fungsi fetchData saat komponen dimuat
  if (loading) {
    fetchData();
  }

  const updateStatusAndTrack = async (queueNumber, newStatus) => {
    const response = await fetch(
      `/api/penyetoran/updatestatus?pickupId=${queueNumber}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newStatus }),
      }
    );

    if (!response.ok) {
      throw new Error("Gagal memperbarui status");
    }

    return await response.json();
  };

  // Filter data berdasarkan tab aktif
  const filteredData = data.filter((item) =>
    activeTab === "semua" ? true : item.status === activeTab
  );

  const totalResults = filteredData.length;

  // Data yang akan ditampilkan di tabel
  const displayedData = filteredData.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  // Menangani perubahan status pickup
  const handlePickupStatusChange = async (newStatus, pickupId) => {
    console.log("Updating status for pickupId:", pickupId); // Log pickupId
    try {
      const result = await updateStatusAndTrack(pickupId, newStatus);
      console.log("API Response:", result); // Log respon dari API
      // Update status di tabel data
      setData((prevData) =>
        prevData.map((user) =>
          user.id === pickupId // Ganti user.queueNumber dengan user.id
            ? { ...user, status: newStatus }
            : user
        )
      );
      console.log(result.message); // Tampilkan pesan sukses jika diperlukan
    } catch (error) {
      console.error("Error saat memperbarui status pickup:", error);
      alert("Gagal memperbarui status. Silakan coba lagi."); // Tampilkan pesan kesalahan
    }
  };

  const fetchTrackData = async () => {
    try {
      const response = await fetch("/api/track/gettrack");
      const result = await response.json();
      console.log("Track API Response:", result); // Log respon API
      if (result.success) {
        setTrackData(result.data); // Simpan data track
      } else {
        console.error("Error fetching track data:", result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Panggil fungsi ini di dalam useEffect atau di tempat lain sesuai kebutuhan
  useEffect(() => {
    fetchTrackData();
  }, []);

  const openTrackStatusModal = (user: ITableData) => {
    setSelectedUser(user);
    setPickupModalOpen(true);
  };

  // Menutup modal update status pickup
  const closeTrackStatusModal = () => {
    setSelectedUser(null);
    setPickupModalOpen(false);
  };

  const handleTrackStatusChange = async (newStatus) => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/track/track`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pickupId: selectedUser.id, newStatus }),
      });

      const result = await response.json();
      if (result.success) {
        // Update data di state
        setTrackData((prevData) =>
          prevData.map((track) =>
            track.pickupId === selectedUser.id
              ? {
                  ...track,
                  statuses: [
                    ...track.statuses,
                    { status: newStatus, timestamp: new Date() },
                  ],
                }
              : track
          )
        );
        closeTrackStatusModal(); // Tutup modal setelah berhasil
      } else {
        console.error("Gagal menambahkan status track:", result.message);
      }
    } catch (error) {
      console.error("Error saat menambahkan status track:", error);
    }
  };

  const openWeightModal = (entry) => {
    setQuantity(entry.items[0].quantity); // Set quantity dari item yang dipilih
    setSelectedItem(entry); // Set selectedItem dari entry yang dipilih
    setWeightModalOpen(true); // Buka modal
  };

  const closeWeightModal = () => {
    setWeightModalOpen(false);
    setSelectedUser(null); // Reset user yang dipilih jika diperlukan
  };

  const handleQuantityChange = async () => {
    if (!selectedItem || !selectedItem.items || selectedItem.items.length === 0)
      return;

    const itemId = selectedItem.items[0].itemId; // Ambil itemId dari item pertama
    const pickupId = selectedItem.id; // Ambil id dari selectedItem sebagai pickupId

    // Tambahkan log untuk memeriksa nilai yang akan dikirim
    console.log("Mengirim data:", {
      pickupId: pickupId,
      itemId: itemId,
      newQuantity: quantity,
    });

    try {
      const response = await fetch(`/api/penyetoran/updatejumlah`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pickupId: pickupId,
          itemId: itemId,
          newQuantity: quantity,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setQuantityChanged(true); // Tandai bahwa quantity telah diubah
        // Update data di state
        setData((prevData) =>
          prevData.map((dataItem) =>
            dataItem.items.some((item) => item.itemId === itemId)
              ? {
                  ...dataItem,
                  items: dataItem.items.map((item) =>
                    item.itemId === itemId
                      ? { ...item, quantity } // Update quantity di dalam items
                      : item
                  ),
                }
              : dataItem
          )
        );
        closeWeightModal(); // Tutup modal setelah berhasil
      } else {
        console.error("Gagal memperbarui quantity:", result.message);
      }
    } catch (error) {
      console.error("Error saat memperbarui quantity:", error);
    }
  };

  const totalPengguna = users.length;
  const totalPenyetoran = data.length;
  const menungguVerifikasi = data.filter(
    (item) => item.status === "Pending"
  ).length;
  const selesai = data.filter((item) => item.status === "Selesai").length;

  return (
    <Layout>
      <PageTitle>Dashboard</PageTitle>
      <CTA />

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <InfoCard title="Total Pengguna" value={totalPengguna}>
            <RoundIcon
              icon={PeopleIcon}
              iconColorClass="text-orange-500 dark:text-orange-100"
              bgColorClass="bg-orange-100 dark:bg-orange-500"
              className="mr-4"
            />
          </InfoCard>
        )}

        <InfoCard title="Jumlah Penyetoran" value={totalPenyetoran}>
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard
          title="Menunggu Verifikasi Penyetoran"
          value={menungguVerifikasi}
        >
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Selesai" value={selesai}>
          <RoundIcon
            icon={ChatIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>

      {/* Tab dan tabel */}
      <div className="flex space-x-4 mb-4">
        {/* Filter status Tab */}
        {[
          "semua",
          "Pending",
          "Dijemput",
          "Ditimbang",
          "Selesai",
          "Dibatalkan",
        ].map((status) => (
          <Button
            key={status}
            size="small"
            layout={activeTab === status ? "outline" : "link"}
            onClick={() => {
              setActiveTab(status);
              setPage(1);
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Tabel */}
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Nama Pengguna</TableCell>
              <TableCell>Alamat</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tanggal Penyetoran</TableCell>
              <TableCell>Track</TableCell>
              <TableCell>Action</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {displayedData.map((item) => {
              const user = item.user;
              const trackEntry = trackData.find((track) => {
                console.log("Comparing:", track.pickupId, "with", item.id); // Log untuk debugging
                return track.pickupId === item.id;
              });
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Avatar
                        className="hidden mr-3 md:block"
                        src="/assets/img/default.jpg"
                        alt="User avatar"
                      />
                      <div>
                        <p className="font-semibold">{user.nama}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {user.level}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {item.address
                        ? `${item.address.label_Alamat}, ${item.address.Kecamatan}, ${item.address["kota-kabupaten"]}, ${item.address.Kode_pos}`
                        : "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge type={getBadgeType(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {item.status === "Dijemput" && trackEntry ? (
                        trackEntry.statuses.length === 0 ? (
                          trackEntry.newStatus // Tampilkan newStatus jika statuses kosong
                        ) : (
                          <div>
                            {
                              trackEntry.statuses[
                                trackEntry.statuses.length - 1
                              ].status
                            }{" "}
                            {/* Tampilkan status terbaru */}
                          </div>
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      {item.status === "Pending" ? (
                        <Button
                          layout="link"
                          size="small"
                          onClick={() =>
                            handlePickupStatusChange("Dijemput", item.id)
                          }
                        >
                          Update Status
                        </Button>
                      ) : item.status === "Dijemput" ? (
                        trackEntry &&
                        trackEntry.statuses.length > 0 &&
                        trackEntry.statuses[trackEntry.statuses.length - 1]
                          .status === "Kurir tiba di lokasi" ? (
                          <Button
                            layout="link"
                            size="small"
                            onClick={() =>
                              handlePickupStatusChange("Ditimbang", item.id)
                            }
                          >
                            Update Status to Ditimbang
                          </Button>
                        ) : (
                          <Button
                            layout="link"
                            size="small"
                            onClick={() => openTrackStatusModal(item)}
                          >
                            Tambah Track Status
                          </Button>
                        )
                      ) : item.status === "Ditimbang" ? (
                        quantityChanged ? ( // Cek apakah quantity telah diubah
                          <Button
                            layout="link"
                            size="small"
                            onClick={() =>
                              handlePickupStatusChange("Selesai", item.id)
                            } // Mengubah status ke Selesai
                          >
                            Ubah Status to Selesai
                          </Button>
                        ) : (
                          <Button
                            layout="link"
                            size="small"
                            onClick={() => openWeightModal(item)}
                          >
                            Ubah Berat Massa
                          </Button>
                        )
                      ) : (
                        <span className="text-sm text-gray-500">
                          Tidak ada aksi
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={setPage}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
      {/* <Table>
        <TableBody>
          {data.map((entry) => (
            <TableRow key={entry.id}>
              {entry.items.map((item) => (
                <TableCell key={item.itemId}>
                  <Button onClick={() => openWeightModal(item)}>
                    Ubah Quantity
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
      {/* Modal Update Pickup Status */}
      <div>
        {/* Modal untuk update status pickup */}
        <Modal isOpen={pickupModalOpen} onClose={closeTrackStatusModal}>
          <ModalHeader>Update Status Pickup</ModalHeader>
          <ModalBody>
            <p>
              Mengubah status pickup untuk:{" "}
              <strong>{selectedUser?.name}</strong>
            </p>
            <Select
              className="mt-4"
              onChange={(e) => setNewStatus(e.target.value)} // Menyimpan status baru ke state
            >
              <option value="">Pilih Status Track</option>
              <option value="Kurir akan menjemput sampah Anda">
                Kurir akan menjemput sampah Anda
              </option>
              <option value="Kurir sedang dalam perjalanan">
                Kurir sedang dalam perjalanan
              </option>
              <option value="Kurir tiba di lokasi">Kurir tiba di lokasi</option>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button layout="outline" onClick={closeTrackStatusModal}>
              Batal
            </Button>
            <Button
              layout="link"
              onClick={() => handleTrackStatusChange(newStatus)} // Panggil fungsi untuk mengirim status baru
            >
              Simpan
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={weightModalOpen} onClose={closeWeightModal}>
          <ModalHeader>Ubah Quantity</ModalHeader>
          <ModalBody>
            <p>
              Mengubah quantity untuk: <strong>{selectedUser?.name}</strong>
            </p>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))} // Menyimpan quantity baru ke state
              className="mt-4"
            />
          </ModalBody>
          <ModalFooter>
            <Button layout="outline" onClick={closeWeightModal}>
              Batal
            </Button>
            <Button layout="link" onClick={handleQuantityChange}>
              Simpan
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Layout>
  );
}

export default Dashboard;
