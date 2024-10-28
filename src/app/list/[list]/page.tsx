"use client";
import List from "@/components/ui/list/List";
import { CiCirclePlus, CiExport, CiImport } from "react-icons/ci";
import AddSlideModal from "@/components/Modals/AddSlideModal";
import ImportModal from "@/components/Modals/ImportModal";
import ExportModal from "@/components/Modals/ExportModal";
import ReorderModal from "@/components/Modals/ReorderModal";
import { IoReorderFourSharp, IoReorderTwo } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useList } from "@/lib/fetchingList";

export default function Page() {
  const { items, isLoading, setItems, openedSlide, setOpenedSlide,currentInfo } = useList();
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center py-24">
        Loading...
      </div>
    );
  }
  return (
    <div className="flex min-h-screen items-center justify-center py-24">
      <List
        setItems={setItems}
        items={items ?? []}
        setOpenedSlide={setOpenedSlide}
      />
      <div className="fixed bottom-0 w-fit overflow-hidden rounded-t-xl border-x border-t">
        <div className="relative flex gap-2 p-2">
          <div className="absolute inset-0 bg-opacityToolbarGradient backdrop-blur"></div>

          <ImportModal setList={setItems} OpenButton={OpenImportButton} />
          <AddSlideModal
            openedSlide={openedSlide}
            list={items?? []}
            setOpenedSlide={setOpenedSlide}
            OpenButton={OpenAddSlideButton}
            setItems={setItems}
          />
          <ExportModal currentInfo={currentInfo} list={items?? []} OpenButton={OpenExportButton} />
          <ReorderModal
            list={items?? []}
            setList={setItems}
            OpenButton={ReorderButton}
          />
        </div>{" "}
      </div>{" "}
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
function ReorderButton() {
  return (
    <Button tooltip="Reorder" className="z-10 flex flex-col" variant={"ghost"}>
      <IoReorderFourSharp className="stroke-[1px] text-2xl" />
    </Button>
  );
}
