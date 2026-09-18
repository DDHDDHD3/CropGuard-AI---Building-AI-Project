import React from 'react';
import { Sprout, Github, Award, BookOpen, CloudSun, Stethoscope, MessageSquare } from 'lucide-react';
import { Language } from '../types';

interface NavbarProps {
  activeTab: 'scanner' | 'bayes' | 'chat' | 'readme';
  setActiveTab: (tab: 'scanner' | 'bayes' | 'chat' | 'readme') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage
}) => {
  return (
    <header className="bg-emerald-950/90 text-stone-100 backdrop-blur-md border-b border-emerald-800/40 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('scanner')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-900/40 text-emerald-950">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-['Space_Grotesk']">
                  CropGuard<span className="text-emerald-400 font-extrabold">.AI</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Award className="w-3 h-3 text-emerald-400" />
                  Building AI Final Project
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 hidden sm:block">
                Deep-Vision Pathology & Climate Resilience Advisor
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-emerald-900/40 p-1 rounded-xl border border-emerald-700/30">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'scanner'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-800/30'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              Leaf Scanner
            </button>
            <button
              onClick={() => setActiveTab('bayes')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'bayes'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-800/30'
              }`}
            >
              <CloudSun className="w-3.5 h-3.5" />
              Bayesian Climate Risk
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-800/30'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Agronomist AI
            </button>
            <button
              onClick={() => setActiveTab('readme')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'readme'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-amber-300 hover:text-amber-200 hover:bg-amber-900/20'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Course Submission (README)
            </button>
          </nav>

          {/* Right Action Items: Language & GitHub @DDHDDHD3 */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="flex items-center bg-emerald-900/60 rounded-lg p-1 border border-emerald-700/40 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  language === 'en' ? 'bg-emerald-600 text-white' : 'text-emerald-300/80 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('so')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  language === 'so' ? 'bg-emerald-600 text-white' : 'text-emerald-300/80 hover:text-white'
                }`}
                title="Af-Soomaali"
              >
                SO
              </button>
              <button
                onClick={() => setLanguage('sw')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  language === 'sw' ? 'bg-emerald-600 text-white' : 'text-emerald-300/80 hover:text-white'
                }`}
                title="Kiswahili"
              >
                SW
              </button>
            </div>

            {/* Author GitHub Profile */}
            <a
              href="https://github.com/DDHDDHD3"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 text-xs font-medium border border-stone-700/60 transition-colors shadow-sm"
              title="GitHub Profile: Abdullahi Muse Isse (@DDHDDHD3)"
            >
              <Github className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline font-mono">@DDHDDHD3</span>
            </a>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-emerald-800/30 text-xs">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-2.5 py-1 rounded-md font-medium ${
              activeTab === 'scanner' ? 'bg-emerald-600 text-white' : 'text-emerald-300/80'
            }`}
          >
            Scanner
          </button>
          <button
            onClick={() => setActiveTab('bayes')}
            className={`px-2.5 py-1 rounded-md font-medium ${
              activeTab === 'bayes' ? 'bg-emerald-600 text-white' : 'text-emerald-300/80'
            }`}
          >
            Bayes Risk
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-2.5 py-1 rounded-md font-medium ${
              activeTab === 'chat' ? 'bg-emerald-600 text-white' : 'text-emerald-300/80'
            }`}
          >
            Agronomist
          </button>
          <button
            onClick={() => setActiveTab('readme')}
            className={`px-2.5 py-1 rounded-md font-bold ${
              activeTab === 'readme' ? 'bg-amber-500 text-stone-950' : 'text-amber-300'
            }`}
          >
            README Plan
          </button>
        </div>

      </div>
    </header>
  );
};
