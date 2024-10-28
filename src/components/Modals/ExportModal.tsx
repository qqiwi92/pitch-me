"use client";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";
import { ReactElement, useRef, useState } from "react";
import { ExitIcon } from "@radix-ui/react-icons";
import { DirectionAwareTabs } from "../ui/tabs";
import { List, Slide } from "@/lib/types";
import { downloadPptx } from "./downloadPptx";
interface IModal {
  OpenButton: () => ReactElement;
  list: Slide[];
  currentInfo: List;
}

export default function ExportModal({ OpenButton, list, currentInfo }: IModal) {
  const [open, setOpen] = useState(false);
  const Trigger = OpenButton();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const tabs = [
    {
      id: 0,
      label: "json",
      content: (
        <div className="flex w-full flex-col items-center gap-3 rounded-lg p-4">
          <pre className="remove-scrollbar max-h-[20vh] max-w-sm overflow-auto rounded-xl border p-2">
            {JSON.stringify(list, null, 2)}
          </pre>
          <div className="flex w-full items-center justify-center gap-2">
            <Button
              onClick={() =>
                navigator.clipboard.writeText(JSON.stringify(list, null, 2))
              }
            >
              copy
            </Button>
            <Button
              loading={loading}
              onClick={async () => {
                setLoading(true);
                const blob = new Blob([JSON.stringify(list, null, 2)], {
                  type: "application/json",
                });

                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "data.json";
                link.click();
                URL.revokeObjectURL(url);
                setLoading(false);
              }}
            >
              download
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      label: "pptx",
      content: (
        <div className="flex w-full flex-col items-center gap-3 rounded-lg p-4">
          <Button
            loading={loading}
            onClick={async () => {
              setLoading(true);
              await downloadPptx(list, currentInfo.list_name);
              setLoading(false);
            }}
          >
            download pptx
          </Button>
        </div>
      ),
    },
  ];
  return (
    <>
      <div
        className={`fixed inset-0 z-[99] ${
          open ? "pointer-events-auto backdrop-blur-lg" : "backdrop-blur-none"
        } pointer-events-none transition duration-500`}
      ></div>
      <Credenza open={open} onOpenChange={setOpen}>
        <CredenzaTrigger asChild>{Trigger}</CredenzaTrigger>
        <CredenzaContent className="z-[100]">
          <CredenzaHeader>
            <CredenzaTitle>Export data</CredenzaTitle>
            <CredenzaDescription>
              To export data select one of those options
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            <DirectionAwareTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={tabs}
            />
          </CredenzaBody>
          <CredenzaFooter>
            <CredenzaClose asChild>
              <Button variant="destructive">
                {" "}
                <ExitIcon className="mr-2 -scale-x-100" /> Close
              </Button>
            </CredenzaClose>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </>
  );
}

