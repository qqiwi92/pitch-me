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
import { Presentation, Slide, Text, Shape, Image, render } from "react-pptx";
import { Button } from "@/components/ui/button";
import { ReactElement, useRef, useState } from "react";
import { ExitIcon } from "@radix-ui/react-icons";
import { DirectionAwareTabs } from "../ui/tabs";
import { Value } from "@/lib/types";
interface IModal {
  OpenButton: () => ReactElement;
  list: Value[];
}

export default function ExportModal({ OpenButton, list }: IModal) {
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
              await downloadPptx(list);
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

const downloadPptx = (list: Value[]) => {
  render(
    <Presentation>
      <Slide>
        <Text
          style={{
            x: 1.73,
            y: 1,
            w: 8,
            h: 1,
            fontSize: 72,
            fontFace: "Montserrat",
            bold: true,
          }}
        >
          Name of the project{" "}
        </Text>
      </Slide>
      {list.map((slide) => {
        return (
          <Slide key={slide.title}>
            <Text
              style={{
                x: 1.73,
                y: 1,
                w: 8,
                h: 1,
                fontSize: 36,
                fontFace: "Montserrat",
                bold: true,
              }}
            >
              {slide.title}
            </Text>
            <Text style={{ x: 3.73, y: 3, w: 3, h: 0.5, fontSize: 18 }}>
              {slide.bulletPoints.map((p) => (
                <Text.Bullet key={p.text} style={{ margin: 10 }}>
                  {" "}
                  {p.text}{" "}
                </Text.Bullet>
              ))}
            </Text>
            <Text style={{ x: 3.73, y: 3, w: 3, h: 0.5, fontSize: 18 }}>
              {slide.richEditor}
            </Text>
          </Slide>
        );
      })}
    </Presentation>,
  ).then((blob) => {
    if (!(blob instanceof ArrayBuffer || blob instanceof Uint8Array)) {
      return;
    }
    const byteArray = new Uint8Array(blob);

    // Create a Blob object from the Uint8Array
    const newBlob = new Blob([byteArray], {
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    });

    const url = URL.createObjectURL(newBlob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "smooth_bootstrap_presentation.pptx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
};
