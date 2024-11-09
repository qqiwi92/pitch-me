import { Slide } from "./types";

export const getCurrentInterval = ( {slides, currentSeconds}:  { slides: Slide[], currentSeconds: number }) => {
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