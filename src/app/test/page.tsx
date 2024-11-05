'use client'
import React, { useEffect, useState } from 'react';

const TimerComponent = () => {
  // Example list of intervals in minutes
  const intervalsInMinutes = [0, 7, 9, 11, 20]; // change as needed
  const intervalsInSeconds = intervalsInMinutes.map(min => min * 60); // Convert to seconds

  const [currentSeconds, setCurrentSeconds] = useState(400);

  useEffect(() => {
    // Simulate seconds passing (for demonstration purposes)
    const interval = setInterval(() => {
      setCurrentSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getCurrentIntervalInfo = () => {
    for (let i = 0; i < intervalsInSeconds.length - 1; i++) {
      const start = intervalsInSeconds[i];
      const end = intervalsInSeconds[i + 1];

      if (currentSeconds >= start && currentSeconds < end) {
        const duration = end - start;
        const elapsed = currentSeconds - start;
        const percentagePassed = (elapsed / duration) * 100;

        return {
          currentInterval: `${start / 60} - ${end / 60} minutes`,
          percentagePassed: percentagePassed.toFixed(2), // Format to 2 decimal places
        };
      }
    }

    return null; // If no interval found
  };

  const intervalInfo = getCurrentIntervalInfo();

  return (
    <div className='my-36'>
      <h1>Timer</h1>
      <p>Current time in seconds: {currentSeconds}</p>
      {intervalInfo ? (
        <p>
          Current Interval: {intervalInfo.currentInterval}, Percentage Passed: {intervalInfo.percentagePassed}%
        </p>
      ) : (
        <p>No interval found.</p>
      )}
    </div>
  );
};

export default TimerComponent;
