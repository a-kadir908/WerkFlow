import React from 'react';
import JobCard from './JobCard';

const SearchResults = ({ searchResults, currentPage, totalPages, setCurrentPage, region, getCurrencySymbol, setSelectedJob, handleSaveJob, error }) => {
  if (error) {
    return (
      <section className="search-section">
        <h2>Error</h2>
        <p style={{ color: '#d32f2f' }}>{error}</p>
      </section>
    );
  }

  if (searchResults.length === 0) return null;

  return (
    <section className="search-section">
      <h2>Live Adzuna Results</h2>
      <div className="job-list search-list">
        {searchResults.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            mode="search"
            currency={getCurrencySymbol(region)}
            onClick={() => setSelectedJob(job)}
            onSave={handleSaveJob}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(currentPage + 1)} 
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
      <hr />
    </section>
  );
};

export default SearchResults;
