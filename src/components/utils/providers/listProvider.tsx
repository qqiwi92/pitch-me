"use client";

import React, { createContext, useContext, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import type { Value } from "@/lib/types";

type ListContextType = {
  items: Value[];
  setItems: React.Dispatch<React.SetStateAction<Value[]>>;
  openedSlide: number;
  setOpenedSlide: React.Dispatch<React.SetStateAction<number>>;
};

const ListContext = createContext<ListContextType | undefined>(undefined);

export const ListProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useLocalStorageState<Value[]>("list", {
    defaultValue: [],
  });
  const [openedSlide, setOpenedSlide] = useState(-2);

  return (
    <ListContext.Provider value={{ items, setItems, openedSlide, setOpenedSlide }}>
      {children}
    </ListContext.Provider>
  );
};

export const useList = () => {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error("useList must be used within a ListProvider");
  }
  return context;
};
