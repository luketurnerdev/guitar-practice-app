import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PlayMode.css';

const PlayMode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const routine = location.state?.routine || JSON.parse(localStorage.getItem('guitarPracticeRoutine')) || [];
  
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (currentActivityIndex < routine.length) {
      const activity = routine[currentActivityIndex];
      setTimer(activity.duration * 60); // Convert minutes to seconds
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }
  }, [currentActivityIndex, routine]);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setCurrentActivityIndex(prevIndex => prevIndex + 1);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleBack = () => {
    navigate('/');
  };

  // Function to format time into minutes and seconds
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="play-mode-container">
      <h2 className="play-mode-header">Practice Routine</h2>
      {currentActivityIndex < routine.length ? (
        <>
          <p>Now Playing: {routine[currentActivityIndex].name} for {formatTime(timer)}</p>
          {routine[currentActivityIndex].image && (
            <img src={routine[currentActivityIndex].image} alt={routine[currentActivityIndex].name} style={{ maxWidth: '100%', height: 'auto' }} />
          )}
          <button onClick={toggleTimer} className="play-mode-button">
            {isTimerRunning ? 'Pause' : 'Play'}
          </button>
        </>
      ) : (
        <p>Finished Routine!</p>
      )}
      <button onClick={handleBack} className="play-mode-button">Back to Build Mode</button>
    </div>
  );
};

export default PlayMode;
