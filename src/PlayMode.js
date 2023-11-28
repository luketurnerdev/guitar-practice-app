import React, { useState, useEffect } from 'react';
import Metronome from './Metronome';
import { useLocation, useNavigate } from 'react-router-dom';
import './PlayMode.css';

const musicalKeys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const scaleTypes = ["Major", "Minor"];

const PlayMode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const routine = location.state?.routine || JSON.parse(localStorage.getItem('guitarPracticeRoutine')) || [];
  
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentScale, setCurrentScale] = useState("");
  const [scaleFeatureEnabled, setScaleFeatureEnabled] = useState(false);
  const [scaleChangeInterval, setScaleChangeInterval] = useState(60);
  const [scaleTimer, setScaleTimer] = useState(60); // New state for scale timer

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

  useEffect(() => {
    if (scaleFeatureEnabled && routine[currentActivityIndex].name === "Scales Practice") {
      setCurrentScale(generateRandomScale());
      setScaleTimer(scaleChangeInterval); // Reset scale timer

      const scaleInterval = setInterval(() => {
        setCurrentScale(generateRandomScale());
        setScaleTimer(scaleChangeInterval); // Reset scale timer
      }, scaleChangeInterval * 1000);

      return () => clearInterval(scaleInterval);
    }
  }, [scaleFeatureEnabled, currentActivityIndex, routine, scaleChangeInterval]);

  useEffect(() => {
    let scaleTimerInterval;
    if (scaleFeatureEnabled && scaleTimer > 0) {
      scaleTimerInterval = setInterval(() => {
        setScaleTimer(prevTimer => prevTimer - 1);
      }, 1000);
    }

    return () => clearInterval(scaleTimerInterval);
  }, [scaleTimer, scaleFeatureEnabled]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleBack = () => {
    navigate('/');
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const generateRandomScale = () => {
    const randomKey = musicalKeys[Math.floor(Math.random() * musicalKeys.length)];
    const randomType = scaleTypes[Math.floor(Math.random() * scaleTypes.length)];
    return `${randomKey} ${randomType}`;
  };

  return (
    <div className="play-mode-container">
      <h2 className="play-mode-header">Practice Routine</h2>
      {currentActivityIndex < routine.length ? (
        <>
          <p>Now Playing: {routine[currentActivityIndex].name} for {formatTime(timer)}</p>
          <button onClick={toggleTimer} className="play-mode-button">
            {isTimerRunning ? 'Pause' : 'Play'}
          </button>
          {routine[currentActivityIndex].name === "Scales Practice" && (
            <>
              <button onClick={() => setScaleFeatureEnabled(!scaleFeatureEnabled)} className="play-mode-button">
                {scaleFeatureEnabled ? "Disable Random Scales" : "Enable Random Scales"}
              </button>
              {scaleFeatureEnabled && (
                <div>
                  <p>Current Scale: {currentScale} - Time Remaining: {scaleTimer}s</p>
                  <input
                    type="number"
                    value={scaleChangeInterval}
                    onChange={(e) => setScaleChangeInterval(e.target.value)}
                    className="scale-interval-input"
                  />
                  <span> seconds</span>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <p>Finished Routine!</p>
      )}
      <Metronome />
      <button onClick={handleBack} className="play-mode-button">Back to Build Mode</button>
    </div>
  );
};

export default PlayMode;
