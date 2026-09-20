import React, { useState, useMemo } from 'react';
import { 
  ScanHistoryEntry, 
  Language, 
  CropDisease 
} from '../types';
import { getSeasonalPlantingTips } from '../utils/seasonalTips';
import { 
  Calendar, 
  Sprout, 
  ShieldAlert, 
  Leaf, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  CloudSun, 
  Compass,
  ChevronDown,
  ChevronUp,
  MessageSquarePlus,
  Layers
} from 'lucide-react';

interface SeasonalPlantingCardProps {
  history: ScanHistoryEntry[];
  language?: Language;
  onConsultAgronomist?: (crop: CropDisease) => void;
  onAskPlantingQuestion?: (query: string) => void;
}

const ALL_MONTHS = [
  { index: 0, label: { en: 'Jan', so: 'Jan', sw: 'Jan' } },
  { index: 1, label: { en: 'Feb', so: 'Feb', sw: 'Feb' } },
  { index: 2, label: { en: 'Mar', so: 'Maar', sw: 'Mac' } },
  { index: 3, label: { en: 'Apr', so: 'Abr', sw: 'Apr' } },
  { index: 4, label: { en: 'May', so: 'May', sw: 'Mei' } },
  { index: 5, label: { en: 'Jun', so: 'Juun', sw: 'Jun' } },
  { index: 6, label: { en: 'Jul', so: 'Luul', sw: 'Jul' } },
  { index: 7, label: { en: 'Aug', so: 'Ogo', sw: 'Ago' } },
  { index: 8, label: { en: 'Sep', so: 'Seb', sw: 'Sep' } },
  { index: 9, label: { en: 'Oct', so: 'Okt', sw: 'Okt' } },
  { index: 10, label: { en: 'Nov', so: 'Nof', sw: 'Nov' } },
  { index: 11, label: { en: 'Dec', so: 'Dis', sw: 'Des' } }
];

export const SeasonalPlantingCard: React.FC<SeasonalPlantingCardProps> = ({
  history,
  language = 'en',
  onConsultAgronomist,
  onAskPlantingQuestion
}) => {
  const currentSystemMonth = useMemo(() => new Date().getMonth(), []);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentSystemMonth);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Compute seasonal advice based on selected month & user scan history
  const advice = useMemo(() => {
    return getSeasonalPlantingTips(history, selectedMonth, language);
  }, [history, selectedMonth, language]);

  const isCurrentMonth = selectedMonth === currentSystemMonth;

  // Extract primary scanned crop object for quick consultation if clicked
  const primaryScannedCrop = useMemo(() => {
    if (history.length > 0 && history[0].disease) {
      return history[0].disease;
    }
    return null;
  }, [history]);

  const handleAskAI = (cropName?: string) => {
    const promptText = language === 'so'
      ? (cropName 
          ? `Waa maxay hababka ugu wanaagsan ee abuurka iyo diyaarinta carrada ee ${cropName} bisha ${advice.monthName}, gaar ahaan marka la eego diiwaankayaga caafimaad ee hore?`
          : `Marka la eego taariikhda beertayda iyo xilligan hadda ee ${advice.monthName} (${advice.seasonPhase}), maxay yihiin dalagyada wehelka ah iyo wareegga abuurka ee aan samaynayo toddobaadkan?`)
      : (cropName 
          ? `What are the best seasonal planting and soil preparation practices for ${cropName} during ${advice.monthName}, especially considering our historical crop health records?`
          : `Based on my farm's scan history and the current season in ${advice.monthName} (${advice.seasonPhase}), what companion crops and planting rotation should I implement this week?`);

    if (onAskPlantingQuestion) {
      onAskPlantingQuestion(promptText);
    } else if (onConsultAgronomist && primaryScannedCrop) {
      onConsultAgronomist(primaryScannedCrop);
    }
  };

  return (
    <div 
      id="seasonal-planting-tips-card"
      className="bg-white rounded-2xl border border-emerald-100/90 shadow-sm overflow-hidden transition-all duration-200"
    >
      {/* Card Header */}
      <div className="bg-gradient-to-r from-emerald-50/80 via-emerald-50/30 to-amber-50/40 p-4 sm:p-5 border-b border-emerald-100/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Title & Season Identification */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{advice.monthName}</span>
                  {isCurrentMonth && (
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-200/80 px-1 rounded ml-0.5">
                      {language === 'so' ? 'Bishan' : 'Current'}
                    </span>
                  )}
                </span>
                
                <span className="text-xs text-slate-500 font-medium hidden md:inline">
                  &bull; {advice.seasonPhase}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk'] tracking-tight mt-1">
                {language === 'so' 
                  ? 'Tilmaamaha Abuurka Xilliyada & Wareegga Dalagga' 
                  : 'Seasonal Planting & Crop Rotation Guide'}
              </h2>
            </div>
          </div>

          {/* Month Selector Pills & Collapse Button */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Quick Month Selector Dropdown / Pills */}
            <div className="flex items-center gap-1 bg-white/80 p-1 rounded-xl border border-slate-200/80 text-xs shadow-2xs">
              <Compass className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-transparent text-slate-700 font-semibold py-1 px-2 rounded-lg focus:outline-none cursor-pointer text-xs"
                title={language === 'so' ? 'Dooro Bisha' : 'Select Month to View Seasonal Planting Advice'}
              >
                {ALL_MONTHS.map((m) => (
                  <option key={m.index} value={m.index}>
                    {m.label[language] || m.label.en} {m.index === currentSystemMonth ? (language === 'so' ? '(Hadda)' : '(Now)') : ''}
                  </option>
                ))}
              </select>
              {selectedMonth !== currentSystemMonth && (
                <button
                  onClick={() => setSelectedMonth(currentSystemMonth)}
                  className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] transition-colors cursor-pointer"
                  title="Return to Current Month"
                >
                  {language === 'so' ? 'Bishan' : 'Current'}
                </button>
              )}
            </div>

            {/* Collapse / Expand Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-xl hover:bg-white text-slate-500 hover:text-slate-700 border border-slate-200/60 transition-colors cursor-pointer"
              title={isExpanded ? (language === 'so' ? 'Laab' : 'Collapse') : (language === 'so' ? 'Fur' : 'Expand')}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* History Context Chips */}
        <div className="mt-3 pt-3 border-t border-emerald-100/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 text-slate-600">
            <span className="font-semibold text-slate-700 flex items-center gap-1 text-[11px]">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              {language === 'so' ? 'Dalagyada La Falanqeeyay:' : 'History Analyzed:'}
            </span>
            {advice.scannedCropsAnalyzed.map((crop, idx) => (
              <span 
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-[11px] font-medium text-slate-700 shadow-2xs"
              >
                {crop}
              </span>
            ))}
            {advice.detectedPathogens.length > 0 && (
              <span className="text-[11px] text-slate-400 ml-1">
                {language === 'so' 
                  ? `(${advice.detectedPathogens.join(', ')} cudur oo la helay)` 
                  : `(${advice.detectedPathogens.join(', ')} patterns detected)`}
              </span>
            )}
          </div>

          <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
            <CloudSun className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{advice.climateContext.slice(0, 80)}...</span>
          </div>
        </div>
      </div>

      {/* Expandable Content Area */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* Crop Rotation Alert / Pathogen Warning Banner if user's scan history revealed pathogens */}
          {advice.rotationWarning && (
            <div className="rounded-xl p-3.5 bg-amber-50/90 border border-amber-200/90 flex items-start gap-3 text-xs text-amber-950">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800 bg-amber-200/70 px-1.5 py-0.2 rounded mr-1.5">
                  {language === 'so' ? 'Digniin Beeraha ah' : 'Agronomic Warning'}
                </span>
                <span className="text-slate-800 font-medium">
                  {advice.rotationWarning}
                </span>
              </div>
            </div>
          )}

          {/* 2-Column Responsive Grid: Recommended Sowing + Actionable Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Column 1: Sowing Recommendations for this Month */}
            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-200/60">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                    {language === 'so' 
                      ? `Lagu Taliyay in La Abuuro Bisha ${advice.monthName}` 
                      : `Recommended to Sow in ${advice.monthName}`}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {language === 'so' ? 'Muddada bislaanshaha' : 'Maturity window'}
                  </span>
                </div>

                <div className="space-y-2">
                  {advice.recommendedSowingList.map((item, idx) => (
                    <div 
                      key={idx}
                      className="bg-white rounded-lg p-2.5 border border-slate-200/60 flex items-start justify-between gap-2 shadow-2xs hover:border-emerald-300 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item.crop}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug pl-5">
                          {item.reason}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                        {item.maturityDays}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Push to chat prompt button */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex justify-end">
                <button
                  onClick={() => handleAskAI()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>
                    {language === 'so' 
                      ? 'Weydii Khabiirka AI waqtiga abuurka' 
                      : 'Ask AI Agronomist about sowing schedules'}
                  </span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Column 2: Specific Tips Tailored to History */}
            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-200/60">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    {language === 'so' ? 'Talooyin Muhiim u ah Dalagyadaada' : 'Actionable Tips for Your Crops'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {language === 'so' ? 'Ku saleysan baaritaannadaada' : 'Personalized to scans'}
                  </span>
                </div>

                <div className="space-y-2">
                  {advice.topTips.map((tip, idx) => (
                    <div 
                      key={idx}
                      className="bg-white rounded-lg p-2.5 border border-slate-200/60 shadow-2xs hover:border-amber-300 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900">
                          {tip.title}
                        </span>
                        {tip.badge && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            tip.category === 'rotation' 
                              ? 'bg-rose-50 text-rose-800 border border-rose-200' 
                              : tip.category === 'pest_prevention'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}>
                            {tip.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {tip.description}
                      </p>
                      {tip.recommendedCrops && tip.recommendedCrops.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          <span className="text-[10px] text-slate-400">
                            {language === 'so' ? 'Noocyada:' : 'Varieties:'}
                          </span>
                          {tip.recommendedCrops.map((rc, rIdx) => (
                            <span key={rIdx} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                              {rc}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Companion Sowing Strip */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-2 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-950 font-medium">
                    <Leaf className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>
                      <strong>{language === 'so' ? 'Dalagyada Isku Habboon:' : 'Companion Pairing:'}</strong> {advice.companionPairing.main} + {advice.companionPairing.companion}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-800 hidden sm:inline">
                    {advice.companionPairing.benefit}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
