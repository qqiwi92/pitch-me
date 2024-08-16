"use client";
import { IoIosArrowRoundUp } from "react-icons/io";
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
import React, { ReactElement, useRef, useState } from "react";
import { ExitIcon } from "@radix-ui/react-icons";
import { DirectionAwareTabs } from "../ui/tabs";
import { AImportStatus, validateJsonOnValueType, Value } from "@/lib/types";
import { motion } from "framer-motion";
import { useToast } from "../ui/toast/use-toast";
import { examples } from "@/lib/data/examples";
import { Textarea } from "../ui/textarea";
import generateSchema from "@/lib/generateSchema";
import { useMutation } from "@tanstack/react-query";
import useLocalStorageState from "use-local-storage-state";
interface IModal {
  OpenButton: () => ReactElement;
  list: Value[];
  setList: React.Dispatch<React.SetStateAction<Value[]>>;
}
export const runtime = "edge";

export default function ImportModal({ OpenButton, list, setList }: IModal) {
  // state
  const [open, setOpen] = useState(false);
  const Trigger = OpenButton();
  const [activeTab, setActiveTab] = useState(0);
  const [validated, setValidated] = useState(false);
  const [fileContent, setFileContent] = useLocalStorageState("importJson", {
    defaultValue: "",
  });
  const [aiInput, setAiInput] = useLocalStorageState("aiInput", {
    defaultValue: "",
  });
  const { toast } = useToast();
  const { mutate: server_generateSchema, isPending } = useMutation({
    mutationFn: async () => {
      const response = await generateSchema(aiInput);
      if (response.status === "error") {
        console.log("error");
        server_generateSchema();
      }
      if (response.status === "success") {
        setFileContent(response.message);
        setActiveTab(0);
        setValidated(true);
        toast({
          title: "JSON was successfully generated",
          description: "Now you can import it to the list",
          variant: "success",
        });
      }
      return response;
    },
  });
  // functions
  function validateJSONSave() {
    if (!validated) {
      if (activeTab === tabs.find((t) => t.label === "json")?.id) {
        try {
          if (!fileContent) {
            toast({
              title: "JSON file is empty",
              description: "Please upload a valid JSON file",
              variant: "destructive",
            });
            return;
          }
          const json = JSON.parse(fileContent);
          if (validateJsonOnValueType(json)) {
            toast({
              title: "JSON file is valid",
              description: "Click save to add it to the list",
              variant: "success",
            });
            setValidated(true);
          } else {
            toast({
              title: "JSON file does not match schema",
              description: "Please upload a valid JSON file",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Invalid JSON file",
            description: "Please upload a valid JSON file",
            variant: "destructive",
          });
        }
      } else {
        try {
          const json = JSON.parse(aiInput);
          if (validateJsonOnValueType(json)) {
            toast({
              title: "JSON file is valid",
              description: "Click save to add it to the list",
              variant: "success",
            });
            setValidated(true);
          } else {
            toast({
              title: "JSON file does not match schema",
              description: "Please upload a valid JSON file",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Invalid JSON file",
            description: "Please upload a valid JSON file",
            variant: "destructive",
          });
        }
      }
    } else {
      if (activeTab === tabs.find((t) => t.label === "json")?.id) {
        if (!fileContent) return;
        setList(JSON.parse(fileContent));
      } else {
        setList(JSON.parse(aiInput));
      }
      setOpen(false);
      toast({
        description: "✅️ Data has been updated",
        variant: "success",
      });
    }
  }
  const handleJsonFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            setFileContent(JSON.stringify(json, null, 2));
            setValidated(false);
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
          <Textarea
            placeholder="// Your JSON goes here"
            value={fileContent ? fileContent : ""}
            onChange={(e) => {
              setFileContent(e.target.value);
              setValidated(false);
            }}
            className="remove-scrollbar h-[20vh]"
          />
          <div className="flex w-full items-center justify-center gap-2">
            <Button
              onClick={() => {
                const inputElement = document.getElementById("jsonFileInput");
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
              id="jsonFileInput"
              accept=".json"
              style={{ display: "none" }}
              onChange={handleJsonFileChange}
            />
          </div>
        </div>
      ),
    },
    {
      id: 1,
      label: "✨ generate from text",
      content: (
        <div className="flex w-full flex-col items-center gap-3 overflow-hidden rounded-lg py-2">
          <p>
            ⚠️ Note that this feature is{" "}
            <span className="font-bold text-primary"> experimental</span>
          </p>
          <Textarea
            value={aiInput}
            onChange={(e) => {
              setValidated(false);
              setAiInput(e.target.value);
            }}
            maxLength={100}
            className={`remove-scrollbar mx-2 focus:outline-none ${aiInput.length > 128 ? "h-[35vh]" : "h-[20vh]"}`}
            placeholder="So I want to pitch investors this million dollar idea..."
          />
          <p
            className={`transition-all ${aiInput.length >= 100 ? "scale-x-105 text-red-600" : ""}`}
          >
            {" "}
            {aiInput.length}/100
          </p>
          <div className="remove-scrollbar flex max-w-[100%] gap-2 overflow-x-auto">
            {examples.map((example) => {
              return (
                <Button
                  key={example.title}
                  variant="outline"
                  className="my-[1px] flex h-fit select-none flex-nowrap border-secondary py-0.5 text-sm hover:border-transparent hover:bg-foreground"
                  onClick={() => {
                    setValidated(false);
                    setAiInput(example.description);
                  }}
                >
                  {example.title}
                  <IoIosArrowRoundUp className="rotate-45 text-xl" />
                </Button>
              );
            })}
          </div>

          <Button
            className={`group`}
            onClick={() => {
              server_generateSchema();
            }}
            loading={isPending}
            variant={"outline"}
          >
            {isPending ? "Generating " : "Generate "}
            scheme with
            <span className="ml-1 font-bold text-primary transition-colors group-hover:text-background">
              {" "}
              AI
            </span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <button
        id="openGenerateWithAi"
        onClick={() => setActiveTab(1)}
        className="hidden"
      >
        click to move to ai generating
      </button>
      <button
        id="validateFromJson"
        onClick={() => setActiveTab(1)}
        className="hidden"
      >
        click import from json
      </button>
      <div
        className={`fixed inset-0 z-[99] ${
          open ? "pointer-events-auto backdrop-blur-lg" : "backdrop-blur-none"
        } pointer-events-none transition duration-500`}
      ></div>
      <Credenza open={open} onOpenChange={setOpen}>
        <CredenzaTrigger asChild>{Trigger}</CredenzaTrigger>
        <CredenzaContent className="remove-scrollbar z-[100]">
          <CredenzaHeader>
            <CredenzaTitle>Import data</CredenzaTitle>
            <CredenzaDescription>
              To import data select one of those options
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody className="p-1">
            <DirectionAwareTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={tabs}
            />
          </CredenzaBody>
          <CredenzaFooter className="flex">
            <CredenzaClose asChild>
              <motion.div layout>
                <Button variant="destructive">
                  <ExitIcon className="mr-2 -scale-x-100" /> Close
                </Button>
              </motion.div>
            </CredenzaClose>
            <motion.div layout>
              <Button
                layout={false}
                className={`${validated ? "bg-accent hover:bg-accent/90" : "bg-primary hover:bg-primary/90"} select-none transition duration-200 ${activeTab === 1 ? "w-0 p-0" : "w-fit"} max-w-20 transition-all`}
                onClick={() => validateJSONSave()}
              >
                {validated ? "Apply" : "Validate"}
              </Button>
            </motion.div>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </>
  );
}
