import * as React from "react";
import { useState, useEffect } from "react";
import { Doughnut, Line } from "react-chartjs-2";

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
  SearchIcon,
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

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const getBadgeType = (status: ITableData["status"]): string => {
  switch (status) {
    case "selesai":
      return "success";
    case "dibatalkan":
      return "danger";
    case "ditimbang":
      return "warning";
    case "dijemput":
      return "primary";
    case "diproses":
      return "neutral";
    default:
      return "neutral";
  }
};

function Catalog() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ITableData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ITableData | null>(null);
  const [detailsData, setDetailsData] = useState<ITableData | null>(null);

  const resultsPerPage = 10;
  const totalResults = response.length;

  const openModal = (user: ITableData) => {
    setFormData(user);
    setIsModalOpen(true);
  };

  const openDetailsModal = (user: ITableData) => {
    setDetailsData(user);
    setIsDetailsModalOpen(true);
  };

  const closeModal = () => {
    setFormData(null);
    setIsModalOpen(false);
  };

  const closeDetailsModal = () => {
    setDetailsData(null);
    setIsDetailsModalOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveChanges = () => {
    if (formData) {
      setData((prevData) =>
        prevData.map((item) => (item.id === formData.id ? formData : item))
      );
    }
    closeModal();
  };

  useEffect(() => {
    setData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage));
  }, [page]);

  return (
    <Layout>
      <PageTitle>Catalog</PageTitle>
      <CTA />

      <div className="flex justify-center flex-1 lg:mr-32 lg:mb-6">
        <div className="relative w-full max-w-xl mr-12 focus-within:text-purple-500">
          <div className="absolute inset-y-0 flex items-center pl-2">
            <SearchIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <Input
            className="pl-8 text-gray-700"
            placeholder="Search for Catalog"
            aria-label="Search"
          />
        </div>
      </div>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Nama Pengguna</TableCell>
              <TableCell>Alamat</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tanggal Penyetoran</TableCell>
              <TableCell>Action</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data &&
              data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Avatar
                        className="hidden mr-3 md:block"
                        src={user.avatar}
                        alt="User avatar"
                      />
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.alamat}</span>
                  </TableCell>
                  <TableCell>
                    <Badge type={getBadgeType(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(user.date).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      <Button
                        layout="link"
                        size="small"
                        aria-label="Edit"
                        onClick={() => openModal(user)}
                      >
                        <EditIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>
                      <Button layout="link" size="small" aria-label="Delete">
                        <TrashIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>
                      <Button
                        layout="link"
                        size="small"
                        aria-label="Details"
                        onClick={() => openDetailsModal(user)}
                      >
                        Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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

      {/* Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Edit Data Pengguna</ModalHeader>
        <ModalBody>
          {formData && (
            <div>
              <Label>
                <span>Nama Pengguna</span>
                <Input
                  className="mt-1"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Label>
              <Label className="mt-4">
                <span>Alamat</span>
                <Input
                  className="mt-1"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                />
              </Label>
              <Label className="mt-4">
                <span>Status</span>
                <Select
                  className="mt-1"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="diproses">Diproses</option>
                  <option value="dijemput">Dijemput</option>
                  <option value="ditimbang">Ditimbang</option>
                  <option value="selesai">Selesai</option>
                  <option value="dibatalkan">Dibatalkan</option>
                </Select>
              </Label>
              <Label className="mt-4">
                <span>Tanggal Penyetoran</span>
                <Input
                  className="mt-1"
                  type="date"
                  name="date"
                  value={new Date(formData.date).toISOString().split("T")[0]}
                  onChange={handleInputChange}
                />
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

      {/* Details Modal */}
      <Modal isOpen={isDetailsModalOpen} onClose={closeDetailsModal}>
        <ModalHeader>Detail Data Pengguna</ModalHeader>
        <ModalBody>
          {detailsData && (
            <div>
              <p>
                <strong>Nama Pengguna:</strong> {detailsData.name}
              </p>
              <p>
                <strong>Alamat:</strong> {detailsData.alamat}
              </p>
              <p>
                <strong>Status:</strong> {detailsData.status}
              </p>
              <p>
                <strong>Tanggal Penyetoran:</strong>{" "}
                {new Date(detailsData.date).toLocaleDateString()}
              </p>
              {/* Tambahkan data lain sesuai kebutuhan */}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeDetailsModal}>
            Tutup
          </Button>
        </ModalFooter>
      </Modal>
    </Layout>
  );
}

export default Catalog;
