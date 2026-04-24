import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // two lists
  const [searchResults, setSearchResults] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/jobs?what=${jobTitle}&where=${location}`);
      const data = await response.json();
      setSearchResults(data.results || []);

    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const loadVault = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/saved-jobs`);
        const data = await response.json();
        setSavedJobs(data);
      } catch (error) {
        console.error("Failed to load vault jobs:", error);
      }
    };
    loadVault();
  }, []);


  const handleDeleteJob = async (id) => {
    try {
      // 1. Send the Delete signal to the backend
      const response = await fetch(`http://localhost:3000/api/saved-jobs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // 2. Instantly remove it from the screen by filtering it out of the savedJobs array
        setSavedJobs(prevJobs => prevJobs.filter(job => job._id !== id));
      } else {
        alert("⚠️ Failed to delete job.");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("❌ Server connection error.");
    }
  };

  const handleSaveJob = async (job) => {
    try {
      // save jobs
      const jobData = {
        adzunaId: String(job.id),
        title: job.title,
        company: job.company.display_name,
        location: job.location.display_name,
        description: job.description,
        redirect_url: job.redirect_url
      };

      // send jobs to the backend 
      const response = await fetch('http://localhost:3000/api/saved-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });

      const data = await response.json();

      // give feedback
      if (response.ok) {
        alert("ok " + data.message);
        setSavedJobs(prevJobs => [data.job, ...prevJobs]);
      } else {
        alert("error " + data.message);
      }

    } catch (error) {
      console.error("Error saving job:", error);
      alert("error " + error);
    }
  };


  return (
    <div className="app-container">
      <header className="header">
        <h1>WerkFlow</h1>

        {/* Search Form */}
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

      {/* NEW SECTION: Live Search Results */}
      {searchResults.length > 0 && (
        <section className="search-section">
          <h2>Live Adzuna Results ({searchResults.length})</h2>
          <div className="job-list search-list">
            {searchResults.map((job) => (
              <div key={job.id} className="job-card">
                <h3>{job.title}</h3>
                <p>{job.company.display_name} - {job.location.display_name}</p>
                <button onClick={() => handleSaveJob(job)} className="save-btn">
                  Save to Wishlist
                </button>
              </div>
            ))}
          </div>
          <hr />
        </section>
      )}



      {/* The Kanban Board Layout */}
      <main className="kanban-board">

        {/* Column 1: Wishlist */}
        <div className="kanban-column">
          <h2>Wishlist ({savedJobs.length})</h2>
          <div className="job-list">

            {savedJobs.filter((job) => job.status === "wishlist").map((job) => (
              <div key={job.id} className="job-card saved-card">
                <h3>{job.title}</h3>
                <p>{job.company} - {job.location}</p>

                <button
                  onClick={() => window.open(job.redirect_url, '_blank')}
                  className="apply-btn"
                >
                  Apply Now
                </button>

                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="delete-btn"
                >
                  Delete
                </button>


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