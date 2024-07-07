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
interface IModal {
  list: Value[];
  setList: React.Dispatch<React.SetStateAction<Value[]>>;
  newValue: Value;
  setNewValue: React.Dispatch<React.SetStateAction<Value>>;
  setItems: React.Dispatch<React.SetStateAction<Value[]>>;
  OpenButton: ({
    openedSlide,
    setOpenedSlide,
  }: {
    openedSlide: number;
    setOpenedSlide: React.Dispatch<React.SetStateAction<number>>;
  }) => ReactElement;
  openedSlide: number;
  setOpenedSlide: React.Dispatch<React.SetStateAction<number>>;
}

export default function AddSlideModal({
  newValue,
  list,
  setNewValue,
  openedSlide,
  setOpenedSlide,
  setList,
  setItems,
  OpenButton,
}: IModal) {
  const formSchema = z.object({
    title: z
      .string({ required_error: "Title is required" })
      .min(2, "Title should be at least 2 characters"),
    richEditor: z.string().optional(),
    bulletPoints: z
      .array(
        z.object({
          id: z.string(),
          text: z.string(),
        }),
        {
          required_error: "Please add at least 2 bullet points",
        },
      )
      .min(2, "Please add at least 2 bullet points"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    setValue({ ...values, richEditor: values.richEditor ?? "" });
    setItems((prev) => [...prev, value]);
    setValue({
      title: "",
      richEditor: "",
      bulletPoints: [],
    });
    setOpenedSlide(-2);
  }
  const Trigger = OpenButton({
    openedSlide: openedSlide,
    setOpenedSlide: setOpenedSlide,
  });
  const [value, setValue] = useState<Value>({
    title: "",
    richEditor: "",
    bulletPoints: [],
  });



  useEffect(() => {
    if (openedSlide === -1) {
      setNewValue(
        value ?? {
          title: "",
          richEditor: "",
          bulletPoints: []
        },
      );
    } else if (openedSlide > -1) {
      setList((prev) => [
        ...prev.slice(0, openedSlide),
        value,
        ...prev.slice(openedSlide + 1),
      ]);
    }
  }, [value]);
  useEffect(() => {
    if (openedSlide === -1) {
      setValue(newValue);
    } else if (openedSlide > -1) {
      setValue(list[openedSlide]);
    }
  }, [openedSlide]);
  return (
    <>
      <div
        className={`fixed inset-0 z-[40] ${
          openedSlide > -2
            ? "pointer-events-auto backdrop-blur-lg"
            : "backdrop-blur-none"
        } pointer-events-none transition duration-500`}
      ></div>
      <Credenza
        open={openedSlide > -2}
        onOpenChange={() => {
          if (openedSlide > -2) setOpenedSlide(-2);
        }}
      >
        <CredenzaTrigger asChild>{Trigger}</CredenzaTrigger>
        <CredenzaContent className="z-[50]">
          <CredenzaHeader>
            <CredenzaTitle>{openedSlide === -1? "Slide creation":"Edit slide"}</CredenzaTitle>
            <CredenzaDescription>
              To create a slide please fill out those forms
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="remove-scrollbar flex flex-col gap-3 overflow-y-scroll px-1"
              >
                <FormField
                  name="title"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <TitleInput
                        field={field}
                        value={value}
                        form={form}
                        setValue={setValue}
                      />
                    );
                  }}
                />
                <FormField
                  name="bulletPoints"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="bulletPoints"
                        className="text-lg font-bold"
                      >
                        Bullet points
                      </FormLabel>
                      <FormControl>
                        <SelectStrings
                          field={field}
                          strings={value.bulletPoints}
                          setValue={setValue}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="">
                  <Label htmlFor="rich" className="text-lg font-bold">
                    Content <span className="text-foreground/70">(notes)</span>
                  </Label>
                  <MinimalTiptapEditor
                    id="rich"
                    value={value.richEditor}
                    className="my-2"
                    onValueChange={(e) =>
                      setValue({ ...value, richEditor: e.toString() })
                    }
                    contentClass=""
                  />
                </div>
              </form>
            </Form>
          </CredenzaBody>
          <CredenzaFooter>
            <CredenzaClose asChild>
              <Button onClick={() => setOpenedSlide(-2)} variant="destructive">
                {" "}
                <ExitIcon className="mr-2 -scale-x-100" /> Close
              </Button>
            </CredenzaClose>
            {openedSlide === -1 && (
              <Button
                variant="shine"
                onClick={(e) => {
                  form.handleSubmit(onSubmit)(e);
                }}
              >
                Save
              </Button>
            )}
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </>
  );
}

interface TitleInputProps {
  field: ControllerRenderProps<
    {
      title: string;
      bulletPoints: {
        id: string;
        text: string;
      }[];
      richEditor?: string | undefined;
    },
    "title"
  >;
  value: Value;
  setValue: (value: Value) => void;
  form: UseFormReturn<
    {
      title: string;
      bulletPoints: {
        id: string;
        text: string;
      }[];
      richEditor?: string | undefined;
    },
    any,
    undefined
  >;
}
function TitleInput({ field, value, form, setValue }: TitleInputProps) {
  useEffect(() => {
    field.onChange({ target: { value: value.title } });
  }, []);
  return (
    <FormItem>
      <FormLabel htmlFor="title" className="text-lg font-bold">
        Title
      </FormLabel>
      <FormControl>
        <Input
          {...field}
          type="text"
          name="title"
          id="title"
          value={value.title}
          required
          onChange={(e) => {
            field.onChange(e);
            setValue({ ...value, title: e.target.value });
          }}
          className={cn("w-full", {
            "border-destructive focus-within:border-destructive":
              form.formState.errors.title,
          })}
          placeholder="Slide title"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

function SelectStrings({
  setValue,
  strings,
  field,
}: {
  strings: BulletPoint[] | undefined;
  setValue: IModal["setNewValue"];
  field: ControllerRenderProps<
    {
      title: string;
      bulletPoints: BulletPoint[];
      richEditor?: string | undefined;
    },
    "bulletPoints"
  >;
}) {
  const [newItem, setNewItem] = useState("");
  const container = useRef<HTMLDivElement | null>(null);
  const listItems = strings || [];
  useEffect(() => {
    field.onChange({ target: { value: listItems } });
  }, []);
  const addNew = () => {
    if (newItem.trim() === "") return;
    field.onChange({ target: { value: listItems } });
    setValue((prevState) => ({
      ...prevState,
      bulletPoints: [...listItems, { id: crypto.randomUUID(), text: newItem }],
    }));
    setNewItem("");
  };
  return (
    <div>
      <ul
        className={`${
          listItems.length > 0 ? "" : "hidden"
        } my-2 flex flex-col gap-1 rounded-xl border bg-foreground/10 p-3`}
      >
        <Reorder.Group
          ref={container}
          onReorder={(new_order) =>
            setValue((prev) => ({ ...prev, bulletPoints: new_order }))
          }
          axis="y"
          values={listItems}
        >
          {listItems.map((string, i) => (
            <Reorder.Item
              className="cursor-pointer rounded-xl bg-opacityListGradient px-1 backdrop-blur"
              key={string.id}
              value={string}
              dragConstraints={container}
              dragElastic={0.01}
              id={string.id}
            >
              <AnimatePresence mode="sync" initial={false}>
                <motion.div
                  layout
                  key={string.id}
                  variants={heightVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="transition"
                  transition={{ type: "spring" }}
                >
                  <span className="relative flex items-center gap-3">
                    <MdDeleteOutline
                      className="absolute right-0 cursor-pointer text-lg text-foreground/50 transition-colors hover:text-destructive"
                      onClick={() =>
                        setValue((prevState) => ({
                          ...prevState,
                          bulletPoints: listItems.filter((_, j) => j !== i),
                        }))
                      }
                    />
                    <span className="select-none text-foreground/60">
                      {i + 1}
                    </span>
                    <input
                      value={string.text}
                      onChange={(e) => {
                        setValue((prevState) => ({
                          ...prevState,
                          bulletPoints: [
                            ...listItems.slice(0, i),
                            { text: e.target.value, id: string.id },
                            ...listItems.slice(i + 1),
                          ],
                        }));
                      }}
                      className="w-full max-w-[100px] select-none bg-transparent focus:outline-none focus:ring-0"
                    />
                  </span>
                  {i !== listItems.length - 1 && (
                    <Separator
                      className={`my-3 bg-foreground/30 ${
                        i === listItems.length - 1 ? "opacity-0" : "opacity-100"
                      }`}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </ul>
      <div className="box-border flex items-center justify-center gap-2">
        <Input
          value={newItem}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addNew();
            }
          }}
          onChange={(e) => setNewItem(e.target.value)}
          className="h-[40px] py-0"
          placeholder="add a list item"
        />
        <Button
          onClick={addNew}
          layout={false}
          variant="ringHover"
          className="box-border py-0 leading-tight"
        >
          add
        </Button>
      </div>
    </div>
  );
}
