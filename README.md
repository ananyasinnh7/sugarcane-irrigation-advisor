# Sugarcane Irrigation & Cane Management Assistant (Ikshu-Kedar Concept)

An advanced web-based digital advisory dashboard developed for sugarcane farmers, inspired by the irrigation scheduling models (like *Ikshu Kedar*) and pest/disease management standards of the **ICAR-Indian Institute of Sugarcane Research (IISR)**.

## 🌟 Features

1. **🌾 Smart Irrigation Scheduler (Ikshu-Kedar)**
   - Calculates exact water schedules based on planting date, last irrigation date, soil type, irrigation method, and current season.
   - Provides tailored recommendations (e.g., trash mulching, skip-row irrigation) to maximize water-use efficiency (WUE).

2. **📈 Cane Growth & Activity Tracker**
   - Track crop development across 4 core growth stages (Germination, Tillering, Grand Growth, Maturity).
   - Dynamic checklists for timely fertilization (NPK schedules), earthing up, propping/wrapping, and irrigation.

3. **🐛 Interactive Pest & Disease Diagnostics**
   - Visual reference guide for major sugarcane threats (e.g., Red Rot, Smut, Early Shoot Borer, Top Borer).
   - Integrated search, filtering, and action plans for biological, chemical, and cultural controls.

4. **🚛 Harvest & Mill Delivery Planner**
   - Calculates harvest maturity indices (based on crop age or Brix values).
   - Logs mill indent slips (Parchas) and monitors the critical harvest-to-crush time window to minimize sucrose degradation.

5. **🔊 Farmer-Centric Accessibility**
   - Full bilingual support (English & Hindi) with instant language toggle.
   - **Text-to-Speech (TTS) Voice Advisor** that reads out key warnings, calculators, and schedules for farmers with varying literacy levels.

## 🛠️ Technology Stack
- **Frontend**: Semantic HTML5, Vanilla JavaScript (ES6 Modules)
- **Styling**: Modern Custom CSS3 (featuring HSL palettes, glassmorphism, fluid responsive grids, and clean CSS transitions)
- **Data Visualization**: Chart.js (for water requirement and crop health curves)
- **Voice Engine**: Web Speech Synthesis API

## 🚀 Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/sugarcane-irrigation-advisor.git
   ```
2. Open `index.html` in any modern web browser, or run a local development server:
   ```bash
   python -m http.server 8000
   ```
   Or use a development server in VS Code (e.g., Live Server).
3. Access the portal at `http://localhost:8000`.

## 📜 References
- *ICAR - Indian Institute of Sugarcane Research (IISR)* crop guidelines.
- Water management standards and crop protection practices recommended for sugarcane cultivation in India.
