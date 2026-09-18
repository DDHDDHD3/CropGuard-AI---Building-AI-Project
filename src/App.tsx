import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { DiseaseScanner } from './components/DiseaseScanner';
import { BayesianRiskModel } from './components/BayesianRiskModel';
import { AgronomistConsultant } from './components/AgronomistConsultant';
import { CourseReadmeSubmissionModal } from './components/CourseReadmeSubmissionModal';
import { CropDisease, Language } from './types';
import { 
  Award, 
  BookOpen, 
  Github, 
  ExternalLink, 
  Sparkles, 
  Sprout, 
  Stethoscope, 
  CloudSun, 
  MessageSquare 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'bayes' | 'chat' | 'readme'>('scanner');
  const [language, setLanguage] = useState<Language>('en');
  const [activeCrop, setActiveCrop] = useState<CropDisease | null>(null);

  const handleSelectForConsultation = (crop: CropDisease) => {
    setActiveCrop(crop);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Top Alert / Honors Notification Banner */}
      <div className="bg-emerald-950/60 border-b border-emerald-800/30 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-300">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>
              <strong className="text-white">Building AI Course Final Project:</strong> Interactive Prototype & Official README formatted for <span className="text-emerald-300 font-mono">@DDHDDHD3</span>
            </span>
          </div>

          <button
            onClick={() => setActiveTab('readme')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-semibold transition-colors cursor-pointer text-[11px]"
          >
            <Award className="w-3.5 h-3.5" />
            <span>View Submission README</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'scanner' && (
          <DiseaseScanner onSelectForConsultation={handleSelectForConsultation} />
        )}

        {activeTab === 'bayes' && (
          <BayesianRiskModel />
        )}

        {activeTab === 'chat' && (
          <AgronomistConsultant
            language={language}
            activeCrop={activeCrop}
          />
        )}

        {activeTab === 'readme' && (
          <CourseReadmeSubmissionModal />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900/60 border-t border-stone-800/80 py-8 px-4 sm:px-6 lg:px-8 text-xs text-stone-400 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white font-['Space_Grotesk']">
                CropGuard AI &bull; Building AI Course Project
              </div>
              <p className="text-[11px] text-stone-400">
                Created for the Elements of AI / Building AI Course (University of Helsinki & Reaktor)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <a
              href="https://github.com/DDHDDHD3"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-stone-300 hover:text-emerald-400 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Maintainer: Abdullahi Muse Isse (@DDHDDHD3)</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={() => setActiveTab('readme')}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              Submission Checklist
            </button>
          </div>

        </div>
      </footer>
    </div>
  );
}
