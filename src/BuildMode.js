// BuildMode.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BuildMode.css';

const predefinedActivities = [
  { name: "Scales Practice", image: "url_to_scales_image.jpg" },
  { name: "Chord Progressions", image: "url_to_chord_progressions_image.jpg" },
  // ... other predefined activities
];

const BuildMode = () => {
  const [routine, setRoutine] = useState(() => {
    const savedRoutine = localStorage.getItem('guitarPracticeRoutine');
    return savedRoutine ? JSON.parse(savedRoutine) : [];
  });

  useEffect(() => {
    localStorage.setItem('guitarPracticeRoutine', JSON.stringify(routine));
  }, [routine]);

  const [selectedActivity, setSelectedActivity] = useState('');
  const [customActivity, setCustomActivity] = useState('');
  const [duration, setDuration] = useState('');

  const addActivity = () => {
    const activityName = selectedActivity || customActivity;
    if (activityName && duration) {
      const activity = predefinedActivities.find(a => a.name === activityName) || { name: activityName, image: null };
      setRoutine([...routine, { ...activity, duration }]);
      setCustomActivity('');
      setSelectedActivity('');
      setDuration('');
    }
  };

  const deleteActivity = (indexToDelete) => {
    setRoutine(routine.filter((_, index) => index !== indexToDelete));
  };

  const handleActivitySelect = (e) => {
    setSelectedActivity(e.target.value);
    setCustomActivity(''); // Clear custom activity when a predefined one is selected
  };

  return (
    <div className="build-mode-container">
      <h2 className="build-mode-header">Build Your Practice Routine</h2>
      <select 
        onChange={handleActivitySelect} 
        value={selectedActivity}
        className="activity-select"
      >
        <option value="">Select a Predefined Activity</option>
        {predefinedActivities.map((activity, index) => (
          <option key={index} value={activity.name}>{activity.name}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Custom Activity"
        onChange={e => setCustomActivity(e.target.value)}
        value={customActivity}
        disabled={selectedActivity}
        className="custom-activity-input"
      />
      <input
        type="number"
        placeholder="Duration (mins)"
        onChange={e => setDuration(e.target.value)}
        value={duration}
        className="duration-input"
      />
      <button onClick={addActivity} className="add-activity-button">Add Activity</button>

      <div className="routine-list">
        {routine.map((item, index) => (
          <div key={index} className="routine-item">
            <span>{item.name}</span> - <span>{item.duration} mins</span>
            <button onClick={() => deleteActivity(index)} className="delete-button">Delete</button>
          </div>
        ))}
      </div>

      <Link to="/playmode" state={{ routine }}>
        <button className='play-mode-button'>Go to Play Mode</button>
      </Link>
    </div>
  );
};

export default BuildMode;
