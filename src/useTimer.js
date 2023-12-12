import { useState, useEffect } from 'react';

const useTimer = (onTimerComplete) => {
  const [timer, setTimer] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      onTimerComplete();
      setIsTimerRunning(false);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timer, onTimerComplete]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  return { timer, isTimerRunning, toggleTimer, setTimer };
};

export default useTimer;
