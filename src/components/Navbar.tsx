import React from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Camera, 
  Activity, 
  MessageSquare, 
  FileText, 
  Github, 
  CheckCircle2,
  Radio
} from 'lucide-react';
import { Language } from '../types';

interface NavbarProps {
  activeTab: 'dashboard' | 'scanner' | 'bayes' | 'chat' | 'readme';
  setActiveTab: (tab: 'dashboard' | 'scanner' | 'bayes' | 'chat' | 'readme') => void;
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
    <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-3">
          
          {/* Authentic Brand Identity & Institutional Logo */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer select-none group" 
            onClick={() => setActiveTab('dashboard')}
          >
            {/* Real SVG Vector Emblem: Agricultural Shield + Bio-Diagnostic Leaf */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-emerald-900 flex items-center justify-center text-white shrink-0 shadow-xs border border-emerald-800">
              <svg 
                className="w-6 h-6 text-emerald-400" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="#064e3b" stroke="#059669" />
                <path d="M12 8c-2.5 0-4 1.8-4 4 0 3 4 6 4 6s4-3 4-6c0-2.2-1.5-4-4-4z" fill="#10b981" stroke="#34d399" strokeWidth="1.5" />
                <path d="M12 11v4" stroke="#ffffff" strokeWidth="1.5" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-950 font-['Space_Grotesk']">
                  CropGuard
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 font-mono">
                  PHA-IS
                </span>
                <span className="hidden xl:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  {language === 'so' ? 'Nidaamka Caafimaadka Dalagga' : 'Phytosanitary Early Warning'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                {language === 'so' 
                  ? 'Kormeerka Caafimaadka Dalagga & Xogta Cimilada Beeraha'
                  : language === 'sw'
                  ? 'Mfumo wa Utambuzi wa Afya ya Mimea & Tabianchi ya Kilimo'
                  : 'Plant Health & Agrometeorological Information System'}
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/90 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              {language === 'so' ? 'Diiwaanka Kormeerka' : language === 'sw' ? 'Kituo cha Ufuatiliaji' : 'Field Surveillance'}
            </button>

            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'scanner'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              {language === 'so' ? 'Baaraha Cudurrada' : language === 'sw' ? 'Utambuzi wa Magonjwa' : 'Pathology Scanner'}
            </button>

            <button
              onClick={() => setActiveTab('bayes')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'bayes'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              {language === 'so' ? 'Khatarta Cimilada (Bayes)' : language === 'sw' ? 'Muundo wa Hatari ya Bayes' : 'Epidemiological Risk Model'}
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {language === 'so' ? 'La-taliyaha Beeraha' : language === 'sw' ? 'Mshauri wa Kilimo' : 'Agronomic Advisory'}
            </button>

            <button
              onClick={() => setActiveTab('readme')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'readme'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              {language === 'so' ? 'Xogta Nidaamka & Tixraaca' : language === 'sw' ? 'Mwongozo wa Kiufundi' : 'Methodology & Specs'}
            </button>
          </nav>

          {/* Right Action Items: Language Switcher & Verified System Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  language === 'en' ? 'bg-emerald-800 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('so')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  language === 'so' ? 'bg-emerald-800 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Af-Soomaali"
              >
                SO
              </button>
              <button
                onClick={() => setLanguage('sw')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  language === 'sw' ? 'bg-emerald-800 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Kiswahili"
              >
                SW
              </button>
            </div>

            {/* Author / Institutional Repository Badge */}
            <a
              href="https://github.com/DDHDDHD3"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors"
              title="Repository Maintainer: Abdullahi Muse Isse (@DDHDDHD3)"
            >
              <Github className="w-3.5 h-3.5 text-slate-700" />
              <span className="hidden sm:inline font-mono">@DDHDDHD3</span>
            </a>
          </div>

        </div>

        {/* Mobile Navigation Sub-bar */}
        <div className="flex lg:hidden items-center justify-between py-2 border-t border-slate-200 text-xs overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1.5 rounded-md font-medium cursor-pointer flex items-center gap-1 shrink-0 ${
              activeTab === 'dashboard' ? 'bg-emerald-800 text-white' : 'text-slate-700'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            {language === 'so' ? 'Kormeerka' : 'Surveillance'}
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-2.5 py-1.5 rounded-md font-medium cursor-pointer flex items-center gap-1 shrink-0 ${
              activeTab === 'scanner' ? 'bg-emerald-800 text-white' : 'text-slate-700'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            {language === 'so' ? 'Baaraha' : 'Scanner'}
          </button>
          <button
            onClick={() => setActiveTab('bayes')}
            className={`px-2.5 py-1.5 rounded-md font-medium cursor-pointer shrink-0 ${
              activeTab === 'bayes' ? 'bg-emerald-800 text-white' : 'text-slate-700'
            }`}
          >
            {language === 'so' ? 'Khatarta Bayes' : 'Bayes Model'}
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-2.5 py-1.5 rounded-md font-medium cursor-pointer shrink-0 ${
              activeTab === 'chat' ? 'bg-emerald-800 text-white' : 'text-slate-700'
            }`}
          >
            {language === 'so' ? 'La-taliye' : 'Advisory'}
          </button>
          <button
            onClick={() => setActiveTab('readme')}
            className={`px-2.5 py-1.5 rounded-md font-bold cursor-pointer shrink-0 ${
              activeTab === 'readme' ? 'bg-slate-800 text-white' : 'text-slate-600'
            }`}
          >
            {language === 'so' ? 'Xogta' : 'Specs'}
          </button>
        </div>

      </div>
    </header>
  );
};
