import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  CloudRain, 
  Sun, 
  CloudLightning, 
  Wind, 
  Droplets, 
  Thermometer, 
  Compass, 
  RefreshCw, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  Radio, 
  Sliders, 
  Activity, 
  ExternalLink,
  ChevronDown,
  Info,
  Calendar,
  CloudFog
} from 'lucide-react';
import { WeatherCondition, ClimateSmartAdvisory, Language } from '../types';
import { 
  PRESET_FARMING_REGIONS, 
  WeatherPresetLocation, 
  fetchLiveWeather, 
  getMockWeather, 
  generateClimateSmartAdvisory,
  decodeWmoCode
} from '../services/weatherService';

interface ClimateSmartWeatherCardProps {
  language?: Language;
  onSendToBayesWithWeather?: (weather: { temperature: number; humidity: number; rainfall: number; windSpeed: number }) => void;
  onAskWeatherQuestion?: (question: string) => void;
}

export const ClimateSmartWeatherCard: React.FC<ClimateSmartWeatherCardProps> = ({
  language = 'en',
  onSendToBayesWithWeather,
  onAskWeatherQuestion
}) => {
  const [selectedRegion, setSelectedRegion] = useState<WeatherPresetLocation>(PRESET_FARMING_REGIONS[0]);
  const [weather, setWeather] = useState<WeatherCondition>(() => getMockWeather());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeSimulationMode, setActiveSimulationMode] = useState<'live' | 'standard' | 'high_humidity' | 'arid_heat' | 'stormy'>('live');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Load weather when selected region or simulation mode changes
  const loadWeather = async (region: WeatherPresetLocation, simMode: typeof activeSimulationMode) => {
    setIsLoading(true);
    setLocationError(null);

    if (simMode !== 'live') {
      const mock = getMockWeather(region.lat, region.lon, region.name, region.region, region.country, simMode);
      setWeather(mock);
      setIsLoading(false);
      return;
    }

    try {
      const liveData = await fetchLiveWeather(region.lat, region.lon, region.name, region.region, region.country);
      setWeather(liveData);
    } catch (err) {
      console.error('Error fetching live weather:', err);
      const fallback = getMockWeather(region.lat, region.lon, region.name, region.region, region.country);
      setWeather(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(selectedRegion, activeSimulationMode);
  }, [selectedRegion, activeSimulationMode]);

  // Handle GPS location detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(language === 'so' ? 'Qalabkaagu ma taageero GPS-ka' : 'Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const customRegion: WeatherPresetLocation = {
          id: 'custom_gps',
          name: language === 'so' ? 'Goobtaada Hadda (GPS)' : 'Your Current Location (GPS)',
          region: `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`,
          country: 'Local',
          lat: latitude,
          lon: longitude
        };
        setSelectedRegion(customRegion);
        setActiveSimulationMode('live');
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setLocationError(
          language === 'so' 
            ? 'Lama heli karo goobta GPS. Fadlan hubi rukhsadda ama dooro aagagga beerta.' 
            : 'Could not access GPS location. Please check browser permissions or select a farming region below.'
        );
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  const advisory: ClimateSmartAdvisory = generateClimateSmartAdvisory(weather, language);

  const getWeatherIcon = (code: number) => {
    const { conditionType } = decodeWmoCode(code);
    switch (conditionType) {
      case 'clear':
        return <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />;
      case 'partly_cloudy':
        return <CloudSun className="w-8 h-8 text-amber-500" />;
      case 'cloudy':
        return <CloudSun className="w-8 h-8 text-slate-500" />;
      case 'fog':
        return <CloudFog className="w-8 h-8 text-slate-400" />;
      case 'rain':
        return <CloudRain className="w-8 h-8 text-sky-500 animate-bounce-subtle" />;
      case 'thunderstorm':
        return <CloudLightning className="w-8 h-8 text-indigo-500" />;
      default:
        return <CloudSun className="w-8 h-8 text-amber-500" />;
    }
  };

  // Quick Action: Send to Bayes
  const handleLoadInBayes = () => {
    if (onSendToBayesWithWeather) {
      onSendToBayesWithWeather({
        temperature: Math.round(weather.temperature),
        humidity: Math.round(weather.humidity),
        rainfall: Math.round(weather.precipitation * 7), // 7-day cumulative estimate
        windSpeed: Math.round(weather.windSpeed)
      });
    }
  };

  // Quick Action: Consult Agronomist
  const handleConsultAgronomist = () => {
    const query = language === 'so'
      ? `Waxaan beerta ku hayaa cimilo: Heerkul ${weather.temperature}°C, Qoyaan ${weather.humidity}%, Roob ${weather.precipitation} mm, Dabayl ${weather.windSpeed} km/h goobta ${weather.locationName}. Waa maxay talooyinka cimilada-fudud ee aan maanta u baahanahay si aan u difaaco dalagyada?`
      : `My current local weather conditions at ${weather.locationName} are: Temperature ${weather.temperature}°C, Humidity ${weather.humidity}%, Precipitation ${weather.precipitation} mm, Wind ${weather.windSpeed} km/h (${weather.weatherDescription}). What climate-smart crop management steps should I implement immediately?`;

    if (onAskWeatherQuestion) {
      onAskWeatherQuestion(query);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
      
      {/* Top Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-800 border border-slate-300">
              <CloudSun className="w-3.5 h-3.5 text-emerald-800" />
              <span>{language === 'so' ? 'Kormeerka Cimilada Beeraha' : 'Agrometeorological Telemetry'}</span>
            </span>

            {weather.source === 'live_api' ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>{language === 'so' ? 'Toos: Open-Meteo Synoptic' : 'Feed: Open-Meteo Synoptic'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                <Radio className="w-3 h-3 text-slate-600" />
                <span>{language === 'so' ? 'Qalabka Tijaabada / Telemetry' : 'Calibration Telemetry'}</span>
              </span>
            )}

            <span className="text-xs text-slate-500 font-mono">
              WMO Ref: {selectedRegion.lat.toFixed(2)}N, {selectedRegion.lon.toFixed(2)}E
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <span>{language === 'so' ? 'Xogta Cimilada Beerta & Falanqaynta Khatarta' : 'Local Microclimate Parameters & Phytosanitary Advisories'}</span>
          </h2>
        </div>

        {/* Location Selector & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Location Picker */}
          <div className="relative">
            <select
              value={selectedRegion.id}
              onChange={(e) => {
                const found = PRESET_FARMING_REGIONS.find(r => r.id === e.target.value);
                if (found) setSelectedRegion(found);
              }}
              className="pl-7 pr-7 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-300 text-slate-800 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors cursor-pointer appearance-none"
              title={language === 'so' ? 'Dooro aagga beerta' : 'Select Agricultural Zone'}
            >
              {PRESET_FARMING_REGIONS.map(reg => (
                <option key={reg.id} value={reg.id}>
                  {reg.name} ({reg.country})
                </option>
              ))}
              {selectedRegion.id === 'custom_gps' && (
                <option value="custom_gps">
                  {selectedRegion.name}
                </option>
              )}
            </select>
            <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* GPS Auto-detect Button */}
          <button
            onClick={handleDetectLocation}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            title={language === 'so' ? 'Isticmaal Goobtayda GPS' : 'Detect My Local Coordinates'}
          >
            <MapPin className={`w-3.5 h-3.5 text-emerald-600 ${isLocating ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline">{isLocating ? (language === 'so' ? 'Raadinaya...' : 'Locating...') : (language === 'so' ? 'GPS-kayga' : 'My GPS')}</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => loadWeather(selectedRegion, activeSimulationMode)}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
            title={language === 'so' ? 'Dib u cusboonaysii' : 'Refresh Weather'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {locationError && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Main Meteorological Dashboard Body */}
      <div className="p-4 sm:p-6 space-y-6">
        
        {/* Real-Time Telemetry Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* Main Weather Metric Box (Left: 5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{weather.locationName}</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {weather.region}, {weather.country} &bull; <span className="font-mono text-[11px]">{weather.latitude.toFixed(2)}°, {weather.longitude.toFixed(2)}°</span>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                {getWeatherIcon(weather.weatherCode)}
              </div>
            </div>

            <div className="flex items-baseline gap-3 my-3">
              <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono tracking-tight">
                {weather.temperature.toFixed(1)}°
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">
                  {weather.weatherDescription}
                </span>
                <span className="text-xs text-slate-500">
                  {language === 'so' ? 'Laga dareemayo' : 'Feels like'} {weather.apparentTemperature.toFixed(1)}°C
                </span>
              </div>
            </div>

            {/* 4 Sensor Telemetry Indicators */}
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100 text-xs">
              <div className="p-2 rounded-xl bg-slate-50 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">{language === 'so' ? 'Qoyaanka' : 'Humidity'}</div>
                  <div className="font-bold text-slate-800 font-mono">{weather.humidity}% RH</div>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">{language === 'so' ? 'Dabaysha' : 'Wind Speed'}</div>
                  <div className="font-bold text-slate-800 font-mono">{weather.windSpeed} km/h</div>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">{language === 'so' ? 'Roobka' : 'Precipitation'}</div>
                  <div className="font-bold text-slate-800 font-mono">{weather.precipitation} mm</div>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">{language === 'so' ? 'Suurtagalnimada' : 'Rain Chance'}</div>
                  <div className="font-bold text-slate-800 font-mono">{weather.precipitationProbability}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Climate-Smart Advisory Quadrants (Right: 7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* 1. Spray Window Feasibility */}
            <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
              advisory.sprayWindow.status === 'Optimal' 
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : advisory.sprayWindow.status === 'Caution'
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : 'bg-rose-50/70 border-rose-200 text-rose-950'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    <span>{language === 'so' ? 'Fursadda Buufinta Daawada' : 'Spray Window Feasibility'}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    advisory.sprayWindow.status === 'Optimal'
                      ? 'bg-emerald-200 text-emerald-800'
                      : advisory.sprayWindow.status === 'Caution'
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-rose-200 text-rose-900'
                  }`}>
                    {advisory.sprayWindow.status === 'Optimal'
                      ? (language === 'so' ? 'Ku Habboon' : 'Optimal')
                      : advisory.sprayWindow.status === 'Caution'
                      ? (language === 'so' ? 'Taxadir' : 'Caution')
                      : (language === 'so' ? 'Aan Habboonayn' : 'Unfavorable')}
                  </span>
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {advisory.sprayWindow.reason}
                </p>
              </div>
              <div className="text-[10px] font-medium opacity-75 mt-2">
                {language === 'so' ? 'Xaddid dabaysha <15 km/h & roob la\'aan' : 'Optimal threshold: Wind < 15 km/h & no rain'}
              </div>
            </div>

            {/* 2. Fungal / Blight Risk Index */}
            <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
              advisory.fungalRisk.level === 'Severe' || advisory.fungalRisk.level === 'High'
                ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                : advisory.fungalRisk.level === 'Moderate'
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{language === 'so' ? 'Khatarta Caariyowga Fangaska' : 'Fungal Sporulation Risk'}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    advisory.fungalRisk.level === 'Severe' || advisory.fungalRisk.level === 'High'
                      ? 'bg-rose-200 text-rose-900'
                      : advisory.fungalRisk.level === 'Moderate'
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-emerald-200 text-emerald-900'
                  }`}>
                    {advisory.fungalRisk.level === 'Severe' 
                      ? (language === 'so' ? 'Aad u Halis' : 'Severe')
                      : advisory.fungalRisk.level === 'High'
                      ? (language === 'so' ? 'Sareysa' : 'High')
                      : advisory.fungalRisk.level === 'Moderate'
                      ? (language === 'so' ? 'Dhexdhexaad' : 'Moderate')
                      : (language === 'so' ? 'Yar' : 'Low')}
                  </span>
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {advisory.fungalRisk.description}
                </p>
              </div>
              <div className="text-[10px] font-medium opacity-75 mt-2">
                {language === 'so' ? `Qoyaanka: ${weather.humidity}% & Heerkulka: ${weather.temperature}°C` : `RH: ${weather.humidity}% & Temp: ${weather.temperature}°C`}
              </div>
            </div>

            {/* 3. Evapotranspiration & Irrigation Demand */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-700">
                    <Droplets className="w-3.5 h-3.5 text-sky-600" />
                    <span>{language === 'so' ? 'Baahida Waraabka' : 'Irrigation Demand'}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    advisory.irrigationDemand.level === 'High'
                      ? 'bg-amber-100 text-amber-800'
                      : advisory.irrigationDemand.level === 'Low'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {advisory.irrigationDemand.level === 'High'
                      ? (language === 'so' ? 'Sareysa' : 'High')
                      : advisory.irrigationDemand.level === 'Low'
                      ? (language === 'so' ? 'Yar' : 'Low')
                      : (language === 'so' ? 'Caadi' : 'Moderate')}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-600">
                  {advisory.irrigationDemand.advice}
                </p>
              </div>
              <div className="text-[10px] text-slate-400 mt-2">
                {language === 'so' ? 'Ku salaysan uumibaxa carrada' : 'Calibrated to evapotranspiration'}
              </div>
            </div>

            {/* 4. Pest Vector Swarm Alert */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-700">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{language === 'so' ? 'Dhaqdhaqaaqa Cayayaanka' : 'Pest Vector Activity'}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    advisory.pestVectorRisk.level === 'High'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {advisory.pestVectorRisk.level === 'High'
                      ? (language === 'so' ? 'Khatar Cayayaan' : 'High Risk')
                      : (language === 'so' ? 'Deggan' : 'Stable')}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-600">
                  {advisory.pestVectorRisk.alert}
                </p>
              </div>
              <div className="text-[10px] text-slate-400 mt-2">
                {language === 'so' ? 'Kormeer duqsiga cad & shilinta' : 'Monitors Whitefly / Aphid vector conditions'}
              </div>
            </div>

          </div>
        </div>

        {/* Action Banner: Key Agrometeorological Action Today */}
        <div className="p-4 rounded-2xl bg-emerald-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center shrink-0 border border-emerald-700">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
                {language === 'so' ? 'Talo-bixinta Muhiimka ah ee Maanta' : 'Key Microclimate Action Required'}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-emerald-50 mt-0.5">
                {advisory.keyAction}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            {onSendToBayesWithWeather && (
              <button
                onClick={handleLoadInBayes}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                title={language === 'so' ? 'Ku xisaabi Qaabka Bayesian' : 'Load into Bayesian Inference Model'}
              >
                <span>{language === 'so' ? 'Tijaabi Model-ka Bayes' : 'Test in Bayes Model'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {onAskWeatherQuestion && (
              <button
                onClick={handleConsultAgronomist}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-200 border border-emerald-700/60 font-semibold text-xs transition-colors cursor-pointer"
                title={language === 'so' ? 'Weydii Khabiirka AI cimiladan' : 'Consult AI Agronomist on this Weather'}
              >
                <span>{language === 'so' ? 'Weydii Khabiirka' : 'Ask Agronomist'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 5-Day Agricultural Forecast Strip */}
        {weather.dailyForecast && weather.dailyForecast.length > 0 && (
          <div className="pt-2 border-t border-slate-200/70">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'so' ? 'Saadaasha 5-ta Maalmood ee Beerta' : '5-Day Agricultural Weather Outlook'}</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {language === 'so' ? 'Heerkulka & Roobka' : 'Max/Min Temp & Rain Accumulation'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {weather.dailyForecast.map((day, idx) => (
                <div 
                  key={idx} 
                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-between ${
                    idx === 0 
                      ? 'bg-emerald-50/80 border-emerald-300' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="text-[11px] font-bold text-slate-700">
                    {idx === 0 ? (language === 'so' ? 'Maanta' : 'Today') : day.dayName}
                  </div>
                  <div className="my-1.5">
                    {getWeatherIcon(day.weatherCode)}
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-800">
                    {day.tempMax}° <span className="text-slate-400 font-normal">/ {day.tempMin}°</span>
                  </div>
                  <div className="text-[10px] text-sky-700 font-semibold mt-0.5 flex items-center gap-0.5">
                    <Droplets className="w-2.5 h-2.5" />
                    <span>{day.precipitationSum} mm</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Simulation & Sensor Testing Controls */}
        <div className="bg-slate-100/90 rounded-xl p-3 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="font-semibold text-slate-700">
              {language === 'so' ? 'Tijaabi Xaalado Cimilo oo Kale (Field Scenarios):' : 'Interactive Weather Scenarios:'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveSimulationMode('live')}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                activeSimulationMode === 'live'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              {language === 'so' ? 'Toos (Open-Meteo)' : 'Live API'}
            </button>
            <button
              onClick={() => setActiveSimulationMode('high_humidity')}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                activeSimulationMode === 'high_humidity'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              {language === 'so' ? 'Qoyaan / Roob Sare' : 'High Humidity / Rain'}
            </button>
            <button
              onClick={() => setActiveSimulationMode('arid_heat')}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                activeSimulationMode === 'arid_heat'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              {language === 'so' ? 'Kuleyl Qallalan (35°C)' : 'Arid Heatwave'}
            </button>
            <button
              onClick={() => setActiveSimulationMode('stormy')}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                activeSimulationMode === 'stormy'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              {language === 'so' ? 'Dabayl & Duufaan' : 'Storm / High Wind'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
