const express = require('express');
const db = require('../db/init');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

function fieldBelongsToUser(fieldId, userId) {
  return !!db.prepare('SELECT id FROM fields WHERE id = ? AND user_id = ?').get(fieldId, userId);
}

// GET /api/fields/:fieldId/checklist
router.get('/:fieldId/checklist', (req, res) => {
  if (!fieldBelongsToUser(req.params.fieldId, req.userId)) {
    return res.status(404).json({ error: 'Field not found.' });
  }
  const items = db
    .prepare('SELECT * FROM checklist_items WHERE field_id = ? ORDER BY due_date ASC')
    .all(req.params.fieldId);
  res.json({ items });
});

// POST /api/fields/:fieldId/checklist
router.post('/:fieldId/checklist', (req, res) => {
  if (!fieldBelongsToUser(req.params.fieldId, req.userId)) {
    return res.status(404).json({ error: 'Field not found.' });
  }
  const { growth_stage, task, due_date } = req.body;
  if (!growth_stage || !task) {
    return res.status(400).json({ error: 'growth_stage and task are required.' });
  }
  const result = db
    .prepare(
      'INSERT INTO checklist_items (field_id, growth_stage, task, due_date) VALUES (?, ?, ?, ?)'
    )
    .run(req.params.fieldId, growth_stage, task, due_date || null);

  const item = db.prepare('SELECT * FROM checklist_items WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ item });
});

// PATCH /api/fields/:fieldId/checklist/:itemId - toggle done / edit
router.patch('/:fieldId/checklist/:itemId', (req, res) => {
  if (!fieldBelongsToUser(req.params.fieldId, req.userId)) {
    return res.status(404).json({ error: 'Field not found.' });
  }
  const item = db
    .prepare('SELECT * FROM checklist_items WHERE id = ? AND field_id = ?')
    .get(req.params.itemId, req.params.fieldId);
  if (!item) return res.status(404).json({ error: 'Checklist item not found.' });

  const done = req.body.done !== undefined ? (req.body.done ? 1 : 0) : item.done;
  const task = req.body.task || item.task;
  const due_date = req.body.due_date !== undefined ? req.body.due_date : item.due_date;

  db.prepare('UPDATE checklist_items SET done = ?, task = ?, due_date = ? WHERE id = ?').run(
    done,
    task,
    due_date,
    item.id
  );

  res.json({ item: db.prepare('SELECT * FROM checklist_items WHERE id = ?').get(item.id) });
});

// DELETE /api/fields/:fieldId/checklist/:itemId
router.delete('/:fieldId/checklist/:itemId', (req, res) => {
  if (!fieldBelongsToUser(req.params.fieldId, req.userId)) {
    return res.status(404).json({ error: 'Field not found.' });
  }
  db.prepare('DELETE FROM checklist_items WHERE id = ? AND field_id = ?').run(
    req.params.itemId,
    req.params.fieldId
  );
  res.json({ success: true });
});

module.exports = router;
