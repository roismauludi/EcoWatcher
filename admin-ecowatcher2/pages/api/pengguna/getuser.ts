import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../utils/firebase/config";
import { collection, getDocs } from "firebase/firestore";

// Tipe untuk Pengguna
type User = {
  id: string;
  nama: string;
  role: string;
  foto: string[]; // Jika ada foto
  [key: string]: any; // Data tambahan untuk pengguna
};

// Tipe untuk Response API
type ResponseData = {
  success: boolean;
  data?: User[]; // Menyimpan array data pengguna
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Log metode request
  console.log(`Received ${req.method} request`);

  if (req.method !== "GET") {
    console.log("Method not allowed");
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    console.log("Fetching data from Firestore...");

    // Ambil data dari koleksi Pengguna
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    const usersData = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`Found ${usersData.length} users`);

    // Mengirim data pengguna dalam respon
    res.status(200).json({ success: true, data: usersData });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
