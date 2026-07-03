import React from 'react';
import SearchBar from './SearchBar';

const Header = ({ jobTitle, setJobTitle, location, setLocation, region, setRegion, onSearch, loading }) => {
  return (
    <header className="header">
      <h1>WerkFlow</h1>
      <SearchBar 
        jobTitle={jobTitle} setJobTitle={setJobTitle}
        location={location} setLocation={setLocation}
        region={region} setRegion={setRegion}
        onSearch={onSearch} loading={loading}
      />
    </header>
  );
};

export default Header;
