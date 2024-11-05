"use client";
import List from "@/components/ui/list/List";
import { CiCirclePlus, CiExport, CiImport } from "react-icons/ci";
import AddSlideModal from "@/components/Modals/AddSlideModal";
import ImportModal from "@/components/Modals/ImportModal";
import ExportModal from "@/components/Modals/ExportModal";
import ReorderModal from "@/components/Modals/ReorderModal";
import { IoReorderFourSharp, IoReorderTwo } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useList } from "@/lib/fetchingList";
import { Skeleton } from "@nextui-org/skeleton";
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  FilePenLine,
  Gauge,
  Pause,
  Pencil,
  Play,
  Presentation as PresentationIcon,
  Rows3,
  Settings,
  TimerReset,
} from "lucide-react";
import Link from "next/link";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import Presentation from "@/components/ui/presentation/duration-selection";
import { useEffect, useState } from "react";

export default function Page() {
  const {
    items,
    isLoading,
    setItems,
    openedSlide,
    setOpenedSlide,
    currentInfo,
  } = useList();
  const [mode, setMode] = useQueryState("mode");

  const [currentSeconds, setCurrentSeconds] = useQueryState(
    "s",
    parseAsInteger.withDefault(0),
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [index, setIndex] = useQueryState("i", parseAsInteger);
  const [openedModal, setOpenedModal] = useQueryState("modal", parseAsString);
  if (isLoading) {
    return (
      <div className="mx-auto mt-24 flex min-h-screen max-w-xl flex-col items-center justify-center gap-5 bg-background">
        <Link
          href={"/"}
          className="group left-5 top-2 mb-5 mr-auto flex items-center justify-center gap-2 text-xl font-bold underline md:fixed"
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
              <div className="flex items-center justify-start px-2">
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
        <div className="fixed bottom-0 flex w-fit gap-2 overflow-hidden">
          <div className="overflow-hidden rounded-t-xl border-x border-t">
            <div className="relative flex gap-2 p-2">
              <div className="absolute inset-0 bg-opacityToolbarGradient backdrop-blur"></div>
              <Skeleton className="h-8 w-32 rounded-md" />
            </div>{" "}
          </div>
          <div className="overflow-hidden rounded-t-xl border-x border-t">
            <div className="relative flex gap-2 p-2">
              <div className="absolute inset-0 bg-opacityToolbarGradient backdrop-blur"></div>
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>{" "}
          </div>
        </div>
      </div>
    );
  }
  if (mode === "presenting" || mode === "running") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background py-24">
        <Link
          href={"/"}
          className="group left-5 top-2 mb-5 mr-auto flex items-center justify-center gap-2 text-xl font-bold underline md:fixed"
        >
          <ChevronLeft
            strokeWidth={4}
            className="h-4 w-4 text-primary transition group-hover:-translate-x-0.5"
          />
          <p className="transition group-hover:opacity-95">
            {currentInfo.list_name}
          </p>
        </Link>
        <Presentation />
        <div className="fixed bottom-0 flex w-fit gap-2 overflow-hidden">
          <div className="overflow-hidden rounded-t-xl border-x border-t">
            <div className="relative flex gap-2 p-2">
              <div className="absolute inset-0 bg-opacityToolbarGradient backdrop-blur"></div>
              <Button
                tooltip={mode === "running" ? "Stop" : "Start"}
                className="z-10 flex flex-col"
                onClick={() => {
                  if (mode === "running") {
                    setMode("presenting");
                  } else {
                    setMode("running");
                    setIndex(0);
                  }
                }}
                variant={mode === "running" ? "secondary" : "ghost"}
              >
                {mode === "running" ? (
                  <Pause className="stroke-[2px] text-2xl" />
                ) : (
                  <Play className="stroke-[2px] text-2xl" />
                )}
              </Button>
              {mode === "running" && (
                <Button
                  tooltip={"Reset"}
                  className="z-10 flex animate-fadeIn flex-col"
                  onClick={() => {
                    setCurrentSeconds(0);
                    setMode("presenting");
                  }}
                  variant={"ghost"}
                >
                  <TimerReset className="stroke-[2px] text-2xl" />
                </Button>
              )}
            </div>{" "}
          </div>
          <div className="overflow-hidden rounded-t-xl border-x border-t">
            <div className="relative flex gap-2 p-2">
              <div className="absolute inset-0 bg-opacityToolbarGradient backdrop-blur"></div>
              <PresentationButton changeMode={() => setMode("editing")} />
            </div>{" "}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background py-24">
      <Link
        href={"/"}
        className="group left-5 top-2 mb-5 mr-auto flex items-center justify-center gap-2 text-xl font-bold underline md:fixed"
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
      <div className="fixed bottom-0 flex w-fit gap-2 overflow-hidden">
        <div className="flex items-center justify-center gap-2 overflow-hidden rounded-t-xl border-x border-t">
          <div className="relative flex gap-2 p-2">
            <div className="absolute inset-0 z-[-1] rounded-t-xl bg-background/70 backdrop-blur"></div>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger>
                <Button
                  variant={"ghost"}
                  id="editList"
                  className="flex items-center justify-start gap-2"
                >
                  <Pencil className="size-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-fit p-2"
                onClick={() => {
                  setIsPopoverOpen(false);
                }}
              >
                <OpenAddSlideButton setOpenedSlide={setOpenedSlide} />
                <span onClick={() => setOpenedModal("reorder")}>
                  <ReorderButton />
                </span>
                <span onClick={() => setOpenedModal("export")}>
                  <OpenExportButton />
                </span>
                <span onClick={() => setOpenedModal("import")}>
                  <OpenImportButton />
                </span>
              </PopoverContent>
            </Popover>
            <PresentationButton changeMode={() => setMode("presenting")} />
          </div>
        </div>
      </div>
      <ImportModal
        setList={setItems}
        setOpen={() => setOpenedModal("")}
        open={openedModal === "import"}
      />

      <AddSlideModal
        openedSlide={openedSlide}
        list={items ?? []}
        setOpenedSlide={setOpenedSlide}
        setItems={setItems}
      />
      <ExportModal
        open={openedModal === "export"}
        setOpen={() => setOpenedModal("")}
        currentInfo={currentInfo}
        list={items ?? []}
      />
      <ReorderModal
        list={items ?? []}
        open={openedModal === "reorder"}
        setOpen={() => setOpenedModal("")}
        setList={setItems}
      />
    </div>
  );
}

function OpenAddSlideButton({
  setOpenedSlide,
}: {
  setOpenedSlide: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <Button
      id="newSlideButton"
      onClick={() => setOpenedSlide(-1)}
      // tooltip="Create a new slide"
      className="flex items-center justify-start gap-2 px-2"
      variant={"ghost"}
    >
      <CiCirclePlus className="size-5 stroke-[1px] text-2xl" />
      <span>add</span>
    </Button>
  );
}
function OpenImportButton() {
  return (
    <Button
      id="importButton"
      // tooltip="Import"
      className="flex items-center justify-start gap-2 px-2"
      variant={"ghost"}
    >
      <CiImport className="size-5 stroke-[1px] text-2xl" />
      <span>import</span>
    </Button>
  );
}
function OpenExportButton() {
  return (
    <Button
      // tooltip="Export"
      className="flex items-center justify-start gap-2 px-2"
      variant={"ghost"}
    >
      <CiExport className="size-5 stroke-[1px] text-2xl" />
      <span>export</span>
    </Button>
  );
}
function ReorderButton() {
  return (
    <Button
      // tooltip="Reorder"
      className="flex items-center justify-start gap-2 px-2"
      variant={"ghost"}
    >
      <IoReorderFourSharp className="size-5 stroke-[1px] text-2xl" />
      <span>reorder</span>
    </Button>
  );
}
function PresentationButton({ changeMode }: { changeMode: () => void }) {
  const [mode] = useQueryState("mode");
  const [index, setIndex] = useQueryState("i", parseAsInteger);
  return (
    <>
      <Button
        tooltip={mode === "presenting" ? "Edit list" : "Present list"}
        className="z-10 flex flex-col"
        onClick={changeMode}
        variant={"ghost"}
      >
        {mode === "presenting" || mode === "running" ? (
          <Rows3 className="stroke-[2px] text-2xl" />
        ) : (
          <PresentationIcon className="stroke-[2px] text-2xl" />
        )}
      </Button>
      {(mode === "presenting" || mode === "running") && (
        <Button
          tooltip={"Presentation settings"}
          className="z-10 flex flex-col"
          onClick={() => {
            if (index === -1) {
              setIndex(0);
              return;
            }
            setIndex(-1);
          }}
          variant={"ghost"}
        >
          <Settings className="stroke-[2px] text-2xl" />
        </Button>
      )}
    </>
  );
}
