import React, { useState } from 'react';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 1. New Memory Boxes for the Search Form
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // 2. Attach the search terms to the URL query string
      const response = await fetch(`http://localhost:3000/api/jobs?what=${jobTitle}&where=${location}`);
      const data = await response.json();
      
      setJobs(data.results || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>WerkFlow</h1>
        
        {/* 3. The New Search Form */}
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Job Title (e.g. React)" 
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Location (e.g. New York)" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button className="search-btn" onClick={fetchJobs} disabled={loading}>
            {loading ? "Searching..." : "Find Jobs"}
          </button>
        </div>
      </header>

      {/* The Kanban Board Layout */}
      <main className="kanban-board">
        
        {/* Column 1: Wishlist */}
        <div className="kanban-column">
          <h2>Wishlist ({jobs.length})</h2>
          <div className="job-list">
            {/* We map through the memory and create a card for every job */}
            {jobs.map((job) => (
              <div key={job.id} className="job-card">
                <h3>{job.title}</h3>
                <p className="company">{job.company.display_name}</p>
                <p className="location">{job.location.display_name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Applied (Empty for now) */}
        <div className="kanban-column">
          <h2>Applied (0)</h2>
          <div className="job-list"></div>
        </div>

        {/* Column 3: Interview (Empty for now) */}
        <div className="kanban-column">
          <h2>Interview (0)</h2>
          <div className="job-list"></div>
        </div>

      </main>
    </div>
  );
}

export default App;