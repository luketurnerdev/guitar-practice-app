import React from 'react';

const ScaleSelector = ({ selectedScales, setSelectedScales, scaleImages }) => {
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
    setSelectedScales([]);
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

export default ScaleSelector;
