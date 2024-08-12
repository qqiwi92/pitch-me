"use client";
import { MdDeleteOutline, MdOutlineAddCircleOutline } from "react-icons/md";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";

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
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { Label } from "../ui/label";
import { ReactElement, useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import { heightVariants } from "@/lib/variants";
import { ExitIcon } from "@radix-ui/react-icons";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Value, BulletPoint } from "@/lib/types";
import { ClickButtonById } from "../ui/list/List";

interface IModal {
  list: Value[];
  setList: React.Dispatch<React.SetStateAction<Value[]>>;
  OpenButton: () => ReactElement;
}

export default function ReorderModal({ list, setList, OpenButton }: IModal) {
  const [open, setOpen] = useState(false);
  const Trigger = OpenButton();
  return (
    <>
      <div
        className={`fixed inset-0 z-[40] ${
          open ? "pointer-events-auto backdrop-blur-lg" : "backdrop-blur-none"
        } pointer-events-none transition duration-500`}
      ></div>
      <Credenza open={open} onOpenChange={() => setOpen(!open)}>
        <CredenzaTrigger asChild>{Trigger}</CredenzaTrigger>
        <CredenzaContent className="z-[50]">
          <CredenzaHeader>
            <CredenzaTitle>Reorder slides</CredenzaTitle>
            <CredenzaDescription>
              Drag titles to reorder slides
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            <div className="">
              <Reorder.Group axis="y" values={list} onReorder={setList}>
                {list.map((item, i) => (
                  <Reorder.Item
                    key={item.title}
                    value={item}
                    className="my-2 rounded-xl border bg-background px-4 py-1"
                  >
                    <span className="pr-2 text-foreground/50">
                      {i.toString().length === 1 ? `0${i}` : i}{" "}
                    </span>
                    {item.title}
                  </Reorder.Item>
                ))}
              </Reorder.Group>
              {list.length === 0 && (
                <p>
                  You should create a list first. Check out this new{" "}
                  <ClickButtonById
                    id={[
                      "importButton",
                      "validateFromJson",
                      "openGenerateWithAi",
                    ]}
                  >
                  <span className="bg-gradient-to-tr from-secondary to-primary font-bold text-transparent bg-clip-text">AI mode</span>
                  </ClickButtonById>
                </p>
              )}
            </div>
          </CredenzaBody>
          <CredenzaFooter>
            <CredenzaClose asChild>
              <Button onClick={() => setOpen(false)} variant="destructive">
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
