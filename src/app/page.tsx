"use client";

import useLocalStorageState from "use-local-storage-state";
import type { Value } from "@/lib/types";
import List from "@/components/ui/list/List";
import { Button } from "@/components/ui/button";
import { CiCirclePlus, CiExport, CiImport } from "react-icons/ci";
import AddSlideModal from "@/components/Modals/AddSlideModal";
import ImportModal from "@/components/Modals/ImportModal";
import ExportModal from "@/components/Modals/ExportModal";
import { ReactNode, useState } from "react";
import Header from "@/components/ui/header";
export default function Home() {
  // ! -2 means not open, -1 creating a file, other means index of edited
  const [openedSlide, setOpenedSlide] = useState(-2);
  const [items, setItems] = useLocalStorageState<Value[]>("list", {
    defaultValue: [],
  });

  const [value, setValue] = useLocalStorageState<Value>("value", {
    defaultValue: {
      title: "",
      richEditor: "",
      bulletPoints: [],
    },
  });
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 py-24">
      <Header />

      <List
        setItems={setItems}
        items={items}
        openedSlide={openedSlide}
        setOpenedSlide={setOpenedSlide}
      />
      <div className="bg- fixed bottom-0 w-fit overflow-hidden rounded-t-xl border-x border-t">
        <div className="relative flex gap-2 p-2">
          <div className="absolute inset-0 bg-opacityToolbarGradient backdrop-blur"></div>

          <ImportModal
            list={items}
            setList={setItems}
            OpenButton={OpenImportButton}
          />
          <AddSlideModal
            openedSlide={openedSlide}
            list={items}
            setOpenedSlide={setOpenedSlide}
            OpenButton={OpenAddSlideButton}
            newValue={value}
            setItems={setItems}
            setNewValue={setValue}
            setList={setItems}
          />
          <ExportModal list={items} OpenButton={OpenExportButton} />
        </div>
      </div>
    </div>
  );
}
function OpenAddSlideButton({
  openedSlide,
  setOpenedSlide,
}: {
  openedSlide: number;
  setOpenedSlide: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <Button
      id="newSlideButton"
      onClick={() => setOpenedSlide(-1)}
      tooltip="Create a new slide"
      className="z-10 flex flex-col"
      variant={"ghost"}
    >
      <CiCirclePlus className="stroke-[1px] text-2xl" />
    </Button>
  );
}
function OpenImportButton() {
  return (
    <Button
      id="importButton"
      tooltip="Import"
      className="z-10 flex flex-col"
      variant={"ghost"}
    >
      <CiImport className="stroke-[1px] text-2xl" />
    </Button>
  );
}
function OpenExportButton() {
  return (
    <Button tooltip="Export" className="z-10 flex flex-col" variant={"ghost"}>
      <CiExport className="stroke-[1px] text-2xl" />
    </Button>
  );
}
