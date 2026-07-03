import React from 'react';

const SearchBar = ({ jobTitle, setJobTitle, location, setLocation, region, setRegion, onSearch, loading }) => {
  return (
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
      <select value={region} onChange={(e) => setRegion(e.target.value)} style={{ padding: '12px', borderRadius: '8px', background: 'var(--code-bg)', color: 'var(--text)', border: '1px solid var(--border)', fontSize: '16px' }}>
        <option value="us">USA</option>
        <option value="gb">UK</option>
        <option value="de">Germany</option>
      </select>
      <button className="search-btn" onClick={onSearch} disabled={loading}>
        {loading ? "Searching..." : "Find Jobs"}
      </button>
    </div>
  );
};

export default SearchBar;
