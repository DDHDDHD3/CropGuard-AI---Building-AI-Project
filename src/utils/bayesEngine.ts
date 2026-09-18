import { EnvironmentalParams, BayesCalculation } from '../types';

/**
 * Calculates Bayesian Outbreak Probability using Bayes' Rule and Likelihood Ratios
 * as taught in the University of Helsinki / Reaktor "Building AI" curriculum.
 */
export function computeBayesRisk(params: EnvironmentalParams): BayesCalculation {
  // Baseline disease prior probability across general tropical smallholder conditions
  const baselinePrior = 0.12; // 12% baseline prior probability of foliar disease in field

  // Convert Prior Probability to Prior Odds
  const priorOdds = baselinePrior / (1.0 - baselinePrior);

  // Environmental Likelihood Ratio calculations:
  // Fungal pathogens (e.g. Blight, Rust, Sigatoka) thrive with high humidity (>80%) and moderate-to-warm temperatures (18-28°C)
  let lrHumidity = 1.0;
  if (params.humidity >= 85) {
    lrHumidity = 3.8; // High moisture heavily favors spore germination
  } else if (params.humidity >= 70) {
    lrHumidity = 1.9;
  } else if (params.humidity < 50) {
    lrHumidity = 0.35; // Dry air inhibits fungal sporulation
  }

  let lrTemp = 1.0;
  if (params.temperature >= 18 && params.temperature <= 28) {
    lrTemp = 1.6; // Optimal spore germination temperature window
  } else if (params.temperature > 35 || params.temperature < 12) {
    lrTemp = 0.5; // Thermal stress suppresses many foliar fungi
  }

  let lrRainfall = 1.0;
  if (params.rainfall > 60) {
    lrRainfall = 2.4; // Rain splash distributes spores and causes water-soaking
  } else if (params.rainfall > 25) {
    lrRainfall = 1.4;
  } else if (params.rainfall < 5) {
    lrRainfall = 0.6; // Low rainfall reduces leaf wetness hours
  }

  let lrSoilMoisture = 1.0;
  if (params.soilMoisture > 80) {
    lrSoilMoisture = 1.5; // Waterlogged conditions compromise plant root immune response
  } else if (params.soilMoisture < 25) {
    lrSoilMoisture = 1.3; // Drought stress weakens plant defenses against opportunistic pathogens
  }

  // Aggregate Likelihood Ratio
  const aggregateLikelihoodRatio = Math.max(0.1, Number((lrHumidity * lrTemp * lrRainfall * lrSoilMoisture).toFixed(2)));

  // Bayes Rule: Posterior Odds = Prior Odds * Likelihood Ratio
  const posteriorOdds = priorOdds * aggregateLikelihoodRatio;

  // Convert Posterior Odds back to Posterior Probability: P = Odds / (1 + Odds)
  const posteriorProbability = posteriorOdds / (1.0 + posteriorOdds);

  // Determine categorical alert level
  let riskCategory: 'Low Risk' | 'Guarded' | 'High Alert' | 'Outbreak Imminent' = 'Low Risk';
  const actions: string[] = [];

  if (posteriorProbability > 0.65) {
    riskCategory = 'Outbreak Imminent';
    actions.push('Prophylactic foliar spraying of organic bio-fungicide (Trichoderma or Bacillus) within 24 hours');
    actions.push('Suspend overhead irrigation; clear field drainage trenches to eliminate standing water');
    actions.push('Inspect field corners and lower canopy twice daily for earliest lesion development');
  } else if (posteriorProbability > 0.40) {
    riskCategory = 'High Alert';
    actions.push('Prune congested foliage to boost canopy airflow and speed leaf drying time');
    actions.push('Prepare botanical neem oil emulsion for rapid deployment upon spot detection');
    actions.push('Check soil mulch depth to mitigate pathogen soil splashing');
  } else if (posteriorProbability > 0.20) {
    riskCategory = 'Guarded';
    actions.push('Maintain routine bi-weekly field scouting schedule');
    actions.push('Monitor regional weather forecasts for upcoming precipitation fronts');
  } else {
    riskCategory = 'Low Risk';
    actions.push('Current microclimatic conditions do not favor fungal sporulation');
    actions.push('Continue normal weed management and conservation soil nourishment');
  }

  return {
    priorProbability: baselinePrior,
    priorOdds: Number(priorOdds.toFixed(3)),
    likelihoodRatio: aggregateLikelihoodRatio,
    posteriorOdds: Number(posteriorOdds.toFixed(3)),
    posteriorProbability: Number(posteriorProbability.toFixed(3)),
    riskCategory,
    recommendedActions: actions
  };
}
