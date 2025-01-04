import * as React from "react";
import { useState, useEffect } from "react";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
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
} from "@roketid/windmill-react-ui";
import Layout from "example/containers/Layout";
import PageTitle from "example/components/Typography/PageTitle";
import { EditIcon } from "icons";

type TransactionData = {
  id: string;
  email: string;
  jenisBank: string;
  nama: string;
  namaRekening: string;
  noRekening: string;
  nominal: number;
  pointUsed: number;
  status: string;
  timestamp: string;
  userId: string;
};

const getBadgeType = (status: string): string => {
  switch (status) {
    case "Selesai":
      return "success";
    case "Diajukan":
      return "primary";
    default:
      return "neutral";
  }
};

function Point() {
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<TransactionData | null>(null);
  const resultsPerPage = 10;

  // Mengambil data dari API ketika komponen pertama kali dimuat
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transaksi/gettransaksi"); // Mengambil data dari API
        const result = await response.json();
        if (result.success) {
          setTransactions(result.data); // Menyimpan data ke state
        } else {
          console.error("Failed to fetch transactions");
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  const updateTransactionStatus = async (
    transactionId: string,
    newStatus: string
  ) => {
    try {
      const response = await fetch("/api/transaksi/updatetransaksi", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: transactionId,
          status: newStatus,
        }),
      });
      const data = await response.json();
      if (data.success) {
        console.log("Transaction status updated successfully");
      } else {
        console.error("Failed to update transaction status:", data.error);
      }
    } catch (error) {
      console.error("Error updating transaction status:", error);
    }
  };

  const openModal = (transaction: TransactionData) => {
    setFormData(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setFormData(null);
    setIsModalOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveChanges = async () => {
    if (formData) {
      try {
        // Mengirimkan permintaan untuk mengupdate status transaksi
        const response = await fetch("/api/transaksi/updatetransaksi", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: formData.id,
            status: formData.status,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Update status transaksi di state jika berhasil
          setTransactions((prevData) =>
            prevData.map((item) => (item.id === formData.id ? formData : item))
          );
          console.log("Transaction status updated successfully");
        } else {
          console.error("Failed to update transaction status:", data.error);
        }
      } catch (error) {
        console.error("Error updating transaction status:", error);
      }
    }
    closeModal(); // Menutup modal setelah proses selesai
  };

  // Mendapatkan data untuk tampilan halaman saat ini
  const paginatedTransactions = transactions.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  // Fungsi untuk memformat tanggal ke format yang diinginkan
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Layout>
      <PageTitle>ChangePoint</PageTitle>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Nama Pengguna</TableCell>
              <TableCell>Jenis Bank</TableCell>
              <TableCell>Nama Rekening</TableCell>
              <TableCell>Nomor Rekening</TableCell>
              <TableCell>Nominal</TableCell>
              <TableCell>Point</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tanggal Pengajuan</TableCell>
              <TableCell>Action</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <p className="font-semibold">{transaction.nama}</p>
                </TableCell>
                <TableCell>{transaction.jenisBank}</TableCell>
                <TableCell>{transaction.namaRekening}</TableCell>
                <TableCell>{transaction.noRekening}</TableCell>
                <TableCell>
                  RP.
                  {transaction.nominal.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  {transaction.pointUsed.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  <Badge type={getBadgeType(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {/* Menampilkan tanggal dengan format yang diinginkan */}
                  <p>{formatDate(transaction.timestamp)}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button
                      layout="link"
                      size="small"
                      aria-label="Edit"
                      onClick={() => openModal(transaction)}
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={transactions.length}
            resultsPerPage={resultsPerPage}
            onChange={setPage}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>

      {/* Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Edit Data Transaksi</ModalHeader>
        <ModalBody>
          {formData && (
            <div>
              {/* Nama Pengguna hanya ditampilkan sebagai teks, tidak dapat diubah */}
              <Label>
                <span>Nama Pengguna</span>
                <p className="mt-1 font-semibold">{formData.nama}</p>
              </Label>
              <Label className="mt-4">
                <span>Status</span>
                <Select
                  className="mt-1"
                  name="status"
                  value={formData.status} // Gunakan formData untuk status transaksi
                  onChange={handleInputChange}
                >
                  <option value="">Diajukan</option>
                  <option value="Selesai">Selesai</option>
                </Select>
              </Label>
              {/* Tanggal Pengajuan tidak dapat diubah */}
              <Label className="mt-4">
                <span>Tanggal Pengajuan</span>
                <p className="mt-1">
                  {formatDate(formData.timestamp)}{" "}
                  {/* Menampilkan tanggal yang sudah diformat */}
                </p>
              </Label>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeModal}>
            Batal
          </Button>
          <Button onClick={saveChanges}>Simpan</Button>
        </ModalFooter>
      </Modal>
    </Layout>
  );
}

export default Point;
