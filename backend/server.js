// ==========================================
// IMPORTS & SETUP
// ==========================================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Job = require('./models/Job');

const app = express();
const PORT = process.env.PORT || 3000;


// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors());
app.use(express.json());


// ==========================================
// DATABASE CONNECTION
// ==========================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("SUCCESS: Connected to the MongoDB"))
  .catch(err => console.error("CONNECTION ERROR:", err));


// ==========================================
// ROUTES
// ==========================================

// --- Basic Server Health ---
app.get('/', (req, res) => {
  res.send('WerkFlow Server is Running!');
});

app.get('/api/test', (req, res) => {
  res.json({ message: "Handshake successful" });
});

// --- MongoDB (Saved Jobs) ---

// POST: Save a new job 
app.post('/api/saved-jobs', async (req, res) => {
  try {
    const jobData = req.body;
    const newJob = new Job(jobData);
    await newJob.save();

    res.status(201).json({ message: "Job saved to Vault!", job: newJob });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Job is already in your wishlist!" });
    }
    console.error(error);
    res.status(500).json({ message: "Error saving job to database" });
  }
});

// GET: Retrieve all saved jobs
app.get('/api/saved-jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ dateSaved: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching saved jobs" });
  }
});

// DELETE: Remove a job
app.delete('/api/saved-jobs/:id', async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting job" });
  }
});

// --- Adzuna API Pipeline (Live Search) ---
let jobCache = {};
const CACHE_LIFESPAN = 5 * 60 * 1000;

app.get('/api/jobs', async (req, res) => {
  try {
    const searchWhat = req.query.what || 'developer';
    const searchWhere = req.query.where || 'london';

    const cacheKey = `${searchWhat}-${searchWhere}`.toLowerCase();
    const now = Date.now();

    if (jobCache[cacheKey] && (now - jobCache[cacheKey].timestamp < CACHE_LIFESPAN)) {
      console.log(`Serving [${cacheKey}] instantly from Cache!`);
      return res.json(jobCache[cacheKey].data);
    }

    console.log(`Fetching [${cacheKey}] from Adzuna...`);
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_API_KEY;

    const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=5&what=${searchWhat}&where=${searchWhere}`;

    const response = await fetch(adzunaUrl);
    const data = await response.json();

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


// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`Server is purring on http://localhost:${PORT}`);
});