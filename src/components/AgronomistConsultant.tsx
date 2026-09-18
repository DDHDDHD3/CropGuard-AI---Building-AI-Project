import React, { useState } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  HelpCircle,
  Sprout,
  ShieldCheck,
  Languages
} from 'lucide-react';
import { ChatMessage, Language, CropDisease } from '../types';

interface AgronomistConsultantProps {
  language: Language;
  activeCrop?: CropDisease | null;
}

export const AgronomistConsultant: React.FC<AgronomistConsultantProps> = ({
  language,
  activeCrop
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: language === 'so'
        ? `Asc! Waxaan ahay CropGuard AI, lataliyahaaga cilmiga beeraha dabiiciga ah. Waxaad i weydiin kartaa dawooyinka dabiiciga ah, cudurrada dalagyada sida galleyda, yaanyada ama qamadiga, iyo sida looga badbaado abaaraha.`
        : language === 'sw'
        ? `Habari! Mimi ni CropGuard AI, mshauri wako wa kilimo endelevu. Unaweza kuniuliza kuhusu udhibiti wa magonjwa ya mimea, viuatilifu vya asili, au jinsi ya kutunza udongo wakati wa ukame.`
        : `Greetings! I am CropGuard AI, your agricultural advisory assistant. Ask me anything about non-chemical plant disease management, soil moisture retention, organic pest remedies, or crop rotation protocols.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'knowledge-base'
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const quickPrompts = {
    en: [
      'How do I prepare and apply cold-pressed neem oil spray?',
      'Best companion crops for maize to repel pests naturally?',
      'How to manage water stress and drought in cassava fields?',
      'Organic treatment for early blight on tomato foliage?'
    ],
    so: [
      'Sideen u diyaariyaa buufinta dabiiciga ah ee caleenta Neebka?',
      'Dalagyo noocee ah ayaa loo beeraa galleyda agteeda si looga hortago cayayaanka?',
      'Sidee looga hortagaa abaarta iyo biyo yarida beeraha?',
      'Daaweynta dabiiciga ah ee dhibic-dhibicda madow ee yaanyada?'
    ],
    sw: [
      'Jinsi ya kuandaa dawa ya asili ya mwarobaini (neem)?',
      'Mazao gani yanafaa kupandwa pamoja na mahindi kuzuia wadudu?',
      'Mbinu za kuhifadhi unyevu wa udongo msimu wa ukame?',
      'Dawa ya asili ya kutibu ukungu kwenye nyanya?'
    ]
  };

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/advise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: activeCrop?.crop || 'Smallholder Food Crops',
          disease: activeCrop?.name || 'General Field Pathology',
          symptoms: activeCrop?.symptoms.join(', ') || 'Foliar spotting and vigor issues',
          language,
          question: textToSend
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.advice,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching agronomist advice:', error);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: language === 'so'
          ? 'Waan ka xumahay, cilad ayaa dhacday. Fadlan mar kale isku day ama isticmaal su\'aalaha degdegga ah.'
          : 'I encountered an error connecting to the advice service. Please check your connection or try another query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-stone-900/50 rounded-2xl p-5 border border-emerald-900/30 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3 h-3" />
              Multilingual Agronomy LLM (Gemini 3.8 Flash)
            </span>
            {activeCrop && (
              <span className="text-xs text-stone-400">
                Active Crop Context: <strong className="text-emerald-300">{activeCrop.crop} ({activeCrop.name})</strong>
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk']">
            Expert Smallholder Agronomist Assistant
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
            Practical non-chemical recipes, biological controls, and soil preservation tactics in English, Somali, and Swahili.
          </p>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Chat
        </button>
      </div>

      {/* Chat Container */}
      <div className="bg-stone-900/60 rounded-2xl border border-stone-800 overflow-hidden flex flex-col h-[520px]">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-800 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-emerald-700 text-white rounded-tr-none'
                    : 'bg-stone-950/80 text-stone-200 border border-stone-800 rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-stone-800/60 flex items-center justify-between text-[11px] text-stone-400">
                    <span className="font-mono">{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => copyToClipboard(msg.id, msg.text)}
                        className="flex items-center gap-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
                        title="Copy advice"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 mr-auto max-w-lg">
              <div className="w-8 h-8 rounded-xl bg-stone-800 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-2xl rounded-tl-none text-xs text-stone-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>Formulating agronomic advice...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-stone-950/60 border-t border-stone-800 overflow-x-auto flex gap-2">
          {quickPrompts[language].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] bg-stone-900 hover:bg-emerald-950/80 text-stone-300 hover:text-emerald-300 border border-stone-800 hover:border-emerald-700/60 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-stone-950 border-t border-stone-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              language === 'so'
                ? 'Weydii su\'aal ku saabsan beeraha dabiiciga ah...'
                : language === 'sw'
                ? 'Uliza swali lolote kuhusu kilimo asilia...'
                : 'Ask a question regarding plant diseases, organic remedies, or drought...'
            }
            className="flex-1 bg-stone-900 border border-stone-700/60 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-800 disabled:text-stone-600 text-white transition-all cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
