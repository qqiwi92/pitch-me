"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import type { Slide } from "@/lib/types";
import { createClient } from "../supabase/client";

type ListContextType = {
  items: Slide[];
  setItems: React.Dispatch<React.SetStateAction<Slide[]>>;
  openedSlide: number;
  setOpenedSlide: React.Dispatch<React.SetStateAction<number>>;
};

const ListContext = createContext<ListContextType | undefined>(undefined);

export const ListProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useLocalStorageState<Slide[]>("list", {
    defaultValue: [],
  });
  const [openedSlide, setOpenedSlide] = useState(-2);

  return (
    <ListContext.Provider
      value={{ items, setItems, openedSlide, setOpenedSlide }}
    >
      {children}
    </ListContext.Provider>
  );
};

export const useList = (list_id: string) => {
  const context = useContext(ListContext);

  if (!context) {
    throw new Error("useList must be used within a ListProvider");
  }
  return context;
};
