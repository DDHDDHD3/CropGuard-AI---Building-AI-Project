export type Language = 'en' | 'so' | 'sw';

export type PathogenTarget = 'Fungal Blight' | 'Bacterial Spot' | 'Viral Mosaic' | 'Powdery Mildew';

export interface CropDisease {
  id: string;
  crop: string;
  name: string;
  scientificName: string;
  pathogenType: 'Fungus' | 'Virus' | 'Bacteria' | 'Pest' | 'Healthy';
  severity: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Healthy';
  confidence: number;
  image: string;
  description: string;
  symptoms: string[];
  organicTreatment: string[];
  preventativeMeasures: string[];
  optimalConditions: {
    tempRange: string;
    humidityRange: string;
    riskTrigger: string;
  };
  eppoCode?: string;
  faoPestCode?: string;
  accessionId?: string;
  economicThreshold?: string;
  activeIngredients?: string[];
}

export interface EnvironmentalParams {
  cropType: string;
  pathogenTarget: PathogenTarget;
  temperature: number; // Celsius
  humidity: number; // %
  rainfall: number; // mm last 7 days
  soilMoisture: number; // %
  windSpeed: number; // km/h
  includeVisualEvidence: boolean;
  visualEvidenceConfidence?: number;
  visualEvidenceName?: string;
  visualEvidenceSeverity?: CropDisease['severity'];
}

export interface BayesFactorContribution {
  factor: string;
  parameterName: string;
  observedValue: string;
  likelihoodRatio: number;
  impact: 'increases' | 'neutral' | 'decreases';
  explanation: string;
}

export interface BayesCalculation {
  priorProbability: number;
  priorOdds: number;
  likelihoodRatio: number;
  posteriorOdds: number;
  posteriorProbability: number;
  riskCategory: 'Low Risk' | 'Guarded' | 'High Alert' | 'Outbreak Imminent';
  recommendedActions: string[];
  factorBreakdown: BayesFactorContribution[];
  visualEvidenceApplied: boolean;
  visualLikelihoodRatio: number;
  formulaStepByStep: {
    priorOddsText: string;
    combinedLRText: string;
    posteriorOddsText: string;
    finalProbabilityText: string;
  };
}

export interface GroundingSource {
  title: string;
  url: string;
}

export type ChatBotRole = 'agronomist' | 'pathologist' | 'triage';

export type ModelTier = 'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
  model?: string;
  role?: ChatBotRole;
  groundingSources?: GroundingSource[];
  webSearchQueries?: string[];
  isStreaming?: boolean;
  isJustFinished?: boolean;
  isStopped?: boolean;
  error?: string;
}

export interface ScanHistoryEntry {
  id: string;
  timestamp: string; // ISO string
  formattedDate: string;
  cropName: string;
  disease: CropDisease;
  imageUrl: string;
  source: 'Live Camera' | 'File Upload' | 'Field Sample';
  severity: CropDisease['severity'];
  confidence: number;
  fieldZone?: string;
  status: 'Under Observation' | 'Treatment Applied' | 'Resolved' | 'High Risk Alert';
  notes?: string;
  pixelMetrics?: {
    chlorosisPercent: number;
    necrosisPercent: number;
    excessGreenIndex: number;
  };
}

export interface SeasonalPlantingTip {
  title: string;
  description: string;
  category: 'sowing' | 'rotation' | 'soil' | 'pest_prevention';
  recommendedCrops?: string[];
  targetScannedCrop?: string;
  badge?: string;
}

export interface SeasonalPlantingAdvice {
  monthIndex: number; // 0-11
  monthName: string;
  seasonPhase: string;
  climateContext: string;
  scannedCropsAnalyzed: string[];
  detectedPathogens: string[];
  topTips: SeasonalPlantingTip[];
  recommendedSowingList: { crop: string; reason: string; maturityDays: string }[];
  companionPairing: { main: string; companion: string; benefit: string };
  rotationWarning?: string;
}

export interface WeatherCondition {
  locationName: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  temperature: number; // °C
  apparentTemperature: number; // °C
  humidity: number; // %
  precipitation: number; // mm
  precipitationProbability: number; // %
  windSpeed: number; // km/h
  windDirection?: number; // degrees
  weatherCode: number;
  weatherDescription: string;
  isDay: boolean;
  timestamp: string;
  source: 'live_api' | 'mock_service';
  dailyForecast?: Array<{
    date: string;
    dayName: string;
    tempMax: number;
    tempMin: number;
    precipitationSum: number;
    weatherCode: number;
  }>;
}

export interface ClimateSmartAdvisory {
  fungalRisk: {
    level: 'Low' | 'Moderate' | 'High' | 'Severe';
    score: number; // 0-100
    description: string;
  };
  sprayWindow: {
    status: 'Optimal' | 'Caution' | 'Unfavorable';
    reason: string;
  };
  irrigationDemand: {
    level: 'Low' | 'Moderate' | 'High';
    advice: string;
  };
  pestVectorRisk: {
    level: 'Low' | 'Moderate' | 'High';
    alert: string;
  };
  keyAction: string;
}

