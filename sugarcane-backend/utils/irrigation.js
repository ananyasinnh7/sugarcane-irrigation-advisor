/**
 * Simplified Ikshu-Kedar style irrigation interval calculator.
 *
 * This is a starting-point model meant to be moved server-side from your
 * existing frontend logic (or refined further). It estimates days between
 * irrigations based on growth stage, soil type, and irrigation method,
 * following the general principles used by ICAR-IISR guidance:
 *  - Germination & tillering need more frequent, lighter irrigation
 *  - Grand growth stage is the most water-demanding
 *  - Maturity stage irrigation is reduced/stopped to boost sucrose content
 *  - Sandy soils drain faster and need shorter intervals than clay soils
 *  - Drip irrigation allows longer, more efficient intervals than flood irrigation
 */

const GROWTH_STAGES = [
  { name: 'Germination', startDay: 0, endDay: 35 },
  { name: 'Tillering', startDay: 36, endDay: 100 },
  { name: 'Grand Growth', startDay: 101, endDay: 270 },
  { name: 'Maturity', startDay: 271, endDay: 365 },
];

const BASE_INTERVAL_DAYS = {
  Germination: 7,
  Tillering: 10,
  'Grand Growth': 8,
  Maturity: 18,
};

const SOIL_FACTOR = {
  sandy: 0.75, // drains fast, irrigate more often
  loamy: 1.0,
  clay: 1.25, // retains water, irrigate less often
};

const METHOD_FACTOR = {
  drip: 1.3, // more efficient, longer intervals
  furrow: 1.0,
  flood: 0.8, // less efficient, shorter intervals needed
  sprinkler: 1.1,
};

function daysBetween(dateA, dateB) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((new Date(dateB) - new Date(dateA)) / msPerDay);
}

function getGrowthStage(cropAgeDays) {
  return (
    GROWTH_STAGES.find((s) => cropAgeDays >= s.startDay && cropAgeDays <= s.endDay) ||
    GROWTH_STAGES[GROWTH_STAGES.length - 1]
  );
}

function calculateIrrigationSchedule({ plantingDate, lastIrrigationDate, soilType, irrigationMethod }) {
  const today = new Date();
  const cropAgeDays = daysBetween(plantingDate, today);
  const stage = getGrowthStage(Math.max(cropAgeDays, 0));

  const soilFactor = SOIL_FACTOR[(soilType || 'loamy').toLowerCase()] || 1.0;
  const methodFactor = METHOD_FACTOR[(irrigationMethod || 'furrow').toLowerCase()] || 1.0;

  const intervalDays = Math.round(
    BASE_INTERVAL_DAYS[stage.name] * soilFactor * methodFactor
  );

  const referenceDate = lastIrrigationDate ? new Date(lastIrrigationDate) : new Date(plantingDate);
  const nextIrrigationDate = new Date(referenceDate);
  nextIrrigationDate.setDate(nextIrrigationDate.getDate() + intervalDays);

  const daysSinceLastIrrigation = lastIrrigationDate ? daysBetween(lastIrrigationDate, today) : null;
  const daysUntilNext = daysBetween(today, nextIrrigationDate);

  const recommendations = [];
  if (stage.name === 'Maturity') {
    recommendations.push(
      'Reduce irrigation frequency to concentrate sugars; avoid irrigation within 2-3 weeks of planned harvest.'
    );
  }
  if ((soilType || '').toLowerCase() === 'sandy') {
    recommendations.push('Consider trash mulching to reduce evaporation losses on sandy soil.');
  }
  if ((irrigationMethod || '').toLowerCase() === 'flood') {
    recommendations.push('Skip-row irrigation can improve water-use efficiency compared to full flooding.');
  }
  if (stage.name === 'Grand Growth') {
    recommendations.push('This is the peak water-demand stage; avoid moisture stress during Grand Growth.');
  }

  return {
    crop_age_days: cropAgeDays,
    growth_stage: stage.name,
    recommended_interval_days: intervalDays,
    days_since_last_irrigation: daysSinceLastIrrigation,
    next_irrigation_date: nextIrrigationDate.toISOString().split('T')[0],
    days_until_next_irrigation: daysUntilNext,
    is_overdue: daysUntilNext < 0,
    recommendations,
  };
}

module.exports = { calculateIrrigationSchedule, GROWTH_STAGES };
