"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { line, curveMonotoneX } from "d3-shape";
import { Slider } from "@/components/ui/slider";
import { useList } from "@/lib/fetchingList";
import { parseAsInteger, useQueryState } from "nuqs";
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

export default function Presentation() {
  const { items: slides, setItems: setSlides } = useList();
  const [index, setIndex] = useQueryState("i", parseAsInteger);
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
  }, [mode, totalDuration, currentSeconds]);
  const getCurrentInterval = () => {
    const currentTimeInSeconds = currentSeconds;

    const intervalInSeconds = slides.reduce(
      (accumulator: number[], slide, index) => {
        const currentTimeInSeconds = slide.neededTime * 60; // Convert minutes to seconds
        const cumulativeTime =
          (accumulator[index - 1] || 0) + currentTimeInSeconds; // Sum with the previous time
        accumulator.push(cumulativeTime); // Add the cumulative time to the array
        return accumulator; // Return the updated accumulator
      },
      [],
    );

    for (let i = 0; i < intervalInSeconds.length; i++) {
      const start = i === 0 ? 0 : intervalInSeconds[i - 1];
      const end = intervalInSeconds[i];

      if (currentTimeInSeconds >= start && currentTimeInSeconds < end) {
        const intervalPassed = currentTimeInSeconds - start;
        const totalInterval = end - start;
        const percentagePassed = (intervalPassed / totalInterval) * 100;

        return {
          currentInterval: i,
          percentagePassed: percentagePassed.toFixed(2),
        };
      }
    }
    return null;
  };
  const currentIntervalData = getCurrentInterval();
  useEffect(() => {
    setIndex(currentIntervalData?.currentInterval ?? 0);
  }, [currentIntervalData?.currentInterval, setIndex]);
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

            <Button onClick={() => setIndex(0)}>Start pitching</Button>
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
                    {String(totalDuration - ~~(currentSeconds / 60))}
                  </TextMorph>
                  .<TextMorph>{String(60 - ~~(currentSeconds % 60))}</TextMorph>
                </span>
              )}
            </span>
            <div className="relative">
              <Carousel
                index={index ?? 0}
                className="animate-fadeIn"
                onIndexChange={(i) => {
                  if (-1 <= i && i <= slides.length) {
                    setIndex(i);
                  }
                }}
              >
                <CarouselContent className="relative h-full w-full max-w-xs sm:max-w-xl md:max-w-3xl">
                  {slides.map((slide, index) => (
                    <CarouselItem className="h-full px-2" key={index}>
                      <div
                        key={index}
                        className={`min-h-[300px] w-full rounded-xl border bg-card transition-all ${mode === "running" ? ((currentIntervalData?.currentInterval ?? 0) > index ? "border-red-400" : (currentIntervalData?.currentInterval ?? 0) < index ? "border-blue-400" : "border-accent") : "border-transparent"} p-3 sm:min-h-[200px]`}
                      >
                        <h4 className="font-bold">{slide.title}</h4>
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
                        <p className="text-sm text-gray-600">
                          {slide.richEditor}
                        </p>
                        <ul className="mt-2 list-disc pl-5">
                          {slide.bulletPoints.map((point) => (
                            <li key={point.id}>{point.text}</li>
                          ))}
                        </ul>
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
