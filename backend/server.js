const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('WerkFlow Server is Running!');
});

// Testing Handshake
app.get('/api/test', (req, res) => {
  res.json({ message: "Handshake successful" });
});

// The Adzuna Pipeline
app.get('/api/jobs', async (req, res) => {
  try {
    // Get keys from .env
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_API_KEY;

    // Build URL (Hardcoded to "Software" for now)
    const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=5&what=software`;

    // Backend fetches data
    const response = await fetch(adzunaUrl);
    const data = await response.json();

    // Send data back
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server caught on fire trying to fetch jobs." });
  }
});




app.listen(PORT, () => {
  console.log(`Server is purring on http://localhost:${PORT}`);
});