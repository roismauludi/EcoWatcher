/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/PickUp` | `/(tabs)/TongSampah` | `/(tabs)/catalog` | `/(tabs)/context/SelectedItemsContext` | `/(tabs)/dashboard` | `/(tabs)/edukasisampah` | `/(tabs)/explore` | `/(tabs)/penyetoran` | `/(tabs)/profile` | `/(tabs)/riwayat` | `/PickUp` | `/TongSampah` | `/_sitemap` | `/catalog` | `/config` | `/context/SelectedItemsContext` | `/dashboard` | `/edukasisampah` | `/explore` | `/login` | `/navigation/AppNavigator` | `/penyetoran` | `/profile` | `/register` | `/riwayat` | `/screens/CatalogScreen` | `/screens/DashboardScreen` | `/screens/DropPointScreen` | `/screens/PenyetoranScreen` | `/screens/PickUpScreen` | `/screens/ProfileScreen` | `/screens/RiwayatScreen` | `/screens/TongSampahScreen` | `/screens/TukarPointScreen` | `/types`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
