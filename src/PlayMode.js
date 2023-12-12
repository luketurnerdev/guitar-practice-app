import React, { useState, useEffect } from 'react';
import Metronome from './Metronome';
import { useLocation, useNavigate } from 'react-router-dom';
import ScaleSelector from './ScaleSelector';
import useTimer from './useTimer';
import { scaleImages } from './ScaleImages';
import { formatTime, generateRandomScale } from './utils';
import './PlayMode.css';

const PlayMode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const routine = location.state?.routine || JSON.parse(localStorage.getItem('guitarPracticeRoutine')) || [];

  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [selectedScales, setSelectedScales] = useState([]);
  const [currentScale, setCurrentScale] = useState("");
  const [scaleFeatureEnabled, setScaleFeatureEnabled] = useState(false);
  const [scaleChangeInterval, setScaleChangeInterval] = useState(60);

  const { timer, isTimerRunning, toggleTimer, setTimer } = useTimer(() => setCurrentActivityIndex(prevIndex => prevIndex + 1));

  useEffect(() => {
    if (currentActivityIndex < routine.length) {
      const activity = routine[currentActivityIndex];
      setTimer(activity.duration * 60);
    } else {
      setTimer(null);
    }
  }, [currentActivityIndex, routine, setTimer]);

  useEffect(() => {
    if (scaleFeatureEnabled && routine[currentActivityIndex]?.name === "Scales Practice") {
      setCurrentScale(generateRandomScale(selectedScales));
      const scaleInterval = setInterval(() => {
        setCurrentScale(generateRandomScale(selectedScales));
      }, scaleChangeInterval * 1000);
      return () => clearInterval(scaleInterval);
    }
  }, [scaleFeatureEnabled, currentActivityIndex, routine, selectedScales, scaleChangeInterval]);

  const handleBack = () => navigate('/');

  const toggleScaleFeature = () => {
    if (selectedScales.length === 0) {
      alert("Please select at least one scale");
      return;
    }
    setScaleFeatureEnabled(!scaleFeatureEnabled);
  };

  const handleScaleChangeInterval = (e) => {
    setScaleChangeInterval(e.target.value === '' ? null : Number(e.target.value));
  };

  return (
    <div className="play-mode-container">
      <div className="control-section">
        <h2 className="play-mode-header">Practice Routine</h2>
        {currentActivityIndex < routine.length ? (
          <>
            <p>Now Playing: {routine[currentActivityIndex].name} for {formatTime(timer)}</p>
            <button onClick={toggleTimer} className="play-mode-button">
              {isTimerRunning ? 'Pause' : 'Play'}
            </button>
            <Metronome />
          </>
        ) : (
          <p>Finished Routine!</p>
        )}
      </div>

      <div className="scale-section">
        {routine[currentActivityIndex]?.name === "Scales Practice" && (
          <>
            <button onClick={toggleScaleFeature} className="play-mode-button">
              {scaleFeatureEnabled ? "Disable Random Scales" : "Enable Random Scales"}
            </button>
            <ScaleSelector 
              selectedScales={selectedScales} 
              setSelectedScales={setSelectedScales} 
              scaleImages={scaleImages} 
            />
            {scaleFeatureEnabled && (
              <div className="scale-container">
                <p>Current Scale: {currentScale} - Time Remaining: {formatTime(scaleChangeInterval)}</p>
                <div>
                  <label htmlFor="scale-interval">Change Scale Interval (seconds): </label>
                  <input
                    id="scale-interval"
                    type="number"
                    value={scaleChangeInterval}
                    onChange={handleScaleChangeInterval}
                    className="scale-interval-input"
                  />
                </div>
                <img 
                  src={scaleImages[currentScale]} 
                  alt={currentScale} 
                  className="scale-image" 
                />
              </div>
            )}
          </>
        )}
      </div>

      <button onClick={handleBack} className="play-mode-button">Back to Build Mode</button>
    </div>
  );
};

export default PlayMode;
