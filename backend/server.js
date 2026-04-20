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

app.listen(PORT, () => {
  console.log(`Server is purring on http://localhost:${PORT}`);
});