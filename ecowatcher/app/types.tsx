import { CatalogItem } from "./CatalogItem";
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  MainTabs: undefined;
  Catalog: undefined;
  Penyetoran: { items: CatalogItem[] };
  PickUp: undefined;
  Rincian : { id: string };
  Dibatalkan: undefined;
  TukarPoint: undefined;
  Tong: undefined; // Define the 'Tong' route here
};
