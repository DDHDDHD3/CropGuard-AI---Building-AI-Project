export type Language = 'en' | 'so' | 'sw';

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
}

export interface EnvironmentalParams {
  cropType: string;
  temperature: number; // Celsius
  humidity: number; // %
  rainfall: number; // mm last 7 days
  soilMoisture: number; // %
  windSpeed: number; // km/h
}

export interface BayesCalculation {
  priorProbability: number;
  priorOdds: number;
  likelihoodRatio: number;
  posteriorOdds: number;
  posteriorProbability: number;
  riskCategory: 'Low Risk' | 'Guarded' | 'High Alert' | 'Outbreak Imminent';
  recommendedActions: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}
