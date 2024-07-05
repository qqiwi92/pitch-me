"use client";

import { Value } from "@/lib/types";
import DOMPurify from "dompurify";
import { Separator } from "../separator";
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md";

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
  return (
    <div className="remove-scrollbar flex w-full max-w-xl flex-col gap-5">
      {items.map((item, i) => {
        const cleanHtml = DOMPurify.sanitize(item.richEditor, {
          USE_PROFILES: { html: true },
        });

        return (
          <div key={item.title} className="w-full rounded-xl border p-4">
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
            <Separator className="my-3 bg-primary/50" />
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
            <div
              className="prose prose-stone flex flex-col items-center justify-center leading-[0] text-foreground prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: cleanHtml }}
            ></div>
          </div>
        );
      })}
    </div>
  );
}
