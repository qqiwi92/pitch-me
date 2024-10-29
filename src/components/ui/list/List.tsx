"use client";

import { Slide } from "@/lib/types";
import DOMPurify from "dompurify";
import { TbFileSad } from "react-icons/tb";
import { Separator } from "../separator";
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "../skeleton";
import { Suspense, useEffect, useState } from "react";
import AnimatedGradientText from "@/components/utils/animated-gradinent-text";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Coolshape } from "coolshapes-react";

interface IList {
  items: Slide[];
  setItems: (newSlide: Slide[]) => void;
  setOpenedSlide: React.Dispatch<React.SetStateAction<number>>;
}

export default function List({ items, setItems, setOpenedSlide }: IList) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  return (
    <div className="remove-scrollbar flex w-full max-w-xl flex-col gap-5">
      {items.length === 0 && loaded && (
        <>
          <div
            id="newSlideButton"
            className="fixed left-1/2 top-32 w-full -translate-x-1/2 cursor-pointer"
          >
            <ClickButtonById
              id={["importButton", "validateFromJson", "openGenerateWithAi"]}
            >
              <AnimatedGradientText>
                🎉 <hr className="mx-2 h-4 w-[1px] shrink-0" />{" "}
                <span
                  className={cn(
                    `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                  )}
                >
                  Introducing generating lists with AI
                </span>
                <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </AnimatedGradientText>
            </ClickButtonById>
          </div>
          <div className="mx-auto flex w-fit max-w-sm flex-col items-center justify-center">
            <span className="flex flex-col items-center justify-center text-2xl font-semibold">
              <Coolshape type="wheel" className="mb-5" />
              We didn&apos;t find any data.
            </span>
            <span className="text-center text-foreground/50">
              You can create a new data list either in{" "}
              <ClickButtonById id="importButton">import </ClickButtonById> page
              of <ClickButtonById id="newSlideButton"> create </ClickButtonById>
              page
            </span>
          </div>
        </>
      )}
      <AnimatePresence mode="popLayout">
        {items.map((item, i) => {
          const cleanHtml = DOMPurify.sanitize(item.richEditor, {
            USE_PROFILES: { html: true },
          });

          return (
            <motion.div
              layout
              // initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              key={item.title + item.slideId}
              className="w-full rounded-xl border p-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{item.title}</h2>
                <div className="flex gap-2">
                  <MdDeleteOutline
                    onClick={() => {
                      setItems(items.filter((i) => i.title !== item.title));
                    }}
                    className="cursor-pointer text-lg text-foreground/50 transition-colors hover:text-destructive"
                  />
                  <MdModeEditOutline
                    className="cursor-pointer text-lg text-foreground/50 transition-colors hover:text-primary"
                    onClick={() => setOpenedSlide(i)}
                  />
                </div>
              </div>
              {item.richEditor.length > 0 && (
                <Separator className="my-3 bg-primary/50" />
              )}
              <ul>
                {item.bulletPoints.map((point, i) => {
                  return (
                    <li key={point.text}>
                      <span className="mr-3 text-foreground/40">
                        {i < 10 ? `0${i + 1}` : `${i + 1}`}.
                      </span>
                      <span>{point.text}</span>
                    </li>
                  );
                })}
              </ul>

              <Separator className="my-3 bg-foreground/5" />
              <div
                className="prose prose-invert flex flex-col items-center justify-center leading-[1.2] text-foreground/80 prose-h1:mb-0 prose-img:rounded-xl [&>*]:text-foreground"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
              ></div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {items.length > 3 && (
        <div className="flex items-center justify-center gap-3">
          <div className="text-center text-foreground/50">
            {items.length} Slides
          </div>
          <div className="select-none text-center text-foreground/50">|</div>
          <div
            onClick={() => setItems([])}
            className="cursor-pointer text-center text-foreground/50 transition-colors hover:text-destructive"
          >
            delete all
          </div>
        </div>
      )}
    </div>
  );
}

export function ClickButtonById({
  children,
  id,
}: {
  id: string | string[];
  children: React.ReactNode;
}) {
  const handleClick = async () => {
    const idArray = Array.isArray(id) ? id : [id];
    for (const id of idArray) {
      const button = document.getElementById(id);
      if (button) {
        const clickEvent = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        button.dispatchEvent(clickEvent);
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  return (
    <span className="cursor-pointer text-primary" onClick={handleClick}>
      {children}
    </span>
  );
}
