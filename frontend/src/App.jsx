import React, { useState } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState("Waiting for handshake...")

  const testConnection = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/test');
      const data = await response.json();
      setStatus(data.message);
    } catch (error) {
      setStatus("Error: Could not connect to the backend.");
      console.error(error);
    }
  }

  return (
    <div className="App">
      <h1>WerkFlow</h1>
      <p>The Job Search, Centralised.</p>
      
      {/* This is where our Kanban board will live soon! */}
      <div className="board-placeholder">
        [ Kanban Board Coming Soon ]
      </div>


      <p>Status: <strong>{status}</strong></p>
      <button onClick={testConnection}>Test Handshake</button>
    </div>
  )
}

export default App