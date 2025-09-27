import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdvancedDashboard from './pages/AdvancedDashboard';
import NewProject from './pages/NewProject';
import ProjectDetail from './pages/ProjectDetail';
import ProjectAnalysis from './pages/ProjectAnalysis';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AdvancedDashboard />} />
          <Route path="/dashboard" element={<AdvancedDashboard />} />
          <Route path="/projects/new" element={<NewProject />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/projects/:id/analysis" element={<ProjectAnalysis />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
