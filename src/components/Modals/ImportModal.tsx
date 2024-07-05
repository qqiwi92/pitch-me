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
  setList: React.Dispatch<React.SetStateAction<Value[]>>;
}

export default function ImportModal({ OpenButton, list, setList }: IModal) {
  const [open, setOpen] = useState(false);
  const Trigger = OpenButton();
  const [fileContent, setFileContent] = useState<string | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!event.target.files) return;
    const file = event.target.files[0];

    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          if (
            e.target &&
            e.target.result &&
            typeof e.target.result === "string"
          ) {
            const json = JSON.parse(e.target.result);
            setFileContent(json);
          }
        } catch (error) {
          console.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    } else {
      console.error("Please upload a valid JSON file");
    }
  };

  const tabs = [
    {
      id: 0,
      label: "json",
      content: (
        <div className="flex w-full flex-col items-center gap-3 rounded-lg p-4">
          <textarea
            value={fileContent ? JSON.stringify(fileContent, null, 2) : ""}
            onChange={(e) => setFileContent(e.target.value)}
            className="remove-scrollbar h-[25vh] w-full max-w-sm resize-none overflow-auto rounded-xl border bg-background p-2"
          ></textarea>
          <div className="flex w-full items-center justify-center gap-2">
            <Button
              onClick={() => {
                const inputElement = document.getElementById("fileInput");
                if (inputElement) {
                  inputElement.click();
                }
              }}
              variant={"outline"}
            >
              Upload
            </Button>
            <input
              type="file"
              id="fileInput"
              accept=".json"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>
      ),
    },
    {
      id: 1,
      label: "pptx",
      content: (
        <div className="flex w-full flex-col items-center gap-3 rounded-lg p-4">
          <Button onClick={() => {}}>Load pptx</Button>
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
            <CredenzaTitle>Import data</CredenzaTitle>
            <CredenzaDescription>
              To import data select one of those options
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            <DirectionAwareTabs tabs={tabs} />
          </CredenzaBody>
          <CredenzaFooter>
            <CredenzaClose asChild>
              <Button variant="destructive">
                <ExitIcon className="mr-2 -scale-x-100" /> Close
              </Button>
            </CredenzaClose>
            <Button>Save</Button>
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
                fontSize: 72,
                fontFace: "Montserrat",
                bold: true,
              }}
            >
              {slide.title}
            </Text>
            <Text style={{ x: 3.73, y: 3, w: 3, h: 0.5, fontSize: 32 }}>
              {slide.bulletPoints.map((p) => (
                <Text.Bullet style={{ margin: 10 }}> {p.text} </Text.Bullet>
              ))}
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
