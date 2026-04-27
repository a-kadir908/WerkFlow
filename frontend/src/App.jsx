import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './App.css';

function App() {
  // two lists
  const [searchResults, setSearchResults] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [region, setRegion] = useState('gb');
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getCurrencySymbol = (reg) => {
    switch(reg) {
      case 'us': return '$';
      case 'gb': return '£';
      case 'de': return '€';
      default: return '£';
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/jobs?what=${jobTitle}&where=${location}&region=${region}`);
      const data = await response.json();
      setSearchResults(data.results || []);
      setCurrentPage(1);

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
        console.error("Failed to load jobs:", error);
      }
    };
    loadVault();
  }, []);


  const handleDeleteJob = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/saved-jobs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSavedJobs(prevJobs => prevJobs.filter(job => job._id !== id));
      } else {
        alert("Failed to delete job.");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Server connection error.");
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return; 

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return; 

    const newStatus = destination.droppableId;
    setSavedJobs(prevJobs => 
      prevJobs.map(job => 
        job._id === draggableId ? { ...job, status: newStatus } : job
      )
    );

    try {
      await fetch(`http://localhost:3000/api/saved-jobs/${draggableId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (error) {
      console.error("Failed to update database:", error);
      alert("Failed to save move to database.");
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
        redirect_url: job.redirect_url,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        currency: getCurrencySymbol(region)
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
        alert(data.message);
        setSavedJobs(prevJobs => [data.job, ...prevJobs]);
      } else {
        alert("Error " + data.message);
      }

    } catch (error) {
      console.error("Error saving job:", error);
      alert("Error " + error);
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
            placeholder="Location (e.g. London)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <select value={region} onChange={(e) => setRegion(e.target.value)} style={{ padding: '12px', borderRadius: '8px', background: '#1e1e1e', color: 'white', border: '1px solid #444', fontSize: '16px' }}>
            <option value="us">USA</option>
            <option value="gb">UK</option>
            <option value="de">Germany</option>
          </select>
          <button className="search-btn" onClick={fetchJobs} disabled={loading}>
            {loading ? "Searching..." : "Find Jobs"}
          </button>
        </div>
      </header>

      {/* NEW SECTION: Live Search Results */}
      {searchResults.length > 0 && (
        <section className="search-section">
          <h2>Live Adzuna Results ({searchResults.length} found)</h2>
          <div className="job-list search-list">
            {searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((job) => (
              <div key={job.id} className="job-card" onClick={() => setSelectedJob(job)}>
                <h3>{job.title}</h3>
                <p>{job.company.display_name} - {job.location.display_name}</p>
                <p className="salary">
                  Salary: {job.salary_max || job.salary_min ? `${getCurrencySymbol(region)}${job.salary_max || job.salary_min}` : 'Not provided'}
                </p>
                <button onClick={(e) => { e.stopPropagation(); handleSaveJob(job); }} className="save-btn">
                  Save to Wishlist
                </button>
              </div>
            ))}
          </div>

          {searchResults.length > itemsPerPage && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {Math.ceil(searchResults.length / itemsPerPage)}</span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(searchResults.length / itemsPerPage)))} 
                disabled={currentPage === Math.ceil(searchResults.length / itemsPerPage)}
              >
                Next
              </button>
            </div>
          )}
          <hr />
        </section>
      )}



      {/* The Kanban Board Layout */}
      <main className="kanban-board">
        <DragDropContext onDragEnd={onDragEnd}>
          {['wishlist', 'applied', 'interview'].map((status) => {
            const columnJobs = savedJobs.filter((job) => job.status === status);
            const titles = {
              wishlist: 'Wishlist',
              applied: 'Applied',
              interview: 'Interview'
            };

            return (
              <div key={status} className="kanban-column">
                <h2>{titles[status]} ({columnJobs.length})</h2>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div 
                      className="job-list"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {columnJobs.map((job, index) => (
                        <Draggable key={job._id} draggableId={String(job._id)} index={index}>
                          {(provided) => (
                            <div 
                              className="job-card saved-card"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedJob(job)}
                            >
                              <h3>{job.title}</h3>
                              <p>{job.company} - {job.location}</p>
                              <p className="salary">
                                Salary: {job.salary_max || job.salary_min ? `${job.currency || getCurrencySymbol('gb')}${job.salary_max || job.salary_min}` : 'Not provided'}
                              </p>

                              <button
                                onClick={(e) => { e.stopPropagation(); window.open(job.redirect_url, '_blank'); }}
                                className="apply-btn"
                              >
                                Apply Now
                              </button>

                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteJob(job._id); }}
                                className="delete-btn"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </main>

      {/* Modal */}
      {selectedJob && (
        <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedJob(null)}>&times;</button>
            <h2>{selectedJob.title}</h2>
            <p><strong>Company:</strong> {selectedJob.company?.display_name || selectedJob.company}</p>
            <p><strong>Location:</strong> {selectedJob.location?.display_name || selectedJob.location}</p>
            <hr style={{ borderColor: '#444', margin: '15px 0' }} />
            <p className="modal-description">{selectedJob.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;