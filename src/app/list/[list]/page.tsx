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
import { Skeleton } from "@nextui-org/skeleton";
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const {
    items,
    isLoading,
    setItems,
    openedSlide,
    setOpenedSlide,
    currentInfo,
  } = useList();
  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-5 py-24">
        <Link
          href={"/"}
          className="group fixed left-5 top-2 mb-auto mr-auto flex items-center justify-center gap-2 font-bold"
        >
          <ChevronLeft
            strokeWidth={4}
            className="h-4 w-4 text-primary transition group-hover:-translate-x-0.5"
          />
          <Skeleton className="h-6 w-20 rounded-md transition group-hover:opacity-95" />
        </Link>
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="w-full rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-7 w-36 rounded-md text-xl font-bold" />
                <div className="flex gap-2">
                  <MdDeleteOutline className="cursor-pointer text-lg text-foreground/50 transition-colors hover:text-destructive" />
                  <MdModeEditOutline className="cursor-pointer text-lg text-foreground/50 transition-colors hover:text-primary" />
                </div>
              </div>
              <Separator className="my-3 bg-primary/50" />
              <ul>
                {Array(2)
                  .fill(0)
                  .map((point, i) => {
                    return (
                      <li key={i} className="flex">
                        <span className="mr-3 w-5 text-foreground/40">
                          {i < 10 ? `0${i + 1}` : `${i + 1}`}.
                        </span>
                        <Skeleton className="h-4 w-20 rounded-md" />
                      </li>
                    );
                  })}
              </ul>
              {index % 2 == 1 && (
                <div className="">
                  <Separator className="my-3 bg-foreground/5" />
                  <Skeleton className="mx-auto h-7 w-[80%] rounded-md"></Skeleton>
                </div>
              )}
            </div>
          ))}
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-24">
      <Link
        href={"/"}
        className="group fixed left-5 top-2 mb-auto mr-auto flex items-center justify-center gap-2 font-bold"
      >
        <ChevronLeft
          strokeWidth={4}
          className="h-4 w-4 text-primary transition group-hover:-translate-x-0.5"
        />
        <p className="transition group-hover:opacity-95">
          {currentInfo.list_name}
        </p>
      </Link>
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
            list={items ?? []}
            setOpenedSlide={setOpenedSlide}
            OpenButton={OpenAddSlideButton}
            setItems={setItems}
          />
          <ExportModal
            currentInfo={currentInfo}
            list={items ?? []}
            OpenButton={OpenExportButton}
          />
          <ReorderModal
            list={items ?? []}
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
