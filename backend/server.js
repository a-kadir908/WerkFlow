const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("SUCCESS: Connected to the MongoDB"))
  .catch(err => console.error("CONNECTION ERROR:", err));

// Basic Route
app.get('/', (req, res) => {
  res.send('WerkFlow Server is Running!');
});

// Testing Handshake
app.get('/api/test', (req, res) => {
  res.json({ message: "Handshake successful" });
});

// Adzuna Pipeline
// Cache to stop spamming adzuna
let jobCache = {}; 
const CACHE_LIFESPAN = 5 * 60 * 1000; 

app.get('/api/jobs', async (req, res) => {
  try {
    // Read frontend requests or use default values if left blank
    const searchWhat = req.query.what || 'developer';
    const searchWhere = req.query.where || 'london';
    
    // Create a unique label for this specific search
    const cacheKey = `${searchWhat}-${searchWhere}`.toLowerCase();
    const now = Date.now();

    // Check cache for this specific search
    const cachedFolder = jobCache[cacheKey];
    if (cachedFolder && (now - cachedFolder.timestamp < CACHE_LIFESPAN)) {
      console.log(`Serving [${cacheKey}] instantly from Cache!`);
      return res.json(cachedFolder.data); 
    }

    // If not found, go to Adzuna with the dynamic variables
    console.log(`Fetching [${cacheKey}] from Adzuna...`);
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_API_KEY;
    
    //${searchWhat} and ${searchWhere} injected into the URL
    const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=5&what=${searchWhat}&where=${searchWhere}`;

    const response = await fetch(adzunaUrl);
    const data = await response.json();

    // save to cache
    jobCache[cacheKey] = {
      timestamp: now,
      data: data
    };

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server caught on fire trying to fetch jobs." });
  }
});




app.listen(PORT, () => {
  console.log(`Server is purring on http://localhost:${PORT}`);
});