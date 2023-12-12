export const formatTime = (totalSeconds) => {
    if (totalSeconds == null) return '0m 0s';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };
  
  export const generateRandomScale = (selectedScales) => {
    if (selectedScales.length === 0) {
      return 'No scale selected';
    }
    return selectedScales[Math.floor(Math.random() * selectedScales.length)];
  };
  