require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const fieldsRoutes = require('./routes/fields');
const checklistRoutes = require('./routes/checklist');
const pestsRoutes = require('./routes/pests');
const harvestRoutes = require('./routes/harvest');

if (!process.env.JWT_SECRET) {
  console.warn(
    '\n⚠️  WARNING: JWT_SECRET is not set. Copy .env.example to .env and set a real secret before deploying.\n'
  );
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/fields', fieldsRoutes);
app.use('/api/fields', checklistRoutes); // adds /:fieldId/checklist under /api/fields
app.use('/api/fields', pestsRoutes); // adds /:fieldId/pest-reports under /api/fields
app.use('/api/fields', harvestRoutes); // adds /:fieldId/harvest-records under /api/fields
app.use('/api/pests', pestsRoutes); // adds /reference at /api/pests/reference

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Serve the existing static frontend (index.html, app.js, style.css, etc.)
// Place this backend folder inside your repo root; the ../ below assumes
// backend/ sits next to index.html. Adjust the path if your layout differs.
const frontendPath = path.join(__dirname, '..');
app.use(express.static(frontendPath));

app.listen(PORT, () => {
  console.log(`🌾 Sugarcane Irrigation Advisor API running on http://localhost:${PORT}`);
});
