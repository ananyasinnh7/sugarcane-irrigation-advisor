// app.js - Main client logic and interaction controller

import { TRANSLATIONS, CROP_STAGES, PEST_DISEASE_LIBRARY } from './data.js';

// Application State
const state = {
  lang: 'en',
  plantingDate: null,
  lastIrrDate: null,
  soilType: 'loamy',
  irrMethod: 'furrow',
  season: 'spring',
  
  // Growth tracker
  cropAgeDays: 0,
  currentStageId: 0,
  completedTasks: {}, // Maps stageId_taskIdx to boolean
  
  // Mill logistics
  slips: JSON.parse(localStorage.getItem('sugarcane_slips')) || [],
  
  // Speech Synth
  speaking: false,
  utterance: null
};

// DOM Elements
const elements = {
  // Navigation
  navItems: document.querySelectorAll('.nav-item'),
  sections: document.querySelectorAll('.content-section'),
  
  // Audio Controls
  btnAudioBroadcast: document.getElementById('btn-audio-broadcast'),
  btnAudioStop: document.getElementById('btn-audio-stop'),
  voiceWave: document.getElementById('voice-wave'),
  bulletinText: document.getElementById('dashboard-bulletin-text'),
  
  // Language buttons
  btnLangEn: document.getElementById('btn-lang-en'),
  btnLangHi: document.getElementById('btn-lang-hi'),
  
  // Dashboard Metrics
  dashIrrDays: document.getElementById('dash-irr-days'),
  dashIrrStatusDesc: document.getElementById('dash-irr-status-desc'),
  dashStageName: document.getElementById('dash-stage-name'),
  dashStageAge: document.getElementById('dash-stage-age'),
  dashStageProgress: document.getElementById('dash-stage-progress'),
  
  // Calculator Form
  irrForm: document.getElementById('irrigation-form'),
  inputPlantingDate: document.getElementById('input-planting-date'),
  inputLastIrrDate: document.getElementById('input-last-irr-date'),
  inputSoilType: document.getElementById('input-soil-type'),
  inputIrrMethod: document.getElementById('input-irr-method'),
  inputSeason: document.getElementById('input-season'),
  
  // Calculator Output
  calcDaysVal: document.getElementById('calc-days-val'),
  calcNextDate: document.getElementById('calc-next-date'),
  calcMoisturePct: document.getElementById('calc-moisture-pct'),
  calcWaterDepth: document.getElementById('calc-water-depth'),
  calcStatusCallout: document.getElementById('calc-status-callout'),
  calcStatusDesc: document.getElementById('calc-status-desc'),
  calcAdvisoryTip: document.getElementById('calc-advisory-tip'),
  resultDaysRing: document.getElementById('result-days-ring'),
  
  // Growth Tracker
  trackerCropAge: document.getElementById('tracker-crop-age'),
  timelineIndicator: document.getElementById('timeline-indicator'),
  timelineNodes: document.querySelectorAll('.timeline-node'),
  trackerTasksContainer: document.getElementById('tracker-tasks-container'),
  checklistProgressRatio: document.getElementById('checklist-progress-ratio'),
  checklistProgressBar: document.getElementById('checklist-progress-bar'),
  
  // Diagnostics
  diagSearch: document.getElementById('diag-search'),
  filterPills: document.querySelectorAll('.filter-pill'),
  diagCardsContainer: document.getElementById('diag-cards-container'),
  
  // Mill Planner
  inputBrix: document.getElementById('input-brix'),
  brixPrediction: document.getElementById('brix-prediction'),
  millSlipForm: document.getElementById('mill-slip-form'),
  inputSlipNo: document.getElementById('input-slip-no'),
  inputSlipQty: document.getElementById('input-slip-qty'),
  inputSlipVehicle: document.getElementById('input-slip-vehicle'),
  inputHarvestTime: document.getElementById('input-harvest-time'),
  slipsContainer: document.getElementById('slips-container')
};

// Charts Reference
let soilChart = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initDefaults();
  setupEventListeners();
  updateTranslations();
  renderDiagnostics();
  renderSlips();
  startLogisticsClock();
});

// Set default form values (today and one week ago)
function initDefaults() {
  const todayStr = getFormattedDateString(new Date());
  
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastWeekStr = getFormattedDateString(lastWeek);
  
  elements.inputPlantingDate.value = getFormattedDateString(new Date(new Date().getFullYear() - 0.5, new Date().getMonth(), new Date().getDate())); // ~6 months ago
  elements.inputLastIrrDate.value = lastWeekStr;
  elements.inputHarvestTime.value = todayStr + 'T12:00';
  
  // Initialize values into state
  state.plantingDate = new Date(elements.inputPlantingDate.value);
  state.lastIrrDate = new Date(elements.inputLastIrrDate.value);
  
  // Initial run of calculator
  calculateIrrigation();
}

function getFormattedDateString(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Setup Event Listeners
function setupEventListeners() {
  // Navigation Tab Switching
  elements.navItems.forEach(item => {
    item.addEventListener('click', () => {
      elements.navItems.forEach(nav => nav.classList.remove('active'));
      elements.sections.forEach(sec => sec.classList.remove('active'));
      
      item.classList.add('active');
      const targetSectionId = item.getAttribute('data-target');
      document.getElementById(targetSectionId).classList.add('active');
    });
  });

  // Language buttons
  elements.btnLangEn.addEventListener('click', () => changeLanguage('en'));
  elements.btnLangHi.addEventListener('click', () => changeLanguage('hi'));

  // Audio synthesis triggers
  elements.btnAudioBroadcast.addEventListener('click', () => speakAdvisory());
  elements.btnAudioStop.addEventListener('click', () => stopAdvisory());

  // Calculator Form Submit
  elements.irrForm.addEventListener('submit', (e) => {
    e.preventDefault();
    state.plantingDate = new Date(elements.inputPlantingDate.value);
    state.lastIrrDate = new Date(elements.inputLastIrrDate.value);
    state.soilType = elements.inputSoilType.value;
    state.irrMethod = elements.inputIrrMethod.value;
    state.season = elements.inputSeason.value;
    
    calculateIrrigation();
  });

  // Timeline node click to inspect other stages
  elements.timelineNodes.forEach(node => {
    node.addEventListener('click', () => {
      const selectedStageId = parseInt(node.getAttribute('data-stage'));
      renderTasksForStage(selectedStageId);
    });
  });

  // Diagnostic search
  elements.diagSearch.addEventListener('input', () => renderDiagnostics());

  // Diagnostic filter pills
  elements.filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      elements.filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderDiagnostics();
    });
  });

  // Brix value input listener
  elements.inputBrix.addEventListener('input', () => evaluateBrixMaturity());

  // Mill slip form logger
  elements.millSlipForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const slip = {
      id: elements.inputSlipNo.value.trim(),
      qty: parseFloat(elements.inputSlipQty.value),
      vehicle: elements.inputSlipVehicle.value,
      harvestTime: new Date(elements.inputHarvestTime.value).toISOString()
    };
    
    state.slips.push(slip);
    localStorage.setItem('sugarcane_slips', JSON.stringify(state.slips));
    
    // Clear Form inputs
    elements.inputSlipNo.value = '';
    elements.inputSlipQty.value = '';
    
    renderSlips();
  });
}

// 1. Language Toggle & Translation Engine
function changeLanguage(lang) {
  if (state.lang === lang) return;
  state.lang = lang;
  
  if (lang === 'en') {
    elements.btnLangEn.classList.add('active');
    elements.btnLangHi.classList.remove('active');
  } else {
    elements.btnLangHi.classList.add('active');
    elements.btnLangEn.classList.remove('active');
  }
  
  // Stop reading if current speech is playing
  stopAdvisory();
  
  // Re-translate all keys
  updateTranslations();
  
  // Refresh tasks, diagnostics and calculators to match language
  calculateIrrigation();
  renderDiagnostics();
  renderSlips();
  evaluateBrixMaturity();
}

function updateTranslations() {
  const dict = TRANSLATIONS[state.lang];
  
  // Match elements having ID patterns starting with "txt-"
  Object.keys(dict).forEach(key => {
    const el = document.getElementById(`txt-${key}`);
    if (el) {
      el.textContent = dict[key];
    }
  });

  // Search input placeholder translation
  elements.diagSearch.placeholder = dict.searchPlaceholder;
  
  // Update static text strings in bulletin
  elements.bulletinText.textContent = dict.audioAdvisoryText;
}

// 2. Ikshu-Kedar Irrigation Calculation Logic
function calculateIrrigation() {
  if (!state.lastIrrDate || !state.plantingDate) return;
  
  // Variables mapping soil characteristics (base irrigation intervals)
  let baseInterval = 10; // Loamy default (days)
  let soilMoistureLossPerDay = 10.0; // % per day
  let waterDepth = "75 mm (3.0 inches)";
  
  if (state.soilType === 'sandy') {
    baseInterval = 6;
    soilMoistureLossPerDay = 16.6;
    waterDepth = "50 mm (2.0 inches)";
  } else if (state.soilType === 'clayey') {
    baseInterval = 14;
    soilMoistureLossPerDay = 7.1;
    waterDepth = "85 mm (3.4 inches)";
  }
  
  // Method Efficiency Multiplier
  let methodMultiplier = 1.0;
  if (state.irrMethod === 'furrow') methodMultiplier = 1.1; // Extends interval slightly due to efficiency
  else if (state.irrMethod === 'drip') methodMultiplier = 1.4;   // Highly water efficient
  else if (state.irrMethod === 'sprinkler') methodMultiplier = 1.2;

  // Season Temperature adjustment factor
  let seasonMultiplier = 1.0;
  if (state.season === 'autumn') seasonMultiplier = 1.15; // Cooler, less evapotranspiration
  else if (state.season === 'adsali') seasonMultiplier = 0.9;  // Heavy vegetative canopy requires water

  // Calculate customized irrigation interval in days
  const finalInterval = Math.round(baseInterval * methodMultiplier * seasonMultiplier);
  
  // Next Irrigation Date
  const nextIrrDate = new Date(state.lastIrrDate.getTime());
  nextIrrDate.setDate(nextIrrDate.getDate() + finalInterval);
  
  // Days since last irrigation
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const diffTimeMs = nextIrrDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTimeMs / (1000 * 60 * 60 * 24));
  
  // Estimated current moisture level
  const lastIrrDiffMs = today.getTime() - state.lastIrrDate.getTime();
  const daysSinceLastIrr = Math.floor(lastIrrDiffMs / (1000 * 60 * 60 * 24));
  
  // Moisture starts at 100%, drops by loss value per day, down to minimum of 20%
  const moisturePct = Math.max(15, Math.round(100 - (daysSinceLastIrr * soilMoistureLossPerDay)));

  // Update UI Elements
  elements.calcDaysVal.textContent = Math.abs(daysRemaining);
  const daysTextElement = document.getElementById('txt-daysRemaining');
  const dict = TRANSLATIONS[state.lang];
  
  if (daysRemaining < 0) {
    daysTextElement.textContent = state.lang === 'en' ? 'Days Overdue' : 'दिन विलंब';
    elements.calcDaysVal.style.color = 'var(--color-danger)';
  } else {
    daysTextElement.textContent = dict.daysRemaining;
    elements.calcDaysVal.style.color = 'var(--blue-water)';
  }
  
  elements.calcNextDate.textContent = nextIrrDate.toLocaleDateString(state.lang === 'en' ? 'en-US' : 'hi-IN', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
  elements.calcMoisturePct.textContent = `${moisturePct}%`;
  elements.calcWaterDepth.textContent = waterDepth;
  
  // Circular conic gradient ring update
  const totalDays = finalInterval;
  const progressRatio = Math.max(0, Math.min(1, daysRemaining / totalDays));
  const progressAngle = progressRatio * 360;
  
  let ringColor = 'var(--blue-water)';
  let calloutClass = 'callout-success';
  let statusText = dict.irrSuccess;
  
  if (daysRemaining <= 0) {
    ringColor = 'var(--color-danger)';
    calloutClass = 'callout-danger';
    statusText = dict.irrDanger;
  } else if (daysRemaining <= 3) {
    ringColor = 'var(--color-warning)';
    calloutClass = 'callout-warning';
    statusText = dict.irrWarning;
  }
  
  elements.resultDaysRing.style.background = `radial-gradient(circle, var(--bg-dark) 55%, transparent 58%),
                                              conic-gradient(${ringColor} ${progressAngle}deg, rgba(255, 255, 255, 0.05) 0deg)`;
  elements.resultDaysRing.style.boxShadow = `0 0 20px ${ringColor}2a`;
  
  // Update callout status
  elements.calcStatusCallout.className = `status-callout ${calloutClass}`;
  elements.calcStatusDesc.textContent = statusText;
  
  // Update dashboard summary
  elements.dashIrrDays.textContent = Math.abs(daysRemaining);
  elements.dashIrrDays.style.color = ringColor;
  document.getElementById('dash-irr-days-lbl').textContent = daysRemaining < 0 
    ? (state.lang === 'en' ? 'Overdue' : 'विलंब') 
    : dict.daysRemaining;
  elements.dashIrrStatusDesc.textContent = statusText;
  
  // Generate customized IISR tips
  generateIISRTip();
  
  // Calculate crop age and growth stage
  calculateCropAge();
  
  // Render Soil Moisture depletion chart
  renderSoilChart(daysSinceLastIrr, finalInterval, soilMoistureLossPerDay);
}

// Generate scientific agricultural tips based on selections
function generateIISRTip() {
  const dict = TRANSLATIONS[state.lang];
  let tipText = "";
  
  if (state.lang === 'en') {
    if (state.irrMethod === 'drip') {
      tipText = "IISR standard: Drip irrigation saves up to 40% water and increases cane yield by 15-20%. Ensure lateral pipelines are flushed monthly to prevent salt clogging.";
    } else if (state.soilType === 'sandy') {
      tipText = "Sandy soils have low water holding capacity. IISR recommends applying trash mulching (sugarcane crop residue) at 6-8 tons/ha in inter-rows to reduce soil water evaporation by 30%.";
    } else if (state.irrMethod === 'flooding') {
      tipText = "Flood irrigation incurs heavy tailwater loss. Transition to skip-row furrow irrigation to save 30% of water while maintaining identical yield levels.";
    } else {
      tipText = "Sugarcane critical growth stages for watering are: Formative stage (Tillering) and Grand Growth stage. Keep moisture levels optimal during these phases to prevent stalk count reduction.";
    }
  } else {
    if (state.irrMethod === 'drip') {
      tipText = "IISR मानक: ड्रिप सिंचाई से 40% तक पानी की बचत होती है और उपज में 15-20% की वृद्धि होती है। अवरोध रोकने के लिए महीने में एक बार पाइपों की सफाई अवश्य करें।";
    } else if (state.soilType === 'sandy') {
      tipText = "बलुई मिट्टी में जल धारण क्षमता कम होती है। वाष्पीकरण को 30% कम करने के लिए कतारों के बीच 6-8 टन प्रति हेक्टेयर की दर से गन्ने की सूखी पत्तियों की मल्चिंग करें।";
    } else if (state.irrMethod === 'flooding') {
      tipText = "पारंपरिक बाढ़ सिंचाई में अत्यधिक जल का नुकसान होता है। कतार छोड़ कर सिंचाई विधि (skip-row furrow) अपनाएं जिससे बराबर पैदावार के साथ 30% जल की बचत होती है।";
    } else {
      tipText = "गन्ने के विकास की सबसे संवेदनशील अवस्था कल्ले निकलने और तीव्र विकास की होती है। गन्ने के डंठलों की संख्या बढ़ाने के लिए इस समय नमी बनाए रखना आवश्यक है।";
    }
  }
  
  elements.calcAdvisoryTip.textContent = tipText;
}

// 3. Crop Age & Growth stages progress
function calculateCropAge() {
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const diffTimeMs = today.getTime() - state.plantingDate.getTime();
  const cropAgeDays = Math.max(0, Math.floor(diffTimeMs / (1000 * 60 * 60 * 24)));
  state.cropAgeDays = cropAgeDays;
  
  // Set UI Labels
  elements.trackerCropAge.textContent = `${cropAgeDays} ${state.lang === 'en' ? 'days' : 'दिन'}`;
  elements.dashStageAge.textContent = `${state.lang === 'en' ? 'Age' : 'आयु'}: ${cropAgeDays} ${state.lang === 'en' ? 'days' : 'दिन'}`;
  
  // Determine Stage ID
  let currentStageId = 0;
  if (cropAgeDays > 60 && cropAgeDays <= 130) currentStageId = 1;
  else if (cropAgeDays > 130 && cropAgeDays <= 270) currentStageId = 2;
  else if (cropAgeDays > 270) currentStageId = 3;
  
  state.currentStageId = currentStageId;
  
  // Render timeline progress indicator
  // Widths: Stage 0 (0%), Stage 1 (33.3%), Stage 2 (66.6%), Stage 3 (100%)
  const percentageProgress = (currentStageId / 3) * 100;
  elements.timelineIndicator.style.width = `${percentageProgress}%`;
  
  // Update nodes active state
  elements.timelineNodes.forEach((node, idx) => {
    if (idx <= currentStageId) {
      node.classList.add('active');
    } else {
      node.classList.remove('active');
    }
  });
  
  // Update dashboard current stage details
  const currentStageObj = CROP_STAGES[currentStageId];
  const dict = TRANSLATIONS[state.lang];
  elements.dashStageName.textContent = dict[currentStageObj.nameKey];
  
  // Calculate relative progress inside current stage
  const range = currentStageObj.maxDays - currentStageObj.minDays;
  const elapsed = cropAgeDays - currentStageObj.minDays;
  const stageProgressPct = Math.max(10, Math.min(100, Math.round((elapsed / range) * 100)));
  elements.dashStageProgress.style.width = `${stageProgressPct}%`;
  
  // Render tasks checklist
  renderTasksForStage(currentStageId);
}

// Render Checklists of Agricultural Tasks
function renderTasksForStage(stageId) {
  const stage = CROP_STAGES[stageId];
  elements.trackerTasksContainer.innerHTML = '';
  
  // Highlight currently viewed stage node
  elements.timelineNodes.forEach((node, idx) => {
    if (idx === stageId) {
      node.querySelector('.node-circle').style.transform = 'scale(1.15)';
      node.querySelector('.node-circle').style.borderColor = 'var(--accent-gold)';
    } else {
      node.querySelector('.node-circle').style.transform = 'none';
      node.querySelector('.node-circle').style.borderColor = '';
    }
  });

  const tasksList = stage.tasks[state.lang];
  let completedCount = 0;
  
  tasksList.forEach((taskText, idx) => {
    const taskKey = `${stageId}_${idx}`;
    const isCompleted = !!state.completedTasks[taskKey];
    if (isCompleted) completedCount++;
    
    const li = document.createElement('li');
    li.className = `task-item ${isCompleted ? 'completed' : ''}`;
    li.innerHTML = `
      <div class="task-checkbox">
        <i class="fa-solid fa-check"></i>
      </div>
      <p class="task-text">${taskText}</p>
    `;
    
    // Toggle state on click
    li.addEventListener('click', () => {
      state.completedTasks[taskKey] = !state.completedTasks[taskKey];
      renderTasksForStage(stageId);
    });
    
    elements.trackerTasksContainer.appendChild(li);
  });
  
  // Update Checklist ratios
  elements.checklistProgressRatio.textContent = `${completedCount}/${tasksList.length} ${state.lang === 'en' ? 'Completed' : 'पूर्ण'}`;
  
  const completionPct = tasksList.length ? (completedCount / tasksList.length) * 100 : 0;
  elements.checklistProgressBar.style.width = `${completionPct}%`;
}

// 4. Pest & Disease Diagnostics search & filter
function renderDiagnostics() {
  const searchQuery = elements.diagSearch.value.toLowerCase().trim();
  const filterType = document.querySelector('.filter-pill.active').getAttribute('data-target');
  
  elements.diagCardsContainer.innerHTML = '';
  
  const filteredList = PEST_DISEASE_LIBRARY.filter(item => {
    const matchesSearch = item.name[state.lang].toLowerCase().includes(searchQuery) ||
                          item.name.en.toLowerCase().includes(searchQuery) ||
                          item.name.hi.toLowerCase().includes(searchQuery) ||
                          item.symptoms[state.lang].toLowerCase().includes(searchQuery) ||
                          item.scientificName.toLowerCase().includes(searchQuery);
    
    const matchesFilter = filterType === 'all' || item.type === filterType;
    
    return matchesSearch && matchesFilter;
  });
  
  if (filteredList.length === 0) {
    elements.diagCardsContainer.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-folder-open"></i>
        <p>${state.lang === 'en' ? 'No items match your search.' : 'आपकी खोज से कोई परिणाम नहीं मिला।'}</p>
      </div>
    `;
    return;
  }
  
  filteredList.forEach(item => {
    const card = document.createElement('div');
    card.className = 'glass-card diag-card';
    
    const tagClass = item.type === 'pest' ? 'badge-pest' : 'badge-disease';
    const tagText = TRANSLATIONS[state.lang][item.type === 'pest' ? 'pests' : 'diseases'];
    
    card.innerHTML = `
      <div class="diag-image-container">
        <img src="${item.image}" alt="${item.name[state.lang]}" onerror="this.src='https://images.unsplash.com/photo-1599818811413-5813d11b3bc2?w=400';">
      </div>
      <div class="diag-details">
        <div class="diag-header">
          <div class="diag-title-group">
            <h3>${item.name[state.lang]}</h3>
            <span class="diag-scientific">${item.scientificName}</span>
          </div>
          <span class="badge-tag ${tagClass}">${tagText}</span>
        </div>
        
        <div class="diag-symptoms">
          <strong>${TRANSLATIONS[state.lang].symptoms}</strong>
          ${item.symptoms[state.lang]}
        </div>
        
        <!-- Tabs for Controls -->
        <div class="remedies-tabs">
          <button class="tab-btn active" data-control="bio">${TRANSLATIONS[state.lang].bioControl}</button>
          <button class="tab-btn" data-control="chem">${TRANSLATIONS[state.lang].chemControl}</button>
          <button class="tab-btn" data-control="cultural">${TRANSLATIONS[state.lang].culturalControl}</button>
        </div>
        
        <div class="tab-panes">
          <div class="tab-pane active" id="pane-bio-${item.id}">
            <p>${item.controls.bio[state.lang]}</p>
          </div>
          <div class="tab-pane" id="pane-chem-${item.id}">
            <p>${item.controls.chem[state.lang]}</p>
          </div>
          <div class="tab-pane" id="pane-cultural-${item.id}">
            <p>${item.controls.cultural[state.lang]}</p>
          </div>
        </div>
      </div>
    `;
    
    // Wire up tab button clicks inside this card
    const tabs = card.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        card.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        card.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        
        tab.classList.add('active');
        const controlType = tab.getAttribute('data-control');
        card.querySelector(`#pane-${controlType}-${item.id}`).classList.add('active');
      });
    });
    
    elements.diagCardsContainer.appendChild(card);
  });
}

// 5. Brix juice maturity checker
function evaluateBrixMaturity() {
  const brix = parseFloat(elements.inputBrix.value);
  const dict = TRANSLATIONS[state.lang];
  const textEl = elements.brixPrediction;
  const container = elements.brixPrediction.parentElement.parentElement;
  
  if (isNaN(brix)) {
    textEl.textContent = state.lang === 'en' ? 'Awaiting entry...' : 'प्रविष्टि की प्रतीक्षा है...';
    textEl.style.color = 'var(--text-white)';
    container.style.borderLeft = 'none';
    return;
  }
  
  if (brix >= 18) {
    textEl.textContent = dict.alertBrixHigh;
    textEl.style.color = 'var(--color-success)';
    container.style.borderLeft = '4px solid var(--color-success)';
  } else if (brix >= 16 && brix < 18) {
    textEl.textContent = state.lang === 'en' 
      ? "Moderate Sugar level. Borderline harvest stage. Recovery could improve." 
      : "मध्यम शर्करा स्तर। सीमांत कटाई चरण। रिकवरी में अभी और सुधार हो सकता है।";
    textEl.style.color = 'var(--color-warning)';
    container.style.borderLeft = '4px solid var(--color-warning)';
  } else {
    textEl.textContent = dict.alertBrixLow;
    textEl.style.color = 'var(--color-danger)';
    container.style.borderLeft = '4px solid var(--color-danger)';
  }
}

// 6. Mill slips delivery tracking list
function renderSlips() {
  elements.slipsContainer.innerHTML = '';
  
  if (state.slips.length === 0) {
    elements.slipsContainer.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-truck"></i>
        <p>${state.lang === 'en' ? 'No active delivery tickets logged.' : 'कोई सक्रिय डिलीवरी टिकट दर्ज नहीं है।'}</p>
      </div>
    `;
    return;
  }
  
  state.slips.forEach(slip => {
    const card = document.createElement('div');
    card.className = 'slip-card';
    card.setAttribute('data-id', slip.id);
    
    const dict = TRANSLATIONS[state.lang];
    const vehName = dict[slip.vehicle] || slip.vehicle;
    
    card.innerHTML = `
      <div class="slip-header-row">
        <div class="slip-title">
          <i class="fa-solid fa-ticket"></i>
          <span>${slip.id}</span>
        </div>
        <button class="btn-delete-slip" title="Remove ticket"><i class="fa-solid fa-trash-can"></i></button>
      </div>
      
      <div class="slip-meta-grid">
        <div class="slip-meta-item">
          <span class="lbl">${dict.indentQty}</span>
          <span class="val">${slip.qty} Tons</span>
        </div>
        <div class="slip-meta-item">
          <span class="lbl">${dict.vehicleType}</span>
          <span class="val">${vehName}</span>
        </div>
      </div>
      
      <div class="slip-timer-panel">
        <div class="timer-left">
          <i class="fa-regular fa-clock"></i>
          <span id="timer-val-${slip.id}">--:--:--</span>
        </div>
        <span class="sucrose-badge" id="sucrose-badge-${slip.id}">Excellent</span>
      </div>
    `;
    
    // Bind delete button
    card.querySelector('.btn-delete-slip').addEventListener('click', () => {
      state.slips = state.slips.filter(s => s.id !== slip.id);
      localStorage.setItem('sugarcane_slips', JSON.stringify(state.slips));
      renderSlips();
    });
    
    elements.slipsContainer.appendChild(card);
  });
  
  updateRealtimeClocks();
}

function updateRealtimeClocks() {
  const dict = TRANSLATIONS[state.lang];
  
  state.slips.forEach(slip => {
    const timerValEl = document.getElementById(`timer-val-${slip.id}`);
    const badgeEl = document.getElementById(`sucrose-badge-${slip.id}`);
    if (!timerValEl || !badgeEl) return;
    
    const harvestTime = new Date(slip.harvestTime);
    const now = new Date();
    const elapsedMs = now - harvestTime;
    
    if (elapsedMs < 0) {
      timerValEl.textContent = "Scheduled";
      badgeEl.textContent = dict.excellent;
      badgeEl.className = "sucrose-badge sucrose-excellent";
      return;
    }
    
    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;
    
    timerValEl.innerHTML = `Transit: <strong>${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s</strong>`;
    
    // Evaluate sucrose status
    if (hours < 12) {
      badgeEl.textContent = dict.excellent;
      badgeEl.className = "sucrose-badge sucrose-excellent";
    } else if (hours >= 12 && hours < 24) {
      badgeEl.textContent = dict.moderate;
      badgeEl.className = "sucrose-badge sucrose-moderate";
    } else {
      badgeEl.textContent = dict.critical;
      badgeEl.className = "sucrose-badge sucrose-critical";
    }
  });
}

function startLogisticsClock() {
  setInterval(updateRealtimeClocks, 1000);
}

// 7. Soil Moisture depletion curve chart
function renderSoilChart(daysSinceLast, finalInterval, depletionPerDay) {
  const ctx = document.getElementById('soilMoistureChart').getContext('2d');
  
  // Generate data labels and values representing 15 days trajectory
  const labels = [];
  const moistureValues = [];
  const thresholdValues = []; // 35% critical depletion threshold
  
  const today = new Date();
  
  for (let i = 0; i <= 15; i++) {
    const date = new Date(state.lastIrrDate.getTime());
    date.setDate(date.getDate() + i);
    labels.push(date.toLocaleDateString(state.lang === 'en' ? 'en-US' : 'hi-IN', {
      month: 'short', day: 'numeric'
    }));
    
    // Depletion model calculation
    const val = Math.max(15, Math.round(100 - (i * depletionPerDay)));
    moistureValues.push(val);
    thresholdValues.push(35); // Critical safety line
  }
  
  if (soilChart) {
    soilChart.destroy();
  }
  
  const isEn = state.lang === 'en';
  
  soilChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: isEn ? 'Estimated Soil Moisture (%)' : 'अनुमानित मिट्टी नमी (%)',
          data: moistureValues,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.3,
          pointBackgroundColor: moistureValues.map((val, idx) => idx === daysSinceLast ? '#ef4444' : '#3b82f6'),
          pointRadius: moistureValues.map((val, idx) => idx === daysSinceLast ? 7 : 3),
          pointHoverRadius: 8
        },
        {
          label: isEn ? 'Critical Depletion Threshold (35%)' : 'संवेदनशील न्यूनतम सीमा (35%)',
          data: thresholdValues,
          borderColor: '#ef4444',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#9ca3af',
            font: { family: 'Outfit', size: 12 }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw}%`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#9ca3af', font: { family: 'Outfit' } }
        },
        y: {
          min: 0,
          max: 100,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#9ca3af', font: { family: 'Outfit' } }
        }
      }
    }
  });
}

// 8. Bilingual Text-to-Speech (TTS) Voice Advisor
function speakAdvisory() {
  if (state.speaking) return;
  
  const text = elements.bulletinText.textContent;
  if (!text) return;
  
  if ('speechSynthesis' in window) {
    state.speaking = true;
    elements.btnAudioBroadcast.classList.add('hidden');
    elements.btnAudioStop.classList.remove('hidden');
    elements.voiceWave.classList.remove('hidden');
    
    state.utterance = new SpeechSynthesisUtterance(text);
    
    // Choose correct voice locale
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    
    if (state.lang === 'hi') {
      state.utterance.lang = 'hi-IN';
      // Find a Hindi voice if available
      selectedVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('HI'));
    } else {
      state.utterance.lang = 'en-IN';
      // Find an English-Indian or general English voice
      selectedVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en-US'));
    }
    
    if (selectedVoice) {
      state.utterance.voice = selectedVoice;
    }
    
    state.utterance.rate = 0.9; // Slightly slower reading speed for agricultural clarity
    
    state.utterance.onend = () => resetVoiceUI();
    state.utterance.onerror = () => resetVoiceUI();
    
    window.speechSynthesis.speak(state.utterance);
  } else {
    alert(state.lang === 'en' 
      ? 'Text-to-speech is not supported by your browser.' 
      : 'आपका ब्राउज़र वॉयस असिस्टेंट का समर्थन नहीं करता है।');
  }
}

function stopAdvisory() {
  if (state.speaking && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    resetVoiceUI();
  }
}

function resetVoiceUI() {
  state.speaking = false;
  elements.btnAudioBroadcast.classList.remove('hidden');
  elements.btnAudioStop.classList.add('hidden');
  elements.voiceWave.classList.add('hidden');
  state.utterance = null;
}

// Support loading voices dynamically as browser reads them async
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    // Voices loaded callback (some browsers fetch voices asynchronously)
  };
}
