import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { DiseaseScanner } from './components/DiseaseScanner';
import { BayesianRiskModel } from './components/BayesianRiskModel';
import { AgronomistConsultant } from './components/AgronomistConsultant';
import { CourseReadmeSubmissionModal } from './components/CourseReadmeSubmissionModal';
import { CropDisease, Language, BayesCalculation } from './types';
import { 
  Award, 
  BookOpen, 
  Github, 
  ExternalLink, 
  Sparkles, 
  Sprout, 
  Stethoscope, 
  CloudSun, 
  MessageSquare,
  LayoutDashboard
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scanner' | 'bayes' | 'chat' | 'readme'>('dashboard');
  const [language, setLanguage] = useState<Language>('so');
  const [activeCrop, setActiveCrop] = useState<CropDisease | null>(null);
  const [activeBayesRisk, setActiveBayesRisk] = useState<BayesCalculation | null>(null);
  const [initialChatQuery, setInitialChatQuery] = useState<string>('');
  const [activeWeatherForBayes, setActiveWeatherForBayes] = useState<{
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
  } | null>(null);

  const handleSelectForConsultation = (crop: CropDisease) => {
    setActiveCrop(crop);
    setActiveTab('chat');
  };

  const handleAskPlantingQuestion = (query: string) => {
    setInitialChatQuery(query);
    setActiveTab('chat');
  };

  const handleSendToBayes = (crop: CropDisease) => {
    setActiveCrop(crop);
    setActiveTab('bayes');
  };

  const handleSendToBayesWithWeather = (weather: { temperature: number; humidity: number; rainfall: number; windSpeed: number }) => {
    setActiveWeatherForBayes(weather);
    setActiveTab('bayes');
  };

  const handleConsultFromBayes = (crop: CropDisease, calculation: BayesCalculation) => {
    setActiveCrop(crop);
    setActiveBayesRisk(calculation);
    setActiveTab('chat');
  };

  const handleOpenInScanner = (crop: CropDisease) => {
    setActiveCrop(crop);
    setActiveTab('scanner');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Institutional Operational Status Bar */}
      <div className="bg-slate-900 text-slate-300 border-b border-slate-800 px-4 py-2 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-sans">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {language === 'so' ? 'Nidaamku Wuu Shaqaynayaa' : 'OPERATIONAL STATUS: NORMAL'}
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400">
              {language === 'so' 
                ? 'Isha Cimilada: Open-Meteo Synoptic (WMO #63260)' 
                : 'Meteorological Telemetry: Open-Meteo Synoptic Feed (WMO #63260)'}
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden lg:inline">
              {language === 'so'
                ? 'Diiwaanka Cudurrada: EPPO & FAO Plant Health Standards'
                : 'Pathology Registry: EPPO Global Standard & FAO Guidelines'}
            </span>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              {language === 'so' ? 'Aagga: Geeska Afrika' : 'Zone: East Africa & Horn'}
            </span>
            <button
              onClick={() => setActiveTab('readme')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-sans font-medium transition-colors cursor-pointer text-[11px]"
            >
              <BookOpen className="w-3 h-3 text-emerald-400" />
              <span>{language === 'so' ? 'Dukumeentiga Farsamada' : 'System Methodology & Specs'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            onScanNewLeaf={() => setActiveTab('scanner')}
            onOpenInScanner={handleOpenInScanner}
            onSendToBayes={handleSendToBayes}
            onConsultAgronomist={handleSelectForConsultation}
            language={language}
            onAskPlantingQuestion={handleAskPlantingQuestion}
            onSendToBayesWithWeather={handleSendToBayesWithWeather}
          />
        )}

        {activeTab === 'scanner' && (
          <DiseaseScanner 
            activeCrop={activeCrop}
            onViewDashboard={() => setActiveTab('dashboard')}
            onSelectForConsultation={handleSelectForConsultation} 
            onSendToBayes={handleSendToBayes}
            language={language}
          />
        )}

        {activeTab === 'bayes' && (
          <BayesianRiskModel 
            activeCrop={activeCrop}
            onConsultAgronomist={handleConsultFromBayes}
            language={language}
            initialWeather={activeWeatherForBayes}
          />
        )}

        {activeTab === 'chat' && (
          <AgronomistConsultant
            language={language}
            activeCrop={activeCrop}
            activeBayesRisk={activeBayesRisk}
            initialQuery={initialChatQuery}
          />
        )}

        {activeTab === 'readme' && (
          <CourseReadmeSubmissionModal language={language} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-600 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs">
              <Sprout className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="font-bold text-slate-900 font-['Space_Grotesk'] text-sm">
                CropGuard AI &bull; {language === 'so' ? 'Mashruuca Koorsada Building AI' : 'Building AI Course Project'}
              </div>
              <p className="text-[11px] text-slate-500">
                {language === 'so' 
                  ? 'Waxaa loo diyaariyay Koorsada Elements of AI / Building AI (Jaamacadda Helsinki & Reaktor)'
                  : 'Created for the Elements of AI / Building AI Course (University of Helsinki & Reaktor)'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <a
              href="https://github.com/DDHDDHD3"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-700 hover:text-emerald-700 transition-colors font-medium"
            >
              <Github className="w-4 h-4 text-slate-800" />
              <span>{language === 'so' ? 'Qoraaga: ' : 'Maintainer: '}Abdullahi Muse Isse (@DDHDDHD3)</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              onClick={() => setActiveTab('readme')}
              className="text-amber-800 hover:text-amber-900 hover:underline font-semibold cursor-pointer"
            >
              {language === 'so' ? 'Liiska Hubinta README' : 'Submission Checklist'}
            </button>
          </div>

        </div>
      </footer>
    </div>
  );
}
