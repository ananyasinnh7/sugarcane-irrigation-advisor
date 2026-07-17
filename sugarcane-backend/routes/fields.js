const express = require('express');
const db = require('../db/init');
const { requireAuth } = require('../middleware/auth');
const { calculateIrrigationSchedule } = require('../utils/irrigation');

const router = express.Router();
router.use(requireAuth);

// Helper: make sure a field belongs to the logged-in user
function getOwnedField(fieldId, userId) {
  return db.prepare('SELECT * FROM fields WHERE id = ? AND user_id = ?').get(fieldId, userId);
}

// GET /api/fields - list all fields for the logged in user
router.get('/', (req, res) => {
  const fields = db
    .prepare('SELECT * FROM fields WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.userId);
  res.json({ fields });
});

// POST /api/fields - create a new field/plot
router.post('/', (req, res) => {
  const {
    name,
    area_acres,
    soil_type,
    irrigation_method,
    variety,
    planting_date,
    last_irrigation_date,
  } = req.body;

  if (!name || !planting_date) {
    return res.status(400).json({ error: 'name and planting_date are required.' });
  }

  const result = db
    .prepare(
      `INSERT INTO fields
        (user_id, name, area_acres, soil_type, irrigation_method, variety, planting_date, last_irrigation_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.userId,
      name,
      area_acres || null,
      soil_type || null,
      irrigation_method || null,
      variety || null,
      planting_date,
      last_irrigation_date || null
    );

  const field = getOwnedField(result.lastInsertRowid, req.userId);
  res.status(201).json({ field });
});

// GET /api/fields/:id - get one field
router.get('/:id', (req, res) => {
  const field = getOwnedField(req.params.id, req.userId);
  if (!field) return res.status(404).json({ error: 'Field not found.' });
  res.json({ field });
});

// PUT /api/fields/:id - update a field
router.put('/:id', (req, res) => {
  const field = getOwnedField(req.params.id, req.userId);
  if (!field) return res.status(404).json({ error: 'Field not found.' });

  const merged = { ...field, ...req.body };
  db.prepare(
    `UPDATE fields SET name = ?, area_acres = ?, soil_type = ?, irrigation_method = ?,
      variety = ?, planting_date = ?, last_irrigation_date = ? WHERE id = ?`
  ).run(
    merged.name,
    merged.area_acres,
    merged.soil_type,
    merged.irrigation_method,
    merged.variety,
    merged.planting_date,
    merged.last_irrigation_date,
    field.id
  );

  res.json({ field: getOwnedField(field.id, req.userId) });
});

// DELETE /api/fields/:id
router.delete('/:id', (req, res) => {
  const field = getOwnedField(req.params.id, req.userId);
  if (!field) return res.status(404).json({ error: 'Field not found.' });

  db.prepare('DELETE FROM fields WHERE id = ?').run(field.id);
  res.json({ success: true });
});

// GET /api/fields/:id/schedule - compute the Ikshu-Kedar irrigation schedule
router.get('/:id/schedule', (req, res) => {
  const field = getOwnedField(req.params.id, req.userId);
  if (!field) return res.status(404).json({ error: 'Field not found.' });

  const schedule = calculateIrrigationSchedule({
    plantingDate: field.planting_date,
    lastIrrigationDate: field.last_irrigation_date,
    soilType: field.soil_type,
    irrigationMethod: field.irrigation_method,
  });

  res.json({ field_id: field.id, schedule });
});

// POST /api/fields/:id/irrigation-logs - log an irrigation event
router.post('/:id/irrigation-logs', (req, res) => {
  const field = getOwnedField(req.params.id, req.userId);
  if (!field) return res.status(404).json({ error: 'Field not found.' });

  const { irrigation_date, method, notes } = req.body;
  if (!irrigation_date) {
    return res.status(400).json({ error: 'irrigation_date is required.' });
  }

  db.prepare(
    'INSERT INTO irrigation_logs (field_id, irrigation_date, method, notes) VALUES (?, ?, ?, ?)'
  ).run(field.id, irrigation_date, method || field.irrigation_method, notes || null);

  // Keep the field's last_irrigation_date in sync
  db.prepare('UPDATE fields SET last_irrigation_date = ? WHERE id = ?').run(
    irrigation_date,
    field.id
  );

  const logs = db
    .prepare('SELECT * FROM irrigation_logs WHERE field_id = ? ORDER BY irrigation_date DESC')
    .all(field.id);
  res.status(201).json({ logs });
});

// GET /api/fields/:id/irrigation-logs
router.get('/:id/irrigation-logs', (req, res) => {
  const field = getOwnedField(req.params.id, req.userId);
  if (!field) return res.status(404).json({ error: 'Field not found.' });

  const logs = db
    .prepare('SELECT * FROM irrigation_logs WHERE field_id = ? ORDER BY irrigation_date DESC')
    .all(field.id);
  res.json({ logs });
});

module.exports = router;
