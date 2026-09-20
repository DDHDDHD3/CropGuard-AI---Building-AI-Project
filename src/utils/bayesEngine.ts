import { EnvironmentalParams, BayesCalculation, BayesFactorContribution, PathogenTarget } from '../types';

/**
 * Advanced Agrometeorological Bayesian Inference Engine
 * 
 * Implements Multi-Evidence Naive Bayes Updating and Odds Calculations
 * conforming to the University of Helsinki / Reaktor "Building AI" curriculum:
 * 
 * Posterior Odds = Prior Odds * LR_Visual * LR_Humidity * LR_Temp * LR_Rainfall * LR_SoilMoisture * LR_Wind
 * Posterior Probability = Posterior Odds / (1 + Posterior Odds)
 */

export function getCropBaselinePrior(cropType: string): number {
  const lower = cropType.toLowerCase();
  if (lower.includes('tomato') || lower.includes('solanaceae')) {
    return 0.22; // High foliar blight & viral susceptibility
  }
  if (lower.includes('potato')) {
    return 0.24; // Classic Phytophthora late blight vulnerability
  }
  if (lower.includes('cassava')) {
    return 0.18; // CMD vector-borne vulnerability
  }
  if (lower.includes('maize') || lower.includes('corn')) {
    return 0.14; // Northern corn leaf blight & rust
  }
  if (lower.includes('banana') || lower.includes('plantain')) {
    return 0.20; // Black Sigatoka
  }
  if (lower.includes('rice') || lower.includes('grain')) {
    return 0.15; // Rice blast & sheath blight
  }
  return 0.12; // Baseline general field prior
}

export function computeBayesRisk(params: EnvironmentalParams): BayesCalculation {
  const pathogen: PathogenTarget = params.pathogenTarget || 'Fungal Blight';

  // 1. Crop baseline prior
  const baselinePrior = getCropBaselinePrior(params.cropType);
  const priorOdds = baselinePrior / (1.0 - baselinePrior);

  const factorBreakdown: BayesFactorContribution[] = [];

  // 2. Visual Diagnostic Evidence (from leaf computer vision scanner)
  let visualLR = 1.0;
  if (params.includeVisualEvidence && params.visualEvidenceConfidence !== undefined) {
    const conf = params.visualEvidenceConfidence;
    const severity = params.visualEvidenceSeverity || 'Moderate';
    
    if (severity === 'Healthy') {
      visualLR = 0.15; // Leaf scan is healthy -> heavily lowers outbreak probability
      factorBreakdown.push({
        factor: 'Leaf Vision Inspection',
        parameterName: 'Visual Pathology Scan',
        observedValue: `Healthy leaf detected (${conf.toFixed(1)}% conf)`,
        likelihoodRatio: visualLR,
        impact: 'decreases',
        explanation: 'Negative lesion scan provides strong evidence against an active pathogen colony.'
      });
    } else {
      // Diagnostic positive likelihood ratio: sensitivity / (1 - specificity)
      if (conf >= 95) visualLR = 8.5;
      else if (conf >= 85) visualLR = 5.2;
      else if (conf >= 70) visualLR = 3.1;
      else visualLR = 1.8;

      factorBreakdown.push({
        factor: 'Leaf Vision Inspection',
        parameterName: 'Visual Pathology Scan',
        observedValue: `${params.visualEvidenceName || 'Pathogen Lesion'} (${conf.toFixed(1)}% conf)`,
        likelihoodRatio: visualLR,
        impact: 'increases',
        explanation: `Symptom recognition in the field acts as definitive empirical evidence, multiplying disease odds by ${visualLR}x.`
      });
    }
  }

  // 3. Environmental Likelihood Ratios based on Pathogen Epidemiology
  let lrHumidity = 1.0;
  let humExp = '';
  let lrTemp = 1.0;
  let tempExp = '';
  let lrRainfall = 1.0;
  let rainExp = '';
  let lrSoil = 1.0;
  let soilExp = '';
  let lrWind = 1.0;
  let windExp = '';

  if (pathogen === 'Fungal Blight') {
    // Fungi: love high humidity (>80%), moderate temp (18-26°C), splashing rain
    if (params.humidity >= 85) {
      lrHumidity = 3.6;
      humExp = 'Sustained canopy saturation (>85% RH) dramatically accelerates fungal spore germination.';
    } else if (params.humidity >= 70) {
      lrHumidity = 1.8;
      humExp = 'Elevated humidity provides favorable moisture for sporulation.';
    } else if (params.humidity < 45) {
      lrHumidity = 0.32;
      humExp = 'Dry atmospheric humidity suppresses fungal spore development.';
    } else {
      lrHumidity = 1.0;
      humExp = 'Neutral ambient moisture conditions.';
    }

    if (params.temperature >= 18 && params.temperature <= 26) {
      lrTemp = 1.8;
      tempExp = 'Optimal 18°C-26°C thermal window for maximum fungal mycelium expansion.';
    } else if (params.temperature > 35) {
      lrTemp = 0.4;
      tempExp = 'High thermal heat stress (>35°C) inhibits fungal spore viability.';
    } else if (params.temperature < 12) {
      lrTemp = 0.55;
      tempExp = 'Sub-optimal cold temperatures slow fungal metabolic development.';
    } else {
      lrTemp = 1.1;
      tempExp = 'Moderate temperatures supportive of foliar pathogen.';
    }

    if (params.rainfall > 60) {
      lrRainfall = 2.4;
      rainExp = 'Heavy rain causes raindrop splash dispersal and prolongs leaf wetness beyond 8 hours.';
    } else if (params.rainfall > 25) {
      lrRainfall = 1.4;
      rainExp = 'Moderate rainfall supplies needed leaf surface free moisture.';
    } else if (params.rainfall < 5) {
      lrRainfall = 0.55;
      rainExp = 'Minimal precipitation limits splash inoculation across rows.';
    } else {
      lrRainfall = 1.0;
      rainExp = 'Average rainfall profile.';
    }

    if (params.soilMoisture > 80) {
      lrSoil = 1.45;
      soilExp = 'Waterlogged root zones compromise root oxygenation and elevate sap guttation.';
    } else if (params.soilMoisture < 25) {
      lrSoil = 1.25;
      soilExp = 'Severe drought stress impairs host physiological defense mechanisms.';
    } else {
      lrSoil = 1.0;
      soilExp = 'Optimal rootzone water potential.';
    }

    if (params.windSpeed >= 12 && params.windSpeed <= 28) {
      lrWind = 1.55;
      windExp = 'Gentle-to-moderate breeze (12-28 km/h) optimizes dispersal of airborne conidia spores.';
    } else if (params.windSpeed > 45) {
      lrWind = 0.85;
      windExp = 'Gale winds dry leaf surfaces rapidly despite physical mechanical shaking.';
    } else {
      lrWind = 1.0;
      windExp = 'Baseline air movement.';
    }

  } else if (pathogen === 'Bacterial Spot') {
    // Bacteria: love warm to hot wet conditions (26-34°C), splash-heavy rain
    if (params.temperature >= 26 && params.temperature <= 34) {
      lrTemp = 2.3;
      tempExp = 'Warm humid conditions (26-34°C) trigger rapid bacterial cell multiplication.';
    } else if (params.temperature < 16) {
      lrTemp = 0.4;
      tempExp = 'Low temperatures severely retard bacterial population growth.';
    } else {
      lrTemp = 1.1;
      tempExp = 'Permissive temperature range.';
    }

    if (params.rainfall > 50) {
      lrRainfall = 2.6;
      rainExp = 'Raindrops provide hydrostatic entry into plant stomata and hydathodes.';
    } else if (params.rainfall < 10) {
      lrRainfall = 0.5;
      rainExp = 'Absence of rain splash restricts bacterial transmission across the crop row.';
    } else {
      lrRainfall = 1.2;
      rainExp = 'Moderate rain event.';
    }

    if (params.humidity >= 80) {
      lrHumidity = 2.1;
      humExp = 'High canopy humidity prevents bacterial exudate from desiccation.';
    } else if (params.humidity < 50) {
      lrHumidity = 0.45;
      humExp = 'Dry atmosphere induces bacterial dormancy and desiccation.';
    } else {
      lrHumidity = 1.0;
      humExp = 'Standard humidity levels.';
    }

    lrSoil = params.soilMoisture > 75 ? 1.4 : (params.soilMoisture < 30 ? 1.1 : 1.0);
    soilExp = params.soilMoisture > 75 ? 'Saturated soil favors vascular bacterial wilt colonization.' : 'Normal soil conditions.';

    lrWind = params.windSpeed > 20 ? 1.6 : 1.0;
    windExp = params.windSpeed > 20 ? 'Wind-driven rain causes micro-abrasions on leaves providing entry wounds.' : 'Moderate wind without leaf tearing.';

  } else if (pathogen === 'Viral Mosaic') {
    // Viruses: depend on vector insects (whiteflies, aphids) which flourish in warm, drier conditions!
    if (params.temperature >= 26 && params.temperature <= 34) {
      lrTemp = 2.5;
      tempExp = 'Warm temperatures sharply increase whitefly and aphid vector reproductive rates.';
    } else if (params.temperature < 18) {
      lrTemp = 0.5;
      tempExp = 'Cool weather slows down insect vector activity and feeding frequency.';
    } else {
      lrTemp = 1.2;
      tempExp = 'Warm enough for steady vector flight.';
    }

    if (params.rainfall > 60) {
      lrRainfall = 0.35; // Heavy rain washes vectors off the foliage!
      rainExp = 'Intense downpours physically wash insect vectors off leaf canopies.';
    } else if (params.rainfall < 15) {
      lrRainfall = 1.8;
      rainExp = 'Dry weather promotes intense vector feeding and migration.';
    } else {
      lrRainfall = 1.0;
      rainExp = 'Normal precipitation.';
    }

    if (params.humidity < 60) {
      lrHumidity = 1.5;
      humExp = 'Lower humidity stimulates insect vector flight between adjacent crop plants.';
    } else if (params.humidity > 85) {
      lrHumidity = 0.7;
      humExp = 'Very high humidity promotes entomopathogenic fungi that control insect vectors.';
    } else {
      lrHumidity = 1.0;
      humExp = 'Moderate humidity.';
    }

    lrSoil = params.soilMoisture < 30 ? 1.4 : 1.0;
    soilExp = params.soilMoisture < 30 ? 'Drought stress concentrates sap sugars, attracting sucking vectors.' : 'Sufficient soil water.';

    lrWind = params.windSpeed >= 8 && params.windSpeed <= 22 ? 1.7 : 0.8;
    windExp = params.windSpeed >= 8 && params.windSpeed <= 22 ? 'Moderate thermal breezes carry small winged vectors across large field distances.' : 'Turbulent or calm winds limit vector flight.';

  } else {
    // Powdery Mildew
    if (params.humidity >= 60 && params.humidity <= 80) {
      lrHumidity = 2.4;
      humExp = 'Powdery mildew thrives in moderate-to-high humidity without requiring free water.';
    } else if (params.humidity < 40) {
      lrHumidity = 0.6;
      humExp = 'Very dry air slows down sporulation.';
    } else {
      lrHumidity = 1.2;
      humExp = 'Moderate moisture levels.';
    }

    if (params.temperature >= 20 && params.temperature <= 28) {
      lrTemp = 2.0;
      tempExp = 'Optimal 20-28°C window for powdery conidial proliferation.';
    } else if (params.temperature > 36 || params.temperature < 14) {
      lrTemp = 0.45;
      tempExp = 'Extreme heat or cold suppresses fungal mycelium expansion.';
    } else {
      lrTemp = 1.1;
      tempExp = 'Mild temperatures.';
    }

    if (params.rainfall > 35) {
      lrRainfall = 0.4; // Free water actually inhibits powdery mildew germination!
      rainExp = 'Direct heavy rain washes powdery spores off leaves and bursts spore chains.';
    } else {
      lrRainfall = 1.6;
      rainExp = 'Dry canopy surface favors powdery mildew adherence.';
    }

    lrSoil = 1.0;
    soilExp = 'Soil moisture has secondary influence on powdery foliar fungi.';

    lrWind = params.windSpeed > 10 ? 1.5 : 1.0;
    windExp = params.windSpeed > 10 ? 'Wind dislodges dry powdery conidia into aerial suspension.' : 'Low air current.';
  }

  // Record environmental factors
  factorBreakdown.push({
    factor: 'Canopy Relative Humidity',
    parameterName: 'Relative Humidity',
    observedValue: `${params.humidity}%`,
    likelihoodRatio: lrHumidity,
    impact: lrHumidity > 1.15 ? 'increases' : (lrHumidity < 0.85 ? 'decreases' : 'neutral'),
    explanation: humExp
  });

  factorBreakdown.push({
    factor: 'Ambient Temperature',
    parameterName: 'Air Temperature',
    observedValue: `${params.temperature}°C`,
    likelihoodRatio: lrTemp,
    impact: lrTemp > 1.15 ? 'increases' : (lrTemp < 0.85 ? 'decreases' : 'neutral'),
    explanation: tempExp
  });

  factorBreakdown.push({
    factor: '7-Day Cumulative Rainfall',
    parameterName: 'Cumulative Rain',
    observedValue: `${params.rainfall} mm`,
    likelihoodRatio: lrRainfall,
    impact: lrRainfall > 1.15 ? 'increases' : (lrRainfall < 0.85 ? 'decreases' : 'neutral'),
    explanation: rainExp
  });

  factorBreakdown.push({
    factor: 'Rootzone Soil Moisture',
    parameterName: 'Soil Moisture',
    observedValue: `${params.soilMoisture}%`,
    likelihoodRatio: lrSoil,
    impact: lrSoil > 1.15 ? 'increases' : (lrSoil < 0.85 ? 'decreases' : 'neutral'),
    explanation: soilExp
  });

  factorBreakdown.push({
    factor: 'Canopy Wind Speed',
    parameterName: 'Wind Speed',
    observedValue: `${params.windSpeed} km/h`,
    likelihoodRatio: lrWind,
    impact: lrWind > 1.15 ? 'increases' : (lrWind < 0.85 ? 'decreases' : 'neutral'),
    explanation: windExp
  });

  // Calculate aggregate likelihood ratio
  const aggregateLikelihoodRatio = Number(
    (visualLR * lrHumidity * lrTemp * lrRainfall * lrSoil * lrWind).toFixed(3)
  );

  // Bayes Rule: Posterior Odds = Prior Odds * Aggregate LR
  const posteriorOdds = Number((priorOdds * aggregateLikelihoodRatio).toFixed(3));

  // Convert Posterior Odds back to Posterior Probability: P = Odds / (1 + Odds)
  const posteriorProbability = Number((posteriorOdds / (1.0 + posteriorOdds)).toFixed(4));

  // Determine categorical alert level
  let riskCategory: 'Low Risk' | 'Guarded' | 'High Alert' | 'Outbreak Imminent' = 'Low Risk';
  const actions: string[] = [];

  if (posteriorProbability > 0.65) {
    riskCategory = 'Outbreak Imminent';
    actions.push('Prophylactic biological protection: Apply Trichoderma or Bacillus bio-fungicide within 24 hours');
    actions.push('Cease overhead irrigation immediately; ensure drainage ditches are cleared to eliminate pooling water');
    actions.push('Scout lower canopy leaves twice daily for nascent lesions; rogue and burn infected foliage immediately');
    actions.push('Alert adjacent cooperative farmers to conduct synchronous inspection');
  } else if (posteriorProbability > 0.40) {
    riskCategory = 'High Alert';
    actions.push('Prune congested lower foliage to maximize inter-row aeration and reduce leaf-drying time');
    actions.push('Prepare botanical neem oil or wood-ash extract for rapid preventative spraying upon rain cessation');
    actions.push('Replenish dry organic straw mulch to cushion soil and suppress rain-splash spore transmission');
  } else if (posteriorProbability > 0.20) {
    riskCategory = 'Guarded';
    actions.push('Conduct bi-weekly systematic field scouting along a "W" trajectory across the field');
    actions.push('Monitor local 5-day precipitation forecasts to schedule weeding before wet fronts');
  } else {
    riskCategory = 'Low Risk';
    actions.push('Current agro-climatic conditions are unfavorable for active pathogen sporulation');
    actions.push('Maintain regular compost tea soil nourishment and organic weed barrier maintenance');
  }

  return {
    priorProbability: baselinePrior,
    priorOdds: Number(priorOdds.toFixed(3)),
    likelihoodRatio: aggregateLikelihoodRatio,
    posteriorOdds,
    posteriorProbability,
    riskCategory,
    recommendedActions: actions,
    factorBreakdown,
    visualEvidenceApplied: params.includeVisualEvidence && params.visualEvidenceConfidence !== undefined,
    visualLikelihoodRatio: visualLR,
    formulaStepByStep: {
      priorOddsText: `P(D) = ${(baselinePrior * 100).toFixed(0)}%  ➔  Prior Odds = ${baselinePrior.toFixed(2)} / ${(1 - baselinePrior).toFixed(2)} = ${priorOdds.toFixed(3)}`,
      combinedLRText: `Combined LR = ${visualLR !== 1 ? `${visualLR.toFixed(2)}(vision) × ` : ''}${lrHumidity.toFixed(2)}(hum) × ${lrTemp.toFixed(2)}(temp) × ${lrRainfall.toFixed(2)}(rain) × ${lrSoil.toFixed(2)}(soil) × ${lrWind.toFixed(2)}(wind) = ${aggregateLikelihoodRatio.toFixed(2)}`,
      posteriorOddsText: `Posterior Odds = ${priorOdds.toFixed(3)} × ${aggregateLikelihoodRatio.toFixed(2)} = ${posteriorOdds.toFixed(3)}`,
      finalProbabilityText: `Posterior P(D|E) = ${posteriorOdds.toFixed(3)} / (1 + ${posteriorOdds.toFixed(3)}) = ${(posteriorProbability * 100).toFixed(1)}%`
    }
  };
}
