import React from 'react';

const JobModal = ({ selectedJob, setSelectedJob }) => {
  if (!selectedJob) return null;

  return (
    <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={() => setSelectedJob(null)}>&times;</button>
        <h2>{selectedJob.title}</h2>
        <p><strong>Company:</strong> {selectedJob.company?.display_name || selectedJob.company}</p>
        <p><strong>Location:</strong> {selectedJob.location?.display_name || selectedJob.location}</p>
        <hr style={{ borderColor: 'var(--border)', margin: '15px 0' }} />
        <p className="modal-description" dangerouslySetInnerHTML={{ __html: selectedJob.description }}></p>
      </div>
    </div>
  );
};

export default JobModal;
