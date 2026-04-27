const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  adzunaId: { 
    type: String, 
    required: true, 
    unique: true // Prevents duplicates
  },
  title: String,
  company: String,
  location: String,
  description: String,
  redirect_url: String,
  salary_min: Number,
  salary_max: Number,
  currency: String,
  status: { 
    type: String, 
    default: 'wishlist'
  },
  dateSaved: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Job', JobSchema);