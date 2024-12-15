export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  image: string;
  points: number;
  unit: string;
  description: string;
  type?: string; // Menambahkan type sebagai properti opsional
}
