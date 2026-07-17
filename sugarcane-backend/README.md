# Sugarcane Irrigation Advisor — Backend

Node.js + Express + SQLite backend for the Sugarcane Irrigation & Cane Management
Assistant. Adds persistent storage, multi-farmer login, and moves the irrigation
scheduling logic server-side.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env and set a real JWT_SECRET (any long random string)
npm start
```

Server runs on `http://localhost:5000` by default (`PORT` in `.env`).
It also serves your existing frontend files (`index.html`, `app.js`, etc.)
from the parent folder, so if you place this `backend/` folder at your repo
root next to `index.html`, visiting `http://localhost:5000` will load your
existing UI with the API available at `/api/*`.

## Folder layout

```
backend/
  server.js               # app entry point
  db/init.js              # SQLite schema + connection
  middleware/auth.js       # JWT verification
  routes/auth.js           # register / login / me
  routes/fields.js         # field CRUD + schedule + irrigation logs
  routes/checklist.js      # growth-stage checklist items
  routes/pests.js          # pest reference data + reports
  routes/harvest.js        # harvest records + mill crush logging
  utils/irrigation.js      # Ikshu-Kedar-style scheduling calculation
  frontend-integration-example.js  # drop-in fetch() wrapper for app.js
```

## API reference

All routes except `/api/auth/register` and `/api/auth/login` and
`/api/pests/reference` require an `Authorization: Bearer <token>` header.

### Auth
| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/api/auth/register` | `{ name, phone, password, preferred_language? }` | Create account, returns token |
| POST | `/api/auth/login` | `{ phone, password }` | Returns token |
| GET | `/api/auth/me` | — | Current user info |

### Fields
| Method | Path | Description |
|---|---|---|
| GET | `/api/fields` | List your fields |
| POST | `/api/fields` | Create a field (`name`, `planting_date` required) |
| GET | `/api/fields/:id` | Get one field |
| PUT | `/api/fields/:id` | Update a field |
| DELETE | `/api/fields/:id` | Delete a field |
| GET | `/api/fields/:id/schedule` | Calculated irrigation schedule |
| GET/POST | `/api/fields/:id/irrigation-logs` | View/add irrigation log entries |

### Checklist
| Method | Path | Description |
|---|---|---|
| GET/POST | `/api/fields/:fieldId/checklist` | View/add checklist items |
| PATCH | `/api/fields/:fieldId/checklist/:itemId` | Mark done / edit |
| DELETE | `/api/fields/:fieldId/checklist/:itemId` | Remove item |

### Pests
| Method | Path | Description |
|---|---|---|
| GET | `/api/pests/reference` | Static pest/disease reference guide |
| GET/POST | `/api/fields/:fieldId/pest-reports` | View/log pest sightings for a field |

### Harvest
| Method | Path | Description |
|---|---|---|
| GET/POST | `/api/fields/:fieldId/harvest-records` | View/add harvest records |
| PATCH | `/api/fields/:fieldId/harvest-records/:id/log-crush` | Stamp mill crush time, returns hours-to-crush warning |

## Notes on the irrigation calculation

`utils/irrigation.js` is a **simplified starting model** based on the general
principles the README of your project already describes (growth stage, soil
type, irrigation method). It is not a verbatim copy of any specific published
Ikshu-Kedar formula — if you have the exact interval tables from IISR
guidelines or your original frontend logic, swap them into that file; the
rest of the API around it won't need to change.

## Security notes before deploying publicly

- Set a strong, random `JWT_SECRET` in `.env` (never commit `.env`).
- Consider rate-limiting `/api/auth/login` to slow brute-force attempts.
- SQLite is fine for a single-server deployment; migrate to Postgres if you
  expect concurrent writes at scale.
