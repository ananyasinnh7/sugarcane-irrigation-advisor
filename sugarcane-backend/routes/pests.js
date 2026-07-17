const express = require('express');
const db = require('../db/init');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

function fieldBelongsToUser(fieldId, userId) {
  return !!db.prepare('SELECT id FROM fields WHERE id = ? AND user_id = ?').get(fieldId, userId);
}

// Reference data - could later move to its own table if you want it editable via admin UI
const PEST_REFERENCE = [
  {
    name: 'Red Rot',
    type: 'disease',
    symptoms: 'Reddish discoloration inside the stalk with white patches, foul smell.',
    control: 'Use resistant varieties, avoid waterlogging, remove and destroy infected clumps.',
  },
  {
    name: 'Smut',
    type: 'disease',
    symptoms: 'Black whip-like structure emerging from the growing point.',
    control: 'Rogue out affected clumps early, use disease-free setts, hot water seed treatment.',
  },
  {
    name: 'Early Shoot Borer',
    type: 'pest',
    symptoms: 'Dead heart in young shoots, central shoot can be pulled out easily.',
    control: 'Remove and destroy affected shoots, release Trichogramma, apply recommended insecticide if severe.',
  },
  {
    name: 'Top Borer',
    type: 'pest',
    symptoms: 'Bunchy top appearance, dead heart in the growing point of older canes.',
    control: 'Detrash affected leaves, release egg parasitoids, avoid excess nitrogen.',
  },
];

// GET /api/pests/reference - static reference guide (no field needed)
router.get('/reference', (req, res) => {
  res.json({ pests: PEST_REFERENCE });
});

// GET /api/fields/:fieldId/pest-reports
router.get('/:fieldId/pest-reports', (req, res) => {
  if (!fieldBelongsToUser(req.params.fieldId, req.userId)) {
    return res.status(404).json({ error: 'Field not found.' });
  }
  const reports = db
    .prepare('SELECT * FROM pest_reports WHERE field_id = ? ORDER BY date_observed DESC')
    .all(req.params.fieldId);
  res.json({ reports });
});

// POST /api/fields/:fieldId/pest-reports
router.post('/:fieldId/pest-reports', (req, res) => {
  if (!fieldBelongsToUser(req.params.fieldId, req.userId)) {
    return res.status(404).json({ error: 'Field not found.' });
  }
  const { pest_name, date_observed, severity, action_taken, notes } = req.body;
  if (!pest_name || !date_observed) {
    return res.status(400).json({ error: 'pest_name and date_observed are required.' });
  }
  const result = db
    .prepare(
      `INSERT INTO pest_reports (field_id, pest_name, date_observed, severity, action_taken, notes)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(req.params.fieldId, pest_name, date_observed, severity || null, action_taken || null, notes || null);

  const report = db.prepare('SELECT * FROM pest_reports WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ report });
});

module.exports = router;
