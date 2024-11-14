import React, { createContext, useState, ReactNode } from "react";

// Definisikan tipe data untuk state
interface SelectedItemsContextType {
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

// Inisialisasi context
const SelectedItemsContext = createContext<
  SelectedItemsContextType | undefined
>(undefined);

// Definisikan tipe untuk props
interface SelectedItemsProviderProps {
  children: ReactNode;
}

// Provider untuk SelectedItemsContext
export const SelectedItemsProvider = ({
  children,
}: SelectedItemsProviderProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  return (
    <SelectedItemsContext.Provider value={{ selectedItems, setSelectedItems }}>
      {children}
    </SelectedItemsContext.Provider>
  );
};

// Custom hook untuk menggunakan context
export const useSelectedItems = () => {
  const context = React.useContext(SelectedItemsContext);
  if (!context) {
    throw new Error(
      "useSelectedItems must be used within a SelectedItemsProvider"
    );
  }
  return context;
};
