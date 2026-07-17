/**
 * EXAMPLE: How to connect your existing frontend (app.js) to this backend.
 *
 * Drop something like this near the top of your app.js, then replace your
 * current localStorage-only logic with calls to these functions wherever
 * you save/load field data, schedules, checklists, pest reports, etc.
 *
 * If you serve the frontend from the same Express app (default setup),
 * API_BASE can just be '' (relative paths). If you run the frontend
 * separately (e.g. Live Server on a different port), set API_BASE to
 * something like 'http://localhost:5000'.
 */

const API_BASE = ''; // e.g. 'http://localhost:5000' if frontend is served separately

function getToken() {
  return localStorage.getItem('authToken');
}

async function apiRequest(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ---- Auth ----
async function registerFarmer(name, phone, password, preferredLanguage = 'en') {
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: { name, phone, password, preferred_language: preferredLanguage },
  });
  localStorage.setItem('authToken', data.token);
  return data.user;
}

async function loginFarmer(phone, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: { phone, password },
  });
  localStorage.setItem('authToken', data.token);
  return data.user;
}

function logoutFarmer() {
  localStorage.removeItem('authToken');
}

// ---- Fields ----
async function listFields() {
  const data = await apiRequest('/fields');
  return data.fields;
}

async function createField(fieldData) {
  const data = await apiRequest('/fields', { method: 'POST', body: fieldData });
  return data.field;
}

async function getIrrigationSchedule(fieldId) {
  const data = await apiRequest(`/fields/${fieldId}/schedule`);
  return data.schedule;
}

async function logIrrigation(fieldId, irrigationDate, method, notes) {
  const data = await apiRequest(`/fields/${fieldId}/irrigation-logs`, {
    method: 'POST',
    body: { irrigation_date: irrigationDate, method, notes },
  });
  return data.logs;
}

// ---- Checklist ----
async function getChecklist(fieldId) {
  const data = await apiRequest(`/fields/${fieldId}/checklist`);
  return data.items;
}

async function toggleChecklistItem(fieldId, itemId, done) {
  const data = await apiRequest(`/fields/${fieldId}/checklist/${itemId}`, {
    method: 'PATCH',
    body: { done },
  });
  return data.item;
}

// ---- Pests ----
async function getPestReference() {
  const data = await apiRequest('/pests/reference');
  return data.pests;
}

async function reportPest(fieldId, pestData) {
  const data = await apiRequest(`/fields/${fieldId}/pest-reports`, {
    method: 'POST',
    body: pestData,
  });
  return data.report;
}

// ---- Harvest ----
async function logHarvest(fieldId, harvestData) {
  const data = await apiRequest(`/fields/${fieldId}/harvest-records`, {
    method: 'POST',
    body: harvestData,
  });
  return data.record;
}

async function logCrushTime(fieldId, recordId) {
  const data = await apiRequest(`/fields/${fieldId}/harvest-records/${recordId}/log-crush`, {
    method: 'PATCH',
  });
  return data;
}

// Example usage:
// (async () => {
//   await loginFarmer('9999999999', 'password123');
//   const field = await createField({
//     name: 'North Plot',
//     planting_date: '2026-03-01',
//     soil_type: 'clay',
//     irrigation_method: 'drip',
//   });
//   const schedule = await getIrrigationSchedule(field.id);
//   console.log(schedule);
// })();
