import React, { useState, useEffect } from 'react';
import Metronome from './Metronome';
import { useLocation, useNavigate } from 'react-router-dom';
import './PlayMode.css';

// Importing images
import CMajor from './scaleImages/C Major.jpg';
import CSharpMajor from './scaleImages/CSharp Major.jpg';
import DMajor from './scaleImages/D Major.jpg';
import DSharpMajor from './scaleImages/DSharp Major.jpg';
import EMajor from './scaleImages/E Major.jpg';
import FMajor from './scaleImages/F Major.jpg';
import FSharpMajor from './scaleImages/FSharp Major.jpg';
import GMajor from './scaleImages/G Major.jpg';
import GSharpMajor from './scaleImages/GSharp Major.jpg';
import AMajor from './scaleImages/A Major.jpg';
import ASharpMajor from './scaleImages/ASharp Major.jpg';
import BMajor from './scaleImages/B Major.jpg';
import CMinor from './scaleImages/C Minor.jpg';
import CSharpMinor from './scaleImages/CSharp Minor.jpg';
import DMinor from './scaleImages/D Minor.jpg';
import DSharpMinor from './scaleImages/DSharp Minor.jpg';
import EMinor from './scaleImages/E Minor.jpg';
import FMinor from './scaleImages/F Minor.jpg';
import FSharpMinor from './scaleImages/FSharp Minor.jpg';
import GMinor from './scaleImages/G Minor.jpg';
import GSharpMinor from './scaleImages/GSharp Minor.jpg';
import AMinor from './scaleImages/A Minor.jpg';
import ASharpMinor from './scaleImages/ASharp Minor.jpg';
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
  const [selectedScales, setSelectedScales] = useState([
    // Default to all scales selected
    ...musicalKeys.map(key => `${key} Major`),
    ...musicalKeys.map(key => `${key} Minor`)
  ]);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentScale, setCurrentScale] = useState("");
  const [scaleFeatureEnabled, setScaleFeatureEnabled] = useState(false);
  const [scaleChangeInterval, setScaleChangeInterval] = useState(60);
  const [scaleTimer, setScaleTimer] = useState(60);

  
  useEffect(() => {
    console.log('useeffect 1')
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
    console.log('useeffect 3')

    if (routine[currentActivityIndex]?.name === "Scales Practice") {
      setScaleFeatureEnabled(true);
    }
  }, [])

  useEffect(() => {
    console.log('useeffect 4')
      setCurrentScale(generateRandomScale());
      setScaleTimer(scaleChangeInterval);
  }, [selectedScales])

  useEffect(() => {
    console.log('useeffect 5')

    if (scaleFeatureEnabled && routine[currentActivityIndex].name === "Scales Practice") {
      // setCurrentScale(generateRandomScale());
      setScaleTimer(scaleChangeInterval);

      const scaleInterval = setInterval(() => {
        setCurrentScale(generateRandomScale());
        setScaleTimer(scaleChangeInterval);
      }, scaleChangeInterval * 1000);

      return () => clearInterval(scaleInterval);
    }
  }, [scaleFeatureEnabled, currentActivityIndex, routine, scaleChangeInterval]);

  useEffect(() => {
    console.log('Scale timer tick.')

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

  // Updated toggleScaleFeature function
const toggleScaleFeature = () => {
  if (!scaleFeatureEnabled) {
    startScalesPractice();
  } else {
    setScaleFeatureEnabled(false);
  }
};

// Updated startScalesPractice function
const startScalesPractice = () => {
  if (selectedScales.length === 0) {
    alert("Please select at least one scale");
    return;
  }
  setScaleFeatureEnabled(true);
  // Any additional logic to start scales practice
};
  };

  // Updated toggleScaleFeature function
const toggleScaleFeature = () => {
  if (!scaleFeatureEnabled) {
    startScalesPractice();
  } else {
    setScaleFeatureEnabled(false);
  }
};

// Updated startScalesPractice function
const startScalesPractice = () => {
  if (selectedScales.length === 0) {
    alert("Please select at least one scale");
    return;
  }
  setScaleFeatureEnabled(true);
  // Any additional logic to start scales practice
};

  const handleScaleChangeInterval = (e) => {
    const newInterval = e.target.value;
    setScaleChangeInterval(newInterval === '' ? null : Number(newInterval)); // Default to 60 seconds if input is cleared
  };
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const generateRandomScale = () => {
    console.log('random, optiosn are ', selectedScales)
    if (selectedScales.length === 0) {
      return 'No scale selected';
    }
    const randomScale = selectedScales[Math.floor(Math.random() * selectedScales.length)];
    console.log('randomScale', randomScale)
    return randomScale;
  };

  const ScaleSelector = () => {
    
    const handleScaleSelection = (scale) => {
      if (selectedScales.includes(scale)) {
        setSelectedScales(selectedScales.filter(s => s !== scale));
      } else {
        setSelectedScales([...selectedScales, scale]);
      }
    };
  
    const selectAllScales = () => {
      setSelectedScales(Object.keys(scaleImages));
    };
  
    const deselectAllScales = () => {
      setSelectedScales(["C Major"]);
    };
  
    return (
      <div>

        <div className="scale-selector-buttons">
          <button onClick={selectAllScales} className="scale-selector-button">Select All</button>
          <button onClick={deselectAllScales} className="scale-selector-button">Deselect All</button>
        </div>
        <div className="scale-selector-container">
          {Object.keys(scaleImages).map((scale, index) => (
            <div 
              key={index} 
              className={`scale-checkbox ${selectedScales.includes(scale) ? 'selected' : ''}`}
              onClick={() => handleScaleSelection(scale)}
            >
              {scale}
            </div>
          ))}
        </div>
      </div>
    );
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
      {/* <ScaleSelector /> */}
      <div className="scale-section">
        {routine[currentActivityIndex]?.name === "Scales Practice" && (
          <>
        <button onClick={() => toggleScaleFeature()} className="play-mode-button">
          {scaleFeatureEnabled ? "Disable Random Scales" : "Enable Random Scales"}
        </button>
        
            {scaleFeatureEnabled && (

              <div className="scale-container">
                <p>Current Scale: {currentScale} - Time Remaining: {scaleTimer}s</p>

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