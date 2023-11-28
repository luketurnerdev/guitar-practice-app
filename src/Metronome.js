import React, { useState, useEffect } from 'react';
import clickSound from './click.wav';

const Metronome = () => {
  const [bpm, setBpm] = useState(60);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [audioBuffer, setAudioBuffer] = useState(null);

  // Load the audio sample
  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    fetch(clickSound)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(decodedAudio => setAudioBuffer(decodedAudio));
  }, []);

  // Function to play the click sound
  const playClick = () => {
    if (audioBuffer) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const sampleSource = audioContext.createBufferSource();
      sampleSource.buffer = audioBuffer;
      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume / 100;
      sampleSource.connect(gainNode);
      gainNode.connect(audioContext.destination);
      sampleSource.start();
    }
  };

  useEffect(() => {
    if (playing) {
      const interval = setInterval(() => {
        playClick();
      }, (60 / bpm) * 1000);
      return () => clearInterval(interval);
    }
  }, [playing, bpm, volume, audioBuffer]);

  const handleBpmChange = (e) => setBpm(e.target.value);
  const handleVolumeChange = (e) => setVolume(e.target.value);
  const togglePlay = () => setPlaying(!playing);

  return (
    <div className="metronome">
      <div>BPM: {bpm}</div>
      <input
        type="range"
        min="40"
        max="200"
        value={bpm}
        onChange={handleBpmChange}
      />
      <div>Volume: {volume}%</div>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
      />
      <button onClick={togglePlay}>
        {playing ? 'Stop' : 'Start'}
      </button>
    </div>
  );
};

export default Metronome;
