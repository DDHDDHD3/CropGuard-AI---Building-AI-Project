import React, { useState, useMemo, useEffect } from 'react';
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
  Wind,
  Layers,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Eye,
  Info,
  Sliders,
  RotateCcw
} from 'lucide-react';
import { EnvironmentalParams, CropDisease, PathogenTarget, BayesCalculation, Language } from '../types';
import { computeBayesRisk } from '../utils/bayesEngine';
import { t, translateCrop, translateSeverity, translatePathogen } from '../utils/translations';

interface BayesianRiskModelProps {
  activeCrop: CropDisease | null;
  onConsultAgronomist: (crop: CropDisease, calculation: BayesCalculation) => void;
  language?: Language;
  initialWeather?: {
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
  } | null;
}

export const BayesianRiskModel: React.FC<BayesianRiskModelProps> = ({
  activeCrop,
  onConsultAgronomist,
  language = 'so',
  initialWeather
}) => {
  const [params, setParams] = useState<EnvironmentalParams>({
    cropType: activeCrop ? activeCrop.crop : 'Tomato & Solanaceae',
    pathogenTarget: 'Fungal Blight',
    temperature: initialWeather?.temperature ?? 24,
    humidity: initialWeather?.humidity ?? 84,
    rainfall: initialWeather?.rainfall ?? 65,
    soilMoisture: initialWeather ? Math.min(95, Math.max(30, Math.round(initialWeather.humidity * 0.7 + initialWeather.rainfall * 0.3))) : 72,
    windSpeed: initialWeather?.windSpeed ?? 16,
    includeVisualEvidence: Boolean(activeCrop),
    visualEvidenceConfidence: activeCrop?.confidence,
    visualEvidenceName: activeCrop?.name,
    visualEvidenceSeverity: activeCrop?.severity
  });

  const [weatherTelemetryBadge, setWeatherTelemetryBadge] = useState<boolean>(Boolean(initialWeather));

  // Sync if initialWeather changes dynamically
  useEffect(() => {
    if (initialWeather) {
      setParams(prev => ({
        ...prev,
        temperature: initialWeather.temperature,
        humidity: initialWeather.humidity,
        rainfall: initialWeather.rainfall,
        windSpeed: initialWeather.windSpeed,
        soilMoisture: Math.min(95, Math.max(30, Math.round(initialWeather.humidity * 0.7 + initialWeather.rainfall * 0.3)))
      }));
      setWeatherTelemetryBadge(true);
    }
  }, [initialWeather]);

  // Sync when activeCrop updates from Scanner
  useEffect(() => {
    if (activeCrop) {
      const isVirus = activeCrop.pathogenType === 'Virus';
      const isBact = activeCrop.pathogenType === 'Bacteria';
      const target: PathogenTarget = isVirus ? 'Viral Mosaic' : (isBact ? 'Bacterial Spot' : 'Fungal Blight');

      setParams(prev => ({
        ...prev,
        cropType: activeCrop.crop,
        pathogenTarget: target,
        includeVisualEvidence: true,
        visualEvidenceConfidence: activeCrop.confidence,
        visualEvidenceName: activeCrop.name,
        visualEvidenceSeverity: activeCrop.severity
      }));
    }
  }, [activeCrop]);

  const calculation = useMemo(() => computeBayesRisk(params), [params]);

  const getRiskColor = (prob: number) => {
    if (prob > 0.65) return 'text-rose-800 bg-rose-50 border-rose-300';
    if (prob > 0.40) return 'text-amber-900 bg-amber-50 border-amber-300';
    if (prob > 0.20) return 'text-yellow-900 bg-yellow-50 border-yellow-300';
    return 'text-emerald-800 bg-emerald-50 border-emerald-300';
  };

  const getGaugeColor = (prob: number) => {
    if (prob > 0.65) return 'from-rose-500 to-red-600';
    if (prob > 0.40) return 'from-amber-500 to-orange-600';
    if (prob > 0.20) return 'from-yellow-400 to-amber-500';
    return 'from-emerald-500 to-teal-600';
  };

  // Weather scenario presets to test logical sensitivity
  const applyPreset = (name: string) => {
    if (name === 'blight-fog') {
      setParams(prev => ({
        ...prev,
        pathogenTarget: 'Fungal Blight',
        temperature: 20,
        humidity: 92,
        rainfall: 80,
        soilMoisture: 85,
        windSpeed: 18
      }));
    } else if (name === 'viral-vector') {
      setParams(prev => ({
        ...prev,
        pathogenTarget: 'Viral Mosaic',
        temperature: 31,
        humidity: 52,
        rainfall: 4,
        soilMoisture: 28,
        windSpeed: 14
      }));
    } else if (name === 'bacterial-storm') {
      setParams(prev => ({
        ...prev,
        pathogenTarget: 'Bacterial Spot',
        temperature: 29,
        humidity: 86,
        rainfall: 95,
        soilMoisture: 88,
        windSpeed: 28
      }));
    } else if (name === 'arid-dry') {
      setParams(prev => ({
        ...prev,
        temperature: 28,
        humidity: 32,
        rainfall: 0,
        soilMoisture: 22,
        windSpeed: 8
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Building AI Course Connection */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                {language === 'so' ? 'Qaacidada Suurtagalnimada ee Bayes' : 'Multi-Evidence Bayesian Updating & Odds Theorem'}
              </span>
              <span className="text-xs text-slate-500">Posterior Odds = Prior Odds &times; &prod; LR<sub>i</sub></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-['Space_Grotesk']">
              {t('bayes.title', language)}
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {t('bayes.subtitle', language)}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 px-4 py-3 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">
                {language === 'so' ? 'Qaabka Xisaabinta:' : 'Mathematical Specification:'}
              </span>
              <span className="text-slate-900 font-mono font-bold">Bayesian Odds Formulation &bull; Independent Likelihood Ratios</span>
            </div>
          </div>
        </div>

        {/* Visual Scanner Evidence Integration Banner */}
        {params.visualEvidenceName && (
          <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-emerald-800 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">
                  {language === 'so' ? 'Caddeynta Sawirka Baaritaanka:' : 'Active Visual Diagnostic Linkage:'} {translateCrop(params.cropType, language)} &ndash; {params.visualEvidenceName}
                </span>
                <span className="text-slate-600 block text-[11px]">
                  {language === 'so' ? 'Kalsoonida Sawirka:' : 'Scanner confidence:'} <strong className="font-mono text-emerald-800">{params.visualEvidenceConfidence?.toFixed(1)}%</strong> &bull; {language === 'so' ? 'Saameynta LR:' : 'Likelihood Ratio:'} <strong className="font-mono text-amber-900">{calculation.visualLikelihoodRatio}&times;</strong>
                </span>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800 self-start sm:self-auto">
              <input
                type="checkbox"
                checked={params.includeVisualEvidence}
                onChange={(e) => setParams({ ...params, includeVisualEvidence: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span>{language === 'so' ? 'Ku dar Caddeynta Sawirka Xisaabinta Bayes' : 'Incorporate Visual Evidence in Bayes Update'}</span>
            </label>
          </div>
        )}

        {/* Live Weather Integration Badge */}
        {weatherTelemetryBadge && (
          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
              <span>
                <strong className="font-mono">{language === 'so' ? 'Xogta Cimilada Dhabta ah:' : 'Meteorological Feed Synced:'}</strong>{' '}
                {params.temperature}°C, {params.humidity}% {language === 'so' ? 'qoyaan' : 'RH'}, {params.rainfall} mm {language === 'so' ? 'roob' : 'rain'}, {params.windSpeed} km/h {language === 'so' ? 'dabayl' : 'wind'}
              </span>
            </div>
            <button
              onClick={() => setWeatherTelemetryBadge(false)}
              className="text-sky-600 hover:text-sky-800 font-bold px-2 py-0.5 cursor-pointer text-sm"
              title="Dismiss"
            >
              &times;
            </button>
          </div>
        )}

        {/* Sensitivity Presets Bar */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            {language === 'so' ? 'Tusaalooyinka Cimilada:' : 'Logical Presets:'}
          </span>
          <button
            onClick={() => applyPreset('blight-fog')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
          >
            {language === 'so' ? 'Roob & Qoyaan Badan (Khatar Caariyow)' : 'Humid Rain Front (Blight Alert)'}
          </button>
          <button
            onClick={() => applyPreset('bacterial-storm')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
          >
            {language === 'so' ? 'Duufaan & Kulayl (Dhibic Bakteeriyo)' : 'Warm Splash Monsoon (Bacterial Spot)'}
          </button>
          <button
            onClick={() => applyPreset('viral-vector')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
          >
            {language === 'so' ? 'Kuleyl Qallalan & Cayayaan (Fayras)' : 'Dry Warm Vector Swarm (Viral Stunt)'}
          </button>
          <button
            onClick={() => applyPreset('arid-dry')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
          >
            {language === 'so' ? 'Qorrax & Abaar (Khatar Yar)' : 'Arid Sunny Weather (Low Pressure)'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Climate & Crop Parameter Sliders */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-emerald-600" />
                {language === 'so' ? 'Qodobbada Cimilada & Deegaanka' : 'Agroclimatic Evidence Variables'}
              </h2>
              <span className="text-xs font-mono text-slate-500 font-medium">
                {language === 'so' ? 'Xogta Deegaanka' : 'Empirical Input Features'}
              </span>
            </div>

            {/* Crop Type Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
                {language === 'so' ? 'Dalagga La Beero (Go\'aamiya Khatarta Asalka ah ee Prior)' : 'Host Crop (Determines Baseline Disease Prior Odds)'}
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'Tomato & Solanaceae', label: language === 'so' ? 'Yaanyo & Qoyskeeda' : 'Tomato & Solanaceae' },
                  { id: 'Potato & Tubers', label: language === 'so' ? 'Baradho & Xididdo' : 'Potato & Tubers' },
                  { id: 'Cassava & Tubers', label: language === 'so' ? 'Kasaafada & Xididdo' : 'Cassava & Tubers' },
                  { id: 'Maize (Corn)', label: language === 'so' ? 'Galley (Hadhuudh)' : 'Maize (Corn)' },
                  { id: 'Banana & Plantain', label: language === 'so' ? 'Moos' : 'Banana & Plantain' },
                  { id: 'General Field Crop', label: language === 'so' ? 'Dalag Guud' : 'General Field Crop' }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setParams({ ...params, cropType: c.id })}
                    className={`py-2 px-2 rounded-xl font-medium text-center truncate border transition-colors cursor-pointer ${
                      params.cropType === c.id
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold ring-1 ring-emerald-500/40 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Pathogen Mode */}
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
                {language === 'so' ? 'Nooca Cudurka La Saadaalinayo' : 'Epidemiological Target Model'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {([
                  { id: 'Fungal Blight', label: language === 'so' ? 'Caariyow (Fungus)' : 'Fungal Blight' },
                  { id: 'Bacterial Spot', label: language === 'so' ? 'Bakteeriyo (Spot)' : 'Bacterial Spot' },
                  { id: 'Viral Mosaic', label: language === 'so' ? 'Fayras (Mosaic)' : 'Viral Mosaic' },
                  { id: 'Powdery Mildew', label: language === 'so' ? 'Caaryo Cadaan' : 'Powdery Mildew' }
                ] as { id: PathogenTarget; label: string }[]).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setParams({ ...params, pathogenTarget: p.id })}
                    className={`py-1.5 px-2 rounded-lg font-medium text-center border transition-colors cursor-pointer text-[11px] ${
                      params.pathogenTarget === p.id
                        ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 1: Relative Humidity */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-700 font-medium flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-600" />
                  {language === 'so' ? 'Qoyaanka Hawada (RH)' : 'Canopy Relative Humidity (RH)'}
                </span>
                <span className="font-mono text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {params.humidity}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={params.humidity}
                onChange={(e) => setParams({ ...params, humidity: Number(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>20% ({language === 'so' ? 'Qallayl/Abaar' : 'Arid Desiccation'})</span>
                <span>70% ({language === 'so' ? 'Dhexdhexaad' : 'Favorable'})</span>
                <span>&gt;85% ({language === 'so' ? 'Fidid Fangas' : 'Fungal Spore Proliferation'})</span>
              </div>
            </div>

            {/* Slider 2: Ambient Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-700 font-medium flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                  {language === 'so' ? 'Heerkulka Hawada' : 'Ambient Air Temperature'}
                </span>
                <span className="font-mono text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {params.temperature}°C
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="42"
                value={params.temperature}
                onChange={(e) => setParams({ ...params, temperature: Number(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>10°C ({language === 'so' ? 'Qabow' : 'Cold Latency'})</span>
                <span>22-26°C ({language === 'so' ? 'Khatarta Caariyowga' : 'Blight Window'})</span>
                <span>&gt;36°C ({language === 'so' ? 'Kuleyl Sare' : 'Thermal Inactivation'})</span>
              </div>
            </div>

            {/* Slider 3: 7-Day Cumulative Rainfall */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-700 font-medium flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                  {language === 'so' ? 'Roobka 7-da Maalmood (Isu-geyn)' : 'Cumulative 7-Day Rainfall'}
                </span>
                <span className="font-mono text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {params.rainfall} mm
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="140"
                value={params.rainfall}
                onChange={(e) => setParams({ ...params, rainfall: Number(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>0 mm ({language === 'so' ? 'Abaar' : 'Drought'})</span>
                <span>35 mm ({language === 'so' ? 'Dhexdhexaad' : 'Moderate'})</span>
                <span>&gt;60 mm ({language === 'so' ? 'Roob Xooggan / Faafis' : 'Raindrop Splash Inoculation'})</span>
              </div>
            </div>

            {/* Slider 4: Rootzone Soil Moisture */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-700 font-medium flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-blue-600" />
                  {language === 'so' ? 'Qoyaanka Ciidda Xididka (0-15cm)' : 'Rootzone Soil Moisture (0-15cm depth)'}
                </span>
                <span className="font-mono text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {params.soilMoisture}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={params.soilMoisture}
                onChange={(e) => setParams({ ...params, soilMoisture: Number(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>10% ({language === 'so' ? 'Qalalan' : 'Wilting Point'})</span>
                <span>55% ({language === 'so' ? 'Wanaagsan' : 'Field Capacity'})</span>
                <span>&gt;80% ({language === 'so' ? 'Biyo Fadhiya' : 'Waterlogged Hypoxia'})</span>
              </div>
            </div>

            {/* Slider 5: Wind Speed */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-700 font-medium flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-indigo-600" />
                  {language === 'so' ? 'Xawaaraha Dabaysha' : 'Canopy Wind Speed'}
                </span>
                <span className="font-mono text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {params.windSpeed} km/h
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={params.windSpeed}
                onChange={(e) => setParams({ ...params, windSpeed: Number(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>0 km/h ({language === 'so' ? 'Deggan' : 'Calm'})</span>
                <span>15-25 km/h ({language === 'so' ? 'Dabayl Faafisa' : 'Spore Dispersal Breeze'})</span>
                <span>&gt;45 km/h ({language === 'so' ? 'Dabayl Xooggan' : 'Gale Wash'})</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Bayesian Probability Calculations, Gauge & Proof */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
            
            {/* Outbreak Probability Gauge Card */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-center space-y-3 shadow-2xs">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-500 font-semibold">
                {language === 'so' ? 'Khatarta Dambe ee Bayes (Posterior Risk):' : 'Updated Posterior Outbreak Risk:'} P({params.pathogenTarget} | Evidence)
              </span>
              
              <div className="flex items-center justify-center gap-3">
                <span className="text-5xl font-black text-slate-900 tracking-tight font-['Space_Grotesk']">
                  {(calculation.posteriorProbability * 100).toFixed(1)}%
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(calculation.posteriorProbability)}`}>
                  {language === 'so' ? (
                    calculation.riskCategory === 'Outbreak Imminent' ? 'Khatar Aad u Sarreysa' :
                    calculation.riskCategory === 'High Alert' ? 'Digtooni Sare' :
                    calculation.riskCategory === 'Guarded' ? 'Dhexdhexaad' : 'Aamin / Caadi'
                  ) : calculation.riskCategory}
                </span>
              </div>

              {/* Progress Bar Gauge */}
              <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${getGaugeColor(calculation.posteriorProbability)} transition-all duration-500`}
                  style={{ width: `${Math.min(100, Math.max(3, calculation.posteriorProbability * 100))}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1 font-semibold">
                <span>0% {language === 'so' ? 'Aamin' : 'Safe'}</span>
                <span>20% {language === 'so' ? 'Dhexdhexaad' : 'Guarded'}</span>
                <span>40% {language === 'so' ? 'Digtooni' : 'High Alert'}</span>
                <span>65%+ {language === 'so' ? 'Khatar Badan' : 'Outbreak Imminent'}</span>
              </div>
            </div>

            {/* Step-by-Step Bayesian Mathematical Formulation */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                {language === 'so' ? 'Talaabooyinka Xisaabinta Qaacidada Bayes' : 'Bayesian Updating Formula & Odds Decomposition'}
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Step 1: Prior */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-500 block font-semibold">
                    {language === 'so' ? 'Tallaabada 1: Prior Asalka' : 'Step 1: Baseline Prior Odds'}
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    P(D) = {(calculation.priorProbability * 100).toFixed(0)}%
                  </div>
                  <span className="text-[11px] text-slate-600 block mt-0.5">
                    Prior Odds = <strong className="font-mono text-emerald-800">{calculation.priorOdds}</strong>
                  </span>
                </div>

                {/* Step 2: Combined Likelihood Ratio */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-500 block font-semibold">
                    {language === 'so' ? 'Tallaabada 2: Isu-geynta LR' : 'Step 2: Combined Likelihood Ratio'}
                  </span>
                  <div className="text-sm font-bold text-amber-800 mt-0.5 font-mono">
                    LR = {calculation.likelihoodRatio}&times;
                  </div>
                  <span className="text-[11px] text-slate-600 block mt-0.5">
                    &prod; P(E<sub>i</sub>|D) / P(E<sub>i</sub>|&not;D)
                  </span>
                </div>

                {/* Step 3: Posterior Odds */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-500 block font-semibold">
                    {language === 'so' ? 'Tallaabada 3: Foomka Bayes' : 'Step 3: Bayes Theorem'}
                  </span>
                  <div className="text-xs font-mono text-slate-600 mt-0.5 truncate">
                    {calculation.priorOdds} &times; {calculation.likelihoodRatio}
                  </div>
                  <span className="text-sm font-bold text-teal-800 font-mono block mt-0.5">
                    Post Odds = {calculation.posteriorOdds}
                  </span>
                </div>

                {/* Step 4: Final Probability */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-500 block font-semibold">
                    {language === 'so' ? 'Tallaabada 4: Boqolleyda Dambe' : 'Step 4: Odds to Probability'}
                  </span>
                  <div className="text-xs font-mono text-slate-600 mt-0.5">
                    Odds / (1 + Odds)
                  </div>
                  <span className="text-sm font-bold text-emerald-700 font-mono block mt-0.5">
                    = {(calculation.posteriorProbability * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Individual Factor Contribution Table */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center justify-between">
                <span>{language === 'so' ? 'Saameynta Qodob Kasta (LR Breakdown):' : 'Evidence Feature Contribution (LR Breakdown):'}</span>
                <span className="text-[10px] font-mono font-normal text-slate-500">
                  {language === 'so' ? 'LR > 1 wuu kordhiyaa, < 1 wuu yareeyaa' : 'LR > 1 increases risk, < 1 reduces'}
                </span>
              </h3>
              
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {calculation.factorBreakdown.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900">{item.factor}:</span>
                        <span className="font-mono text-slate-600 font-medium">{item.observedValue}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{item.explanation}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                        item.impact === 'increases' 
                          ? 'bg-rose-100 text-rose-800' 
                          : item.impact === 'decreases'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {item.likelihoodRatio}&times;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Farm Actions & Transfer to AI Assistant */}
            <div className="bg-emerald-50/80 rounded-xl p-4 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  {language === 'so' ? 'Tallaabooyinka Beerfalashada ee Lagu Talinayo:' : 'Agronomic Intervention Protocols Triggered:'}
                </h4>
                <span className="text-[10px] text-emerald-800 font-mono font-semibold">
                  {language === 'so' ? 'Digniin Firfircoon' : 'Field Alert Active'}
                </span>
              </div>
              
              <ul className="space-y-1.5 text-xs text-emerald-950">
                {calculation.recommendedActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 border-t border-emerald-200 flex justify-end">
                <button
                  onClick={() => {
                    const fallbackCrop: CropDisease = activeCrop || {
                      id: 'custom-bayes-crop',
                      crop: params.cropType,
                      name: `${params.pathogenTarget} Outbreak Threat`,
                      scientificName: 'Agroclimatic Model Inference',
                      pathogenType: params.pathogenTarget === 'Viral Mosaic' ? 'Virus' : (params.pathogenTarget === 'Bacterial Spot' ? 'Bacteria' : 'Fungus'),
                      severity: calculation.riskCategory === 'Outbreak Imminent' ? 'Critical' : (calculation.riskCategory === 'High Alert' ? 'High' : 'Moderate'),
                      confidence: Number((calculation.posteriorProbability * 100).toFixed(1)),
                      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
                      description: `Bayesian Outbreak risk calculated at ${(calculation.posteriorProbability * 100).toFixed(1)}% (${calculation.riskCategory}).`,
                      symptoms: calculation.recommendedActions,
                      organicTreatment: calculation.recommendedActions,
                      preventativeMeasures: calculation.recommendedActions,
                      optimalConditions: {
                        tempRange: `${params.temperature}°C`,
                        humidityRange: `${params.humidity}%`,
                        riskTrigger: `Combined LR = ${calculation.likelihoodRatio}x`
                      }
                    };
                    onConsultAgronomist(fallbackCrop, calculation);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{language === 'so' ? 'U Dir Xogta Khatarta Khabiirka AI' : 'Send Risk Profile to Agronomist Chat'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
