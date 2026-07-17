const express = require('express');
const db = require('../db/init');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

function fieldBelongsToUser(fieldId, userId) {
  return !!db.prepare('SELECT id FROM fields WHERE id = ? AND user_id = ?').get(fieldId, userId);
}

// GET /api/fields/:fieldId/harvest-records
router.get('/:fieldId/harvest-records', (req, res) => {
  if (!fieldBelongsToUser(req.params.fieldId, req.userId)) {
    return res.status(404).json({ error: 'Field not found.' });
  }
  const records = db
    .prepare('SELECT * FROM harvest_records WHERE field_id = ? ORDER BY created_at DESC')
    .all(req.params.fieldId);
  res.json({ records });
});

// POST /api/fields/:fieldId/harvest-records
router.post('/:fieldId/harvest-records', (req, res) => {
  if (!fieldBelongsToUser(req.params.fieldId, req.userId)) {
    return res.status(404).json({ error: 'Field not found.' });
  }
  const { harvest_date, crop_age_days, brix_value, mill_name, parcha_number } = req.body;

  const result = db
    .prepare(
      `INSERT INTO harvest_records
        (field_id, harvest_date, crop_age_days, brix_value, mill_name, parcha_number, crush_logged_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.params.fieldId,
      harvest_date || null,
      crop_age_days || null,
      brix_value || null,
      mill_name || null,
      parcha_number || null,
      harvest_date ? null : null
    );

  const record = db.prepare('SELECT * FROM harvest_records WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ record });
});

// PATCH /api/fields/:fieldId/harvest-records/:id/log-crush - stamp when cane reached the mill
router.patch('/:fieldId/harvest-records/:id/log-crush', (req, res) => {
  if (!fieldBelongsToUser(req.params.fieldId, req.userId)) {
    return res.status(404).json({ error: 'Field not found.' });
  }
  const record = db
    .prepare('SELECT * FROM harvest_records WHERE id = ? AND field_id = ?')
    .get(req.params.id, req.params.fieldId);
  if (!record) return res.status(404).json({ error: 'Harvest record not found.' });

  const crushLoggedAt = new Date().toISOString();
  db.prepare('UPDATE harvest_records SET crush_logged_at = ? WHERE id = ?').run(
    crushLoggedAt,
    record.id
  );

  let hoursToCrush = null;
  if (record.harvest_date) {
    hoursToCrush = Math.round(
      (new Date(crushLoggedAt) - new Date(record.harvest_date)) / (1000 * 60 * 60)
    );
  }

  res.json({
    record: db.prepare('SELECT * FROM harvest_records WHERE id = ?').get(record.id),
    hours_to_crush: hoursToCrush,
    warning: hoursToCrush !== null && hoursToCrush > 24
      ? 'Harvest-to-crush window exceeded 24 hours; expect sucrose degradation.'
      : null,
  });
});

module.exports = router;
