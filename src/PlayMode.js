import React, { useState, useEffect } from 'react';
import Metronome from './Metronome';
import { useLocation, useNavigate } from 'react-router-dom';
import './PlayMode.css';

// Importing images
import CMajor from './scaleImages/C Major.jpg';
import CSharpMajor from './scaleImages/C# Major.jpg';
import DMajor from './scaleImages/D Major.jpg';
import DSharpMajor from './scaleImages/D# Major.jpg';
import EMajor from './scaleImages/E Major.jpg';
import FMajor from './scaleImages/F Major.jpg';
import FSharpMajor from './scaleImages/F# Major.jpg';
import GMajor from './scaleImages/G Major.jpg';
import GSharpMajor from './scaleImages/G# Major.jpg';
import AMajor from './scaleImages/A Major.jpg';
import ASharpMajor from './scaleImages/A# Major.jpg';
import BMajor from './scaleImages/B Major.jpg';
import CMinor from './scaleImages/C Minor.jpg';
import CSharpMinor from './scaleImages/C# Minor.jpg';
import DMinor from './scaleImages/D Minor.jpg';
import DSharpMinor from './scaleImages/D# Minor.jpg';
import EMinor from './scaleImages/E Minor.jpg';
import FMinor from './scaleImages/F Minor.jpg';
import FSharpMinor from './scaleImages/F# Minor.jpg';
import GMinor from './scaleImages/G Minor.jpg';
import GSharpMinor from './scaleImages/G# Minor.jpg';
import AMinor from './scaleImages/A Minor.jpg';
import ASharpMinor from './scaleImages/A# Minor.jpg';
import BMinor from './scaleImages/B Minor.jpg';


// Mapping scale names to imported images
const scaleImages = {
  'C Major': CMajor,
  'C# Major': CSharpMajor,
  'D Major': DMajor,
  'D# Major': DSharpMajor,
  'E Major': EMajor,
  'F Major': FMajor,
  'F# Major': FSharpMajor,
  'G Major': GMajor,
  'G# Major': GSharpMajor,
  'A Major': AMajor,
  'A# Major': ASharpMajor,
  'B Major': BMajor,
  'C Minor': CMinor,
  'C# Minor': CSharpMinor,
  'D Minor': DMinor,
  'D# Minor': DSharpMinor,
  'E Minor': EMinor,
  'F Minor': FMinor,
  'F# Minor': FSharpMinor,
  'G Minor': GMinor,
  'G# Minor': GSharpMinor,
  'A Minor': AMinor,
  'A# Minor': ASharpMinor,
  'B Minor': BMinor
};


const PlayMode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const routine = location.state?.routine || JSON.parse(localStorage.getItem('guitarPracticeRoutine')) || [];

  const musicalKeys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const scaleTypes = ["Major", "Minor"];

  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentScale, setCurrentScale] = useState("");
  const [scaleFeatureEnabled, setScaleFeatureEnabled] = useState(false);
  const [scaleChangeInterval, setScaleChangeInterval] = useState(60);
  const [scaleTimer, setScaleTimer] = useState(60);

  useEffect(() => {
    if (currentActivityIndex < routine.length) {
      const activity = routine[currentActivityIndex];
      setTimer(activity.duration * 60);
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
    if (routine[currentActivityIndex].name === "Scales Practice") {
      setScaleFeatureEnabled(true);
    }
    if (scaleFeatureEnabled && routine[currentActivityIndex].name === "Scales Practice") {
      setCurrentScale(generateRandomScale());
      setScaleTimer(scaleChangeInterval);

      const scaleInterval = setInterval(() => {
        setCurrentScale(generateRandomScale());
        setScaleTimer(scaleChangeInterval);
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

              { scaleFeatureEnabled && <div>
                <p>Current Scale: {currentScale} - Time Remaining: {scaleTimer}s</p>
                <img 
                  src={scaleImages[currentScale]} 
                  alt={currentScale} 
                  className="scale-image" 
                />
              </div>}
              
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
