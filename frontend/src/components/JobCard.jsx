import React from 'react';

export const formatSalary = (min, max, currency) => {
  if (min && max && min !== max) {
    return `${currency}${min} - ${currency}${max}`;
  } else if (min || max) {
    return `${currency}${min || max}`;
  }
  return 'Not provided';
};

const JobCard = React.forwardRef(({ job, mode, currency, onClick, onSave, onApply, onDelete, ...dragProps }, ref) => {
  const company = job.company?.display_name || job.company;
  const location = job.location?.display_name || job.location;
  
  return (
    <div 
      className={`job-card ${mode === 'kanban' ? 'saved-card' : ''}`}
      ref={ref}
      onClick={onClick}
      {...dragProps}
    >
      <h3>{job.title}</h3>
      <p>{company} - {location}</p>
      <p className="salary">
        Salary: {formatSalary(job.salary_min, job.salary_max, currency)}
      </p>

      {mode === 'search' && (
        <button onClick={(e) => { e.stopPropagation(); onSave(job); }} className="save-btn">
          Save to Wishlist
        </button>
      )}

      {mode === 'kanban' && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onApply(job); }}
            className="apply-btn"
          >
            Apply Now
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(job._id); }}
            className="delete-btn"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
});

export default JobCard;
