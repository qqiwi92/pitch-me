"use client";

import { Value } from "@/lib/types";
import DOMPurify from "dompurify";
import { TbFileSad } from "react-icons/tb";
import { Separator } from "../separator";
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md";
import { motion } from "framer-motion";
import { Skeleton } from "../skeleton";
import { Suspense, useEffect, useState } from "react";

interface IList {
  items: Value[];
  setItems: React.Dispatch<React.SetStateAction<Value[]>>;
  openedSlide: number;
  setOpenedSlide: React.Dispatch<React.SetStateAction<number>>;
}

export default function List({
  items,
  setItems,
  openedSlide,
  setOpenedSlide,
}: IList) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  return (
    <Suspense fallback={<ListSkeleton />}>
      <div className="remove-scrollbar flex w-full max-w-xl flex-col gap-5">
        {!loaded && (
          <ListSkeleton/>
        )}
        {items.length === 0 && loaded && (
          <div className="mx-auto flex w-fit max-w-sm flex-col justify-center">
            <span className="">
              <TbFileSad className="text-5xl" />
              We didn&apos;t find any data.
            </span>
            <span className="text-foreground/50">
              You can create a new data list either in import page of create
              page
            </span>
          </div>
        )}
        {items.map((item, i) => {
          const cleanHtml = DOMPurify.sanitize(item.richEditor, {
            USE_PROFILES: { html: true },
          });

          return (
            <motion.div
              layout
              key={item.title}
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
                className="prose prose-stone flex flex-col items-center justify-center leading-[1.2] text-foreground/80 prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
              ></div>
            </motion.div>
          );
        })}
        {items.length > 3 && (
          <div className="text-center text-foreground/50">
            {items.length} Slides
          </div>
        )}
      </div>
    </Suspense>
  );
}

function ListSkeleton() {
  return (
    <div className="remove-scrollbar flex w-full max-w-xl flex-col gap-5">
      {[150, 200, 100, 120, 170].map((height, i) => {
        return (
          <Skeleton
            key={i}
            className={`w-full rounded-xl border p-4`}
            style={{ height: `${height}px`, animationDelay: `${i}00ms` }}
          />
        );
      })}
    </div>
  );
}
