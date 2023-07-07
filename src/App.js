import React from 'react';
import FileUploader from './components/FileUploader';
import ThreeScene from './components/ThreeScene';

function App() {
  return (
    <div>
      <h1>From PDF to 3D</h1>
      <FileUploader />
      <ThreeScene />
    </div>
  );
}

export default App;
