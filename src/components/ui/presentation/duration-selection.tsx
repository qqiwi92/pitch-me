"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { line, curveMonotoneX } from "d3-shape";
import { Slider } from "@/components/ui/slider";
import { useList } from "@/lib/fetchingList";
import { parseAsInteger, useQueryState } from "nuqs";
import { Checkbox } from "@/components/ui/checkbox";

import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "../button";
import { Progress } from "../progress";
import { TextMorph } from "../text-morph";
import { ArrowLeft } from "lucide-react";
import { Separator } from "../separator";
import { getCurrentInterval } from "@/lib/presentingSlideData";

export default function Presentation() {
  const { items: slides, setItems: setSlides } = useList();
  const [index, setIndex] = useQueryState("i", parseAsInteger);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentSeconds, setCurrentSeconds] = useQueryState(
    "s",
    parseAsInteger.withDefault(0),
  );
  const [mode, setMode] = useQueryState("mode");
  const [draggedDot, setDraggedDot] = useState<number | null>(null);
  const totalDuration = useMemo(
    () => slides.reduce((sum, slide) => sum + slide.neededTime, 0),
    [slides],
  );
  useEffect(() => {
    if (index === null) {
      setIndex(-1);
    }
  }, [index, setIndex]);
  const lineGenerator = line<{ x: number; y: number }>()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(curveMonotoneX);

  const dotsPositions = useMemo(() => {
    let cumulative = 0;
    return slides.map((slide) => {
      cumulative += slide.neededTime;
      return {
        x: (cumulative / totalDuration) * 450 + 25,
        y: 100,
      };
    });
    //eslint-disable-next-line
  }, [slides, totalDuration, setSlides]);

  const handleMouseDown = (index: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    // Prevent dragging of first and last dots
    if (index > 0 && index < slides.length - 1) {
      setDraggedDot(index);
    }
  };
  const [presentationSettings, setPresentationSettings] = useQueryState(
    "presentation-settings",
  ); // d = description, l = list, a = auto swiping, z = zen mode
  useEffect(() => {
    if (!presentationSettings) {
      setPresentationSettings("dlaz"); // d = description, l = list, a = auto swiping
    }
  }, []);
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (
        draggedDot !== null &&
        draggedDot > 0 &&
        draggedDot < slides.length - 1
      ) {
        const svgRect = event.currentTarget.getBoundingClientRect();
        const x = Math.max(25, Math.min(475, event.clientX - svgRect.left));
        const newCumulativeTime = ((x - 25) / 450) * totalDuration;

        const newSlides = [...slides];
        const prevCumulativeTime = newSlides
          .slice(0, draggedDot)
          .reduce((sum, slide) => sum + slide.neededTime, 0);
        const nextCumulativeTime = newSlides
          .slice(0, draggedDot + 2)
          .reduce((sum, slide) => sum + slide.neededTime, 0);

        const adjustedCumulativeTime = Math.max(
          prevCumulativeTime + 0.5,
          Math.min(nextCumulativeTime - 0.5, newCumulativeTime),
        );

        newSlides[draggedDot].neededTime =
          adjustedCumulativeTime - prevCumulativeTime;
        newSlides[draggedDot + 1].neededTime =
          nextCumulativeTime - adjustedCumulativeTime;

        setSlides(newSlides);
      }
    },
    //eslint-disable-next-line
    [draggedDot, slides.length, totalDuration],
  );

  const handleMouseUp = () => {
    setDraggedDot(null);
  };

  const handleTotalDurationChange = (newDuration: number[]) => {
    const scaleFactor = newDuration[0] / totalDuration;
    const newSlide = slides.map((slide) => ({
      ...slide,
      neededTime: slide.neededTime * scaleFactor,
    }));
    setSlides(newSlide);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (mode === "running") {
      interval = setInterval(() => {
        setCurrentSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (currentSeconds >= totalDuration * 60) {
      setMode("presenting");
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [mode]);

  const currentIntervalData = getCurrentInterval({ slides, currentSeconds });

  useEffect(() => {
    if (presentationSettings?.includes("a")) {
      setIndex(currentIntervalData?.currentInterval ?? 0);
    }
  }, [setIndex, currentIntervalData?.currentInterval]);
  if (slides.length === 0) {
    setMode("editing");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="mt-4 w-full max-w-2xl">
        {index === -1 ? (
          <div className="z-[100] flex w-full max-w-2xl animate-fadeIn flex-col items-center justify-center rounded-lg border p-3 shadow-lg sm:p-6">
            <h2 className="mb-4 text-center text-2xl font-bold">
              Presentation Timeline
            </h2>
            <div className="text-center">
              <p className="hidden text-sm sm:block">
                (Drag middle dots to adjust individual slide durations)
              </p>
            </div>
            <svg
              width="500"
              height="200"
              viewBox="0 0 500 200"
              className="mx-auto mb-4 hidden sm:block"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <path
                d={lineGenerator(dotsPositions) || ""}
                fill="none"
                stroke="#1f1820"
                strokeWidth="2"
              />
              {dotsPositions.map((dot, index) => (
                <g key={index}>
                  <circle
                    cx={dot.x}
                    cy={dot.y}
                    r="8"
                    fill={
                      draggedDot === index
                        ? "#7cdaff"
                        : index === 0 || index === slides.length - 1
                          ? "gray"
                          : "#ea7eff"
                    }
                    cursor={
                      index === 0 || index === slides.length - 1
                        ? "default"
                        : "pointer"
                    }
                    onMouseDown={handleMouseDown(index)}
                    role={
                      index === 0 || index === slides.length - 1
                        ? "presentation"
                        : "button"
                    }
                    tabIndex={
                      index === 0 || index === slides.length - 1 ? -1 : 0
                    }
                    aria-label={`Slide ${index + 1}, Duration: ${slides[index].neededTime.toFixed(1)} minutes${index === 0 || index === slides.length - 1 ? ", Not adjustable" : ""}`}
                  />
                  <text
                    x={dot.x}
                    y={dot.y - 15}
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    className="select-none"
                  >
                    {slides[index].neededTime.toFixed(1)}m
                  </text>
                  <text
                    x={dot.x}
                    y={dot.y + 20}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    className="select-none"
                  >
                    Slide {index + 1}
                  </text>
                </g>
              ))}
            </svg>

            <div className="mb-4 w-full">
              <label
                htmlFor="duration-slider"
                className="mb-1 block text-sm font-medium"
              >
                Total Duration: {totalDuration.toFixed(1)} minutes
              </label>
              <Slider
                id="duration-slider"
                min={5}
                max={45}
                step={1}
                value={[totalDuration]}
                onValueChange={handleTotalDurationChange}
              />
            </div>
            <div className="w-full">
              <h2 className="mb-4 text-center text-2xl font-bold">
                Other options
              </h2>
              <div className="">
                <div className="mb-2">
                  <h3 className="font-semibold">Display:</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="title-checkbox" checked disabled />
                        <label
                          htmlFor="title-checkbox"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Title
                        </label>
                      </div>
                      <div className="flex cursor-pointer items-center space-x-2">
                        <Checkbox
                          id="description-checkbox"
                          checked={(presentationSettings ?? "").includes("d")}
                          onCheckedChange={() => {
                            if ((presentationSettings ?? "").includes("d")) {
                              setPresentationSettings(
                                (presentationSettings ?? "").replace("d", ""),
                              );
                            } else {
                              setPresentationSettings(
                                (presentationSettings ?? "")
                                  .replace("d", "")
                                  .concat("d"),
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor="description-checkbox"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          description
                        </label>
                      </div>
                      <div className="flex cursor-pointer items-center space-x-2">
                        <Checkbox
                          id="points-checkbox"
                          checked={(presentationSettings ?? "").includes("l")}
                          onCheckedChange={() => {
                            if ((presentationSettings ?? "").includes("l")) {
                              setPresentationSettings(
                                (presentationSettings ?? "").replace("l", ""),
                              );
                            } else {
                              setPresentationSettings(
                                (presentationSettings ?? "")
                                  .replace("l", "")
                                  .concat("l"),
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor="points-checkbox"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          points
                        </label>
                      </div>
                    </div>
                    <div className="mx-auto flex h-24 w-48 flex-col items-center justify-center gap-2 rounded-xl bg-card p-2">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        layout
                        className="mx-auto h-4 w-20 rounded-md bg-foreground/20"
                      ></motion.div>
                      {(presentationSettings ?? "").indexOf("d") !== -1 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          layout
                          className="mx-auto h-5 w-32 rounded-md bg-foreground/15"
                        ></motion.div>
                      )}
                      {(presentationSettings ?? "").indexOf("l") !== -1 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          layout
                          className="flex flex-col gap-1"
                        >
                          <div className="mx-auto h-1 w-20 rounded-md bg-foreground/20"></div>
                          <div className="mx-auto h-1 w-20 rounded-md bg-foreground/20"></div>
                          <div className="mx-auto h-1 w-20 rounded-md bg-foreground/20"></div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <h3 className="font-semibold">Other settings:</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex cursor-pointer items-center space-x-2">
                        <Checkbox
                          id="auto-checkbox"
                          checked={(presentationSettings ?? "").includes("a")}
                          onCheckedChange={() => {
                            if ((presentationSettings ?? "").includes("a")) {
                              setPresentationSettings(
                                (presentationSettings ?? "").replace("a", ""),
                              );
                            } else {
                              setPresentationSettings(
                                (presentationSettings ?? "")
                                  .replace("a", "")
                                  .concat("a"),
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor="auto-checkbox"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          <span className="font-bold">Auto swiping </span>
                          <p className="text-sm text-foreground/75">
                            Enable auto swiping when the time for the current
                            slide&#39;s time is up.
                          </p>
                        </label>
                      </div>
                      <div className="flex cursor-pointer items-center space-x-2">
                        <Checkbox
                          id="zen-checkbox"
                          checked={(presentationSettings ?? "").includes("z")}
                          onCheckedChange={() => {
                            if ((presentationSettings ?? "").includes("z")) {
                              setPresentationSettings(
                                (presentationSettings ?? "").replace("z", ""),
                              );
                            } else {
                              setPresentationSettings(
                                (presentationSettings ?? "")
                                  .replace("z", "")
                                  .concat("z"),
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor="zen-checkbox"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          <span className="font-bold">Zen mode </span>
                          <p className="text-sm text-foreground/75">
                            Dull the interface when presenting
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <Button onClick={() => setIndex(0)}>Start pitching</Button> */}
          </div>
        ) : (
          <div className="">
            <span className="flex items-center justify-between gap-1 px-2 text-foreground/75">
              <span className="flex gap-2">
                {" "}
                Slide:{" "}
                <span className="font-bold text-foreground">
                  <TextMorph>{String((index ?? 0) + 1)}</TextMorph>
                </span>{" "}
              </span>
              {mode === "running" && (
                <span className="flex">
                  <TextMorph>
                    {String(
                      parseFloat(
                        Number(totalDuration - ~~(currentSeconds / 60)).toFixed(
                          2,
                        ),
                      ),
                    )}
                  </TextMorph>
                  .
                  <TextMorph>
                    {String(Math.min(60 - (~~currentSeconds % 60), 59))}
                  </TextMorph>
                </span>
              )}
            </span>
            <div ref={carouselRef} className="relative">
              <Carousel
                index={index ?? 0}
                className="animate-fadeIn"
                onIndexChange={(i) => {
                  if (-1 <= i && i <= slides.length) {
                    setIndex(i);
                  }
                }}
              >
                <CarouselContent className="relative flex w-full max-w-xs items-center justify-start sm:max-w-xl md:max-w-3xl">
                  {slides.map((slide, index) => (
                    <CarouselItem className="h-full flex-grow px-2" key={index}>
                      <div
                        style={{ minHeight: carouselRef.current?.offsetHeight }}
                        key={index}
                        className={`h-full w-full rounded-xl border bg-card transition-all ${mode === "running" ? ((currentIntervalData?.currentInterval ?? 0) > index ? "border-red-400" : (currentIntervalData?.currentInterval ?? 0) < index ? "border-blue-400" : "border-accent") : "border-transparent"} p-3 sm:min-h-[200px]`}
                      >
                        <h4
                          className={`flex flex-col gap-1 font-bold ${((presentationSettings ?? "").includes("l") || (presentationSettings ?? "").includes("d")) && "text-4xl"}`}
                        >
                          {slide.title}
                          <Separator />
                        </h4>
                        {mode === "running" &&
                          index === currentIntervalData?.currentInterval && (
                            <Progress
                              className="my-2"
                              value={Number(
                                currentIntervalData.percentagePassed,
                              )}
                            />
                          )}
                        {currentIntervalData?.currentInterval === index ? (
                          <p>
                            Time left:{" "}
                            {parseFloat(
                              Number(
                                currentIntervalData?.percentagePassed,
                              ).toFixed(0),
                            )}
                            % of {slide.neededTime.toFixed(1)} minutes
                          </p>
                        ) : (
                          <p>Duration: {slide.neededTime.toFixed(1)} minutes</p>
                        )}
                        {(presentationSettings ?? "").includes("d") && (
                          <p className="text-sm text-foreground/75">
                            {slide.richEditor}
                          </p>
                        )}
                        {(presentationSettings ?? "").includes("l") && (
                          <ul className="mt-2 list-disc pl-5">
                            {slide.bulletPoints.map((point) => (
                              <li key={point.id}>{point.text}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselIndicator className="translate-y-5" />
              </Carousel>
              <span
                onClick={() => {
                  if ((index ?? 0) > 0) {
                    setIndex((index ?? 0) - 1);
                  }
                }}
                className={`${(index ?? 0) <= 0 ? "pointer-events-none opacity-0" : "opacity-100"} absolute -left-7 bottom-0 top-0 flex cursor-pointer items-center justify-center rounded-l-xl rounded-r-md border border-transparent text-foreground/50 transition-all hover:border-border hover:bg-card hover:text-foreground`}
              >
                <ArrowLeft />
              </span>
              <span
                onClick={() => {
                  if ((index ?? 0) < slides.length - 1) {
                    setIndex((index ?? 0) + 1);
                  }
                }}
                className={`${(index ?? 0) >= slides.length - 1 ? "pointer-events-none opacity-0" : "opacity-100"} absolute -right-7 bottom-0 top-0 flex cursor-pointer items-center justify-center rounded-l-md rounded-r-xl border border-transparent text-foreground/50 transition-all hover:border-border hover:bg-card hover:text-foreground`}
              >
                <ArrowLeft className="rotate-180" />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
