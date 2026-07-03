import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import SearchResults from './components/SearchResults';
import KanbanBoard from './components/KanbanBoard';
import JobModal from './components/JobModal';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Fetch Error State
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [region, setRegion] = useState('gb');
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getCurrencySymbol = (reg) => {
    switch(reg) {
      case 'us': return '$';
      case 'gb': return '£';
      case 'de': return '€';
      default: return '£';
    }
  };

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/jobs?what=${jobTitle}&where=${location}&region=${region}&page=${page}`);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: Failed to fetch jobs.`);
      }
      const data = await response.json();
      setSearchResults(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / 10)); // Total counts from Adzuna divided by results_per_page
      setCurrentPage(page);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError(err.message || "Failed to fetch jobs due to network error.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (currentPage > 1 || searchResults.length > 0) {
      fetchJobs(currentPage);
    }
    // eslint-disable-next-line
  }, [currentPage]);

  useEffect(() => {
    const loadVault = async () => {
      try {
        const response = await fetch(`/api/saved-jobs`);
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
      const response = await fetch(`/api/saved-jobs/${id}`, { method: 'DELETE' });
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
    const previousJobs = [...savedJobs];

    if (source.droppableId === destination.droppableId) {
      if (source.index === destination.index) return;
      const columnJobs = savedJobs.filter(job => job.status === source.droppableId);
      const otherJobs = savedJobs.filter(job => job.status !== source.droppableId);
      
      const [movedJob] = columnJobs.splice(source.index, 1);
      columnJobs.splice(destination.index, 0, movedJob);
      
      setSavedJobs([...otherJobs, ...columnJobs]);
      return; 
    }

    const newStatus = destination.droppableId;
    const destColumnJobs = savedJobs.filter(job => job.status === newStatus);
    const sourceColumnJobs = savedJobs.filter(job => job.status === source.droppableId);
    const otherJobs = savedJobs.filter(job => job.status !== source.droppableId && job.status !== newStatus);
    
    const [movedJob] = sourceColumnJobs.splice(source.index, 1);
    const updatedJob = { ...movedJob, status: newStatus };
    destColumnJobs.splice(destination.index, 0, updatedJob);
    
    setSavedJobs([...otherJobs, ...sourceColumnJobs, ...destColumnJobs]);

    try {
      const response = await fetch(`/api/saved-jobs/${draggableId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update status on server');
    } catch (error) {
      console.error("Failed to update database:", error);
      alert("Failed to save move to database. Reverting state.");
      setSavedJobs(previousJobs);
    }
  };

  const handleSaveJob = async (job) => {
    try {
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

      const response = await fetch('/api/saved-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });

      const data = await response.json();

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
      <Header 
        jobTitle={jobTitle} setJobTitle={setJobTitle}
        location={location} setLocation={setLocation}
        region={region} setRegion={setRegion}
        onSearch={() => fetchJobs(1)} loading={loading}
      />

      <SearchResults 
        searchResults={searchResults}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        region={region}
        getCurrencySymbol={getCurrencySymbol}
        setSelectedJob={setSelectedJob}
        handleSaveJob={handleSaveJob}
        error={error}
      />

      <KanbanBoard 
        savedJobs={savedJobs}
        onDragEnd={onDragEnd}
        setSelectedJob={setSelectedJob}
        handleDeleteJob={handleDeleteJob}
        getCurrencySymbol={getCurrencySymbol}
      />

      <JobModal 
        selectedJob={selectedJob}
        setSelectedJob={setSelectedJob}
      />
    </div>
  );
}

export default App;