import React, { useState, useMemo } from 'react';
import { 
  CloudSun, 
  Droplets, 
  Thermometer, 
  Gauge, 
  AlertCircle, 
  CheckCircle2, 
  Calculator, 
  HelpCircle,
  TrendingUp,
  Activity,
  Wind
} from 'lucide-react';
import { EnvironmentalParams } from '../types';
import { computeBayesRisk } from '../utils/bayesEngine';

export const BayesianRiskModel: React.FC = () => {
  const [params, setParams] = useState<EnvironmentalParams>({
    cropType: 'Maize (Corn)',
    temperature: 24,
    humidity: 84,
    rainfall: 65,
    soilMoisture: 72,
    windSpeed: 14
  });

  const calculation = useMemo(() => computeBayesRisk(params), [params]);

  const getRiskColor = (prob: number) => {
    if (prob > 0.65) return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    if (prob > 0.40) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    if (prob > 0.20) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  };

  const getGaugeColor = (prob: number) => {
    if (prob > 0.65) return 'from-rose-500 to-red-600';
    if (prob > 0.40) return 'from-amber-500 to-orange-600';
    if (prob > 0.20) return 'from-yellow-400 to-amber-500';
    return 'from-emerald-400 to-teal-500';
  };

  return (
    <div className="space-y-6">
      {/* Header with Building AI Course Connection */}
      <div className="bg-stone-900/50 rounded-2xl p-5 sm:p-6 border border-emerald-900/30 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Calculator className="w-3 h-3" />
                Building AI Curriculum Module: Naive Bayes & Odds
              </span>
              <span className="text-xs text-stone-400">Bayes' Rule: Posterior Odds = Prior Odds &times; Likelihood Ratio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Space_Grotesk']">
              Agrometeorological Bayesian Outbreak Predictor
            </h1>
            <p className="text-sm text-stone-300 mt-1 max-w-3xl leading-relaxed">
              In the Building AI course, we learned how real-world reasoning under uncertainty updates probabilities using evidence. This module calculates the updated probability of a fungal blight epidemic based on microclimatic sensor data.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-stone-950/80 px-4 py-3 rounded-xl border border-stone-800 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Course Reference:</span>
              <span className="text-emerald-400 font-mono font-bold">Exercise 7-10: Probabilistic AI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Climate Sliders */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-stone-900/60 rounded-2xl p-5 sm:p-6 border border-stone-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-emerald-400" />
                Observed Microclimate Parameters
              </h2>
              <span className="text-xs font-mono text-stone-400">Live Weather Inputs</span>
            </div>

            {/* Crop Type Selection */}
            <div>
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-2">
                Target Crop Variety
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['Maize (Corn)', 'Tomato & Solanaceae', 'Cassava & Tubers'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setParams({ ...params, cropType: c })}
                    className={`py-2 px-2.5 rounded-xl font-medium text-center truncate border transition-colors cursor-pointer ${
                      params.cropType === c
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 1: Relative Humidity */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-300 font-medium flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" />
                  Relative Canopy Humidity (RH)
                </span>
                <span className="font-mono text-white font-bold bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                  {params.humidity}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={params.humidity}
                onChange={(e) => setParams({ ...params, humidity: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-stone-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-stone-500">
                <span>20% (Arid)</span>
                <span>70% (Mild)</span>
                <span>&gt;85% (Optimal Spore Germination)</span>
              </div>
            </div>

            {/* Slider 2: Ambient Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-300 font-medium flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  Ambient Air Temperature
                </span>
                <span className="font-mono text-white font-bold bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                  {params.temperature}°C
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="42"
                value={params.temperature}
                onChange={(e) => setParams({ ...params, temperature: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-stone-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-stone-500">
                <span>10°C (Cold)</span>
                <span>24°C (Blight Peak)</span>
                <span>42°C (Thermal Inactivation)</span>
              </div>
            </div>

            {/* Slider 3: 7-Day Cumulative Rainfall */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-300 font-medium flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
                  Cumulative 7-Day Rainfall
                </span>
                <span className="font-mono text-white font-bold bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                  {params.rainfall} mm
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="140"
                value={params.rainfall}
                onChange={(e) => setParams({ ...params, rainfall: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-stone-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-stone-500">
                <span>0 mm (Drought)</span>
                <span>40 mm (Moderate)</span>
                <span>&gt;70 mm (Rain Splash Dispersal)</span>
              </div>
            </div>

            {/* Slider 4: Rootzone Soil Moisture */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-300 font-medium flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-blue-400" />
                  Rootzone Soil Moisture (0-15cm)
                </span>
                <span className="font-mono text-white font-bold bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                  {params.soilMoisture}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={params.soilMoisture}
                onChange={(e) => setParams({ ...params, soilMoisture: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-stone-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-stone-500">
                <span>10% (Wilting Point)</span>
                <span>55% (Field Capacity)</span>
                <span>95% (Waterlogged)</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Bayesian Probability Calculations & Gauge */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-stone-900/60 rounded-2xl p-5 sm:p-6 border border-stone-800 space-y-5">
            
            {/* Outbreak Probability Gauge Card */}
            <div className="bg-stone-950/70 rounded-xl p-5 border border-stone-800 text-center space-y-3">
              <span className="text-xs uppercase font-mono tracking-wider text-stone-400">
                Updated Posterior Outbreak Risk: P(Disease | Weather)
              </span>
              
              <div className="flex items-center justify-center gap-3">
                <span className="text-5xl font-black text-white tracking-tight font-['Space_Grotesk']">
                  {(calculation.posteriorProbability * 100).toFixed(1)}%
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(calculation.posteriorProbability)}`}>
                  {calculation.riskCategory}
                </span>
              </div>

              {/* Progress Bar Gauge */}
              <div className="w-full h-3 bg-stone-800 rounded-full overflow-hidden p-0.5">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${getGaugeColor(calculation.posteriorProbability)} transition-all duration-500`}
                  style={{ width: `${Math.min(100, Math.max(3, calculation.posteriorProbability * 100))}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-stone-400 font-mono pt-1">
                <span>0% Safe</span>
                <span>25% Guarded</span>
                <span>50% High Risk</span>
                <span>100% Epidemic</span>
              </div>
            </div>

            {/* Step-by-Step Bayesian Mathematical Formulation */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Bayesian Updating Proof (Course Mathematics)
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Step 1: Prior */}
                <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
                  <span className="text-[10px] font-mono text-stone-400 block">Step 1: Baseline Prior</span>
                  <div className="text-sm font-bold text-white mt-0.5">
                    P(D) = {(calculation.priorProbability * 100).toFixed(0)}%
                  </div>
                  <span className="text-[11px] text-stone-400">
                    Prior Odds: <span className="font-mono text-emerald-300">{calculation.priorOdds}</span> (or 1 : 7.3)
                  </span>
                </div>

                {/* Step 2: Likelihood Ratio */}
                <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
                  <span className="text-[10px] font-mono text-stone-400 block">Step 2: Likelihood Ratio (LR)</span>
                  <div className="text-sm font-bold text-amber-300 mt-0.5 font-mono">
                    LR = {calculation.likelihoodRatio} &times;
                  </div>
                  <span className="text-[11px] text-stone-400">
                    P(Weather|D) / P(Weather|&not;D)
                  </span>
                </div>

                {/* Step 3: Posterior Odds */}
                <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
                  <span className="text-[10px] font-mono text-stone-400 block">Step 3: Bayes Update</span>
                  <div className="text-xs font-mono text-stone-200 mt-0.5">
                    Post Odds = {calculation.priorOdds} &times; {calculation.likelihoodRatio}
                  </div>
                  <span className="text-sm font-bold text-teal-300 font-mono">
                    = {calculation.posteriorOdds}
                  </span>
                </div>

                {/* Step 4: Final Probability */}
                <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
                  <span className="text-[10px] font-mono text-stone-400 block">Step 4: Odds to Prob</span>
                  <div className="text-xs font-mono text-stone-200 mt-0.5">
                    Odds / (1 + Odds)
                  </div>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    = {(calculation.posteriorProbability * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Recommended Farm Actions */}
            <div className="bg-emerald-950/20 rounded-xl p-4 border border-emerald-800/30 space-y-2">
              <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Agronomic Action Triggered by Risk Score
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-300">
                {calculation.recommendedActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
