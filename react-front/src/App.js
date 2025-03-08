import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // Опционально для стилей
import Predict from './pages/Prediction';
import Login from './pages/Login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/predict" element={<Predict />}/>
        <Route path="/" element={<Login />}/>
      </Routes>
    </Router>
  )
}

export default App;