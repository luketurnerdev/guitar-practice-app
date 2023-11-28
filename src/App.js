import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BuildMode from './BuildMode';
import PlayMode from './PlayMode';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BuildMode />} />
        <Route path="/playmode" element={<PlayMode />} />
      </Routes>
    </Router>
  );
};

export default App;
