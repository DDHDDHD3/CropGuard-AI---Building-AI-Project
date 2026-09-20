import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Square, 
  RotateCw, 
  Sparkles, 
  Globe, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertCircle, 
  ArrowDown, 
  Sprout, 
  Brain, 
  Zap, 
  RotateCcw,
  RefreshCw
} from 'lucide-react';
import { 
  ChatMessage, 
  ChatBotRole, 
  ModelTier, 
  CropDisease, 
  BayesCalculation,
  BayesFactorContribution 
} from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface AgronomistConsultantProps {
  language?: 'en' | 'so' | 'sw';
  activeCrop?: CropDisease | null;
  activeBayesRisk?: BayesCalculation | null;
  initialQuery?: string;
}

export const AgronomistConsultant: React.FC<AgronomistConsultantProps> = ({
  language = 'en',
  activeCrop,
  activeBayesRisk,
  initialQuery
}) => {
  const [selectedRole, setSelectedRole] = useState<ChatBotRole>('agronomist');
  const [selectedModel, setSelectedModel] = useState<ModelTier>('gemini-3.5-flash');
  const [enableSearchGrounding, setEnableSearchGrounding] = useState<boolean>(true);

  const getInitialGreeting = (lang: string, role: ChatBotRole): string => {
    if (lang === 'so') {
      if (role === 'pathologist') {
        return 'Ku soo dhowow Xarunta Cilmiga Cudurrada Dhirta (Gemini 3.1 Pro). Waxaan falanqeyneynaa qaab-dhismeedka unugyada, faafitaanka fangaska, iyo halista microclimate-ka.';
      }
      if (role === 'triage') {
        return '🚨 Qaybta Samatabixinta Degdegga ah ee Beerta (Gemini 3.1 Flash-Lite) waa diyaar! Ii sheeg calaamadaha degdegga ah si aad u hesho talooyin 60-ilbiriqsi ah oo lagu go\'doomiyo cudurka.';
      }
      return 'Habari! Waxaan ahay CropGuard AI, kaaliyahaaga beeraha casriga ah (Gemini 3.5 Flash). I weydii wax ku saabsan daawooyinka dabiiciga ah, saliidda Neebka, ama cudurrada hadda jira.';
    }
    if (lang === 'sw') {
      if (role === 'pathologist') {
        return 'Karibu kwenye Dawati la Uchunguzi wa Patholojia ya Mimea (Gemini 3.1 Pro). Tuko hapa kuchambua magonjwa ya seli, kuenea kwa spora, na uwezekano wa mlipuko shambani.';
      }
      if (role === 'triage') {
        return '🚨 Kitengo cha Dharura cha Shamba (Gemini 3.1 Flash-Lite) kiko tayari! Niulize hatua za haraka za sekunde 60 za kutenga na kutibu mazao yaliyoathirika.';
      }
      return 'Habari! Mimi ni CropGuard AI, mshauri wako wa kilimo endelevu (Gemini 3.5 Flash). Unaweza kuniuliza kuhusu udhibiti wa magonjwa ya mimea, viuatilifu vya asili, na ushauri wa shamba.';
    }
    // Default English
    if (role === 'pathologist') {
      return 'Welcome to the Plant Pathology & Epidemiology Desk (Gemini 3.1 Pro). Specialized in high-dimensional cellular diagnostics, spore dispersal dynamics, and microclimate outbreak modeling.';
    }
    if (role === 'triage') {
      return '🚨 Rapid Field Triage Responder active (Gemini 3.1 Flash-Lite). Formatted for instantaneous 60-second emergency containment, botanical protective spray dosages, and crop quarantine protocols.';
    }
    return 'Greetings! I am CropGuard AI, your smallholder agricultural advisory assistant (Gemini 3.5 Flash with Live Google Search Grounding). Ask me anything about organic crop protection, bio-fungicides, or current regional alerts.';
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: getInitialGreeting(language, 'agronomist'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'gemini-3.5-flash',
      model: 'gemini-3.5-flash',
      role: 'agronomist'
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isWaitingFirstChunk, setIsWaitingFirstChunk] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastUserPrompt, setLastUserPrompt] = useState<string>('');

  // Auto-scroll and manual scroll override detection
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userHasScrolledUp, setUserHasScrolledUp] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Monitor scroll position to respect manual user scroll upward
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    // If user scrolled up more than 60px from the bottom, disable auto-scroll
    if (distanceFromBottom > 60) {
      setUserHasScrolledUp(true);
    } else {
      setUserHasScrolledUp(false);
    }
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
    setUserHasScrolledUp(false);
  };

  // Automatically scroll down only if user has not manually scrolled up
  useEffect(() => {
    if (!userHasScrolledUp) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isWaitingFirstChunk, userHasScrolledUp]);

  // Clean up any pending stream on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Populate input if initial query provided (e.g. from Seasonal Planting Card)
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setInput(initialQuery);
    }
  }, [initialQuery]);

  const handleRoleChange = (newRole: ChatBotRole) => {
    setSelectedRole(newRole);
    if (newRole === 'pathologist') {
      setSelectedModel('gemini-3.1-pro-preview');
    } else if (newRole === 'triage') {
      setSelectedModel('gemini-3.1-flash-lite');
    } else {
      setSelectedModel('gemini-3.5-flash');
    }
  };

  // Quick prompt suggestions
  const quickPromptsByRole = {
    agronomist: {
      en: [
        'How do I prepare cold-pressed neem oil spray?',
        'Best companion crops for maize to repel stem borers?',
        'Recent organic methods for managing late blight in tomatoes?',
        'How to maintain soil moisture during prolonged dry spells?'
      ],
      so: [
        'Sideen u diyaariyaa buufinta dabiiciga ah ee caleenta Neebka?',
        'Dalagyo noocee ah ayaa loo beeraa galleyda agteeda si looga hortago cayayaanka?',
        'Daaweynta dabiiciga ah ee dhibic-dhibicda madow ee yaanyada?',
        'Sidee looga hortagaa abaarta iyo biyo yarida beeraha?'
      ],
      sw: [
        'Jinsi ya kuandaa dawa ya asili ya mwarobaini (neem)?',
        'Mazao gani yanafaa kupandwa pamoja na mahindi kuzuia wadudu?',
        'Dawa ya asili ya kutibu ukungu kwenye nyanya?',
        'Mbinu za kuhifadhi unyevu wa udongo msimu wa ukame?'
      ]
    },
    pathologist: {
      en: [
        'Explain cellular necrotic lesion expansion under high relative humidity',
        'Differential diagnosis between Early Blight and Septoria Spot in Solanaceae',
        'Vector transmission mechanisms of Cassava Mosaic Begomovirus via Bemisia tabaci',
        'Mathematical formulation of Bayesian likelihood ratio for leaf wetness'
      ],
      so: [
        'Falanqee sida qoyaanka sare u kordhiyo faafitaanka fangaska caleenta',
        'Kala saarida cudurrada Early Blight iyo Septoria ee yaanyada',
        'Sida duqsiga cad (whitefly) ugu gudbiyo fayraska geedka kasaafada',
        'Xisaabinta halista cudurrada iyadoo la eegayo huurka iyo heerkulka'
      ],
      sw: [
        'Eleza jinsi unyevu mwingi unavyoongeza kuenea kwa ukungu kwenye majani',
        'Tofauti ya kiuchunguzi kati ya Ukungu wa Mapema na Madoa ya Septoria',
        'Jinsi inzi mweupe anavyoeneza virusi vya michirizi ya muhogo',
        'Uchambuzi wa takwimu za hatari ya magonjwa kulingana na unyevu'
      ]
    },
    triage: {
      en: [
        'URGENT: Black lesion spots spreading across lower maize leaves after rain',
        'EMERGENCY: White powdery film on pumpkin vines — 60-second isolation steps',
        'RAPID: Tomato foliage wilting rapidly without soil drought symptoms',
        'CRITICAL: Yellow mosaic mottling on young bean seedlings'
      ],
      so: [
        'DEGDEG: Dhibco madow oo ku fiday caleemaha hoose ee galleyda roobka kadib',
        'HALIS: Caleemo dushooda caddaan budo ah yeesheen — tallaabooyinka 60-ilbiriqsi',
        'DEGDEG: Yaanyada oo baaba\'aysa inkastoo biyuhu ku filan yihiin',
        'DEGDEG: Caleemaha digirta oo huruud noqday'
      ],
      sw: [
        'DHARURA: Madoa meusi yanayoenea kwenye majani ya chini ya mahindi baada ya mvua',
        'DHARURA: Unga mweupe kwenye majani ya maboga — hatua za sekunde 60',
        'HARAKA: Nyanya zinazonyauka haraka bila ukosefu wa maji',
        'DHARURA: Majani ya maharage kugeuka manjano'
      ]
    }
  };

  const currentPrompts = quickPromptsByRole[selectedRole]?.[language] || quickPromptsByRole.agronomist.en;

  // Real SSE Streaming Handler with AbortController and Chunk Processing
  const executeStreamingChat = async (
    userText: string,
    historyForContext: ChatMessage[]
  ) => {
    const assistantId = `assistant-${Date.now()}`;

    // Create assistant streaming placeholder
    const assistantPlaceholder: ChatMessage = {
      id: assistantId,
      sender: 'assistant',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
      role: selectedRole,
      model: selectedModel
    };

    setMessages([...historyForContext, assistantPlaceholder]);
    setIsStreaming(true);
    setIsWaitingFirstChunk(true);
    setUserHasScrolledUp(false);

    // Setup AbortController for cancel / stop generating
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: historyForContext.map((m) => ({
            sender: m.sender,
            text: m.text
          })),
          model: selectedModel,
          role: selectedRole,
          language,
          enableSearchGrounding,
          activeCrop: activeCrop
            ? {
                crop: activeCrop.crop,
                name: activeCrop.name,
                scientificName: activeCrop.scientificName,
                pathogenType: activeCrop.pathogenType,
                severity: activeCrop.severity,
                symptoms: activeCrop.symptoms
              }
            : undefined,
          activeBayesRisk: activeBayesRisk
            ? {
                posteriorProbability: Number((activeBayesRisk.posteriorProbability * 100).toFixed(1)),
                riskCategory: activeBayesRisk.riskCategory,
                likelihoodRatio: activeBayesRisk.likelihoodRatio,
                keyDrivers: activeBayesRisk.factorBreakdown
                  .filter((f: BayesFactorContribution) => f.impact === 'increases')
                  .map((f: BayesFactorContribution) => `${f.factor} (${f.observedValue})`)
                  .join(', ')
              }
            : undefined
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status code: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported or empty body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let streamBuffer = '';
      let accumulatedText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        streamBuffer += decoder.decode(value, { stream: true });
        const lines = streamBuffer.split('\n');
        streamBuffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const jsonString = trimmed.slice(6);

          try {
            const eventData = JSON.parse(jsonString);

            if (eventData.type === 'chunk' && eventData.text) {
              setIsWaitingFirstChunk(false);
              accumulatedText += eventData.text;

              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        text: accumulatedText,
                        isStreaming: true
                      }
                    : m
                )
              );
            } else if (eventData.type === 'metadata') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        groundingSources: eventData.groundingSources,
                        webSearchQueries: eventData.webSearchQueries,
                        model: eventData.model || m.model
                      }
                    : m
                )
              );
            } else if (eventData.type === 'done') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        isStreaming: false,
                        isJustFinished: true,
                        source: eventData.source || m.source,
                        model: eventData.model || m.model,
                        role: eventData.role || m.role
                      }
                    : m
                )
              );
            }
          } catch {
            // Ignore partial SSE JSON chunks
          }
        }
      }

      // Stream fully completed
      setIsStreaming(false);
      setIsWaitingFirstChunk(false);

      // Trigger brief 1.2s subtle completion animation cue
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, isJustFinished: false } : m
          )
        );
      }, 1200);

    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User clicked "Stop generating"
        return;
      }

      console.error('Chat streaming failed:', err);
      setIsStreaming(false);
      setIsWaitingFirstChunk(false);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                isStreaming: false,
                error:
                  language === 'so'
                    ? 'Waan ka xumahay, xiriirka server-ka ayaa go\'ay intii lagu guda jiray dhalinta jawaabta.'
                    : language === 'sw'
                    ? 'Samahani, kulikuwa na hitilafu ya mtandao wakati wa kutoa ushauri.'
                    : 'Network interruption during streaming generation. Click "Retry" to regenerate.',
                text: m.text || ''
              }
            : m
        )
      );
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isStreaming) return;

    setLastUserPrompt(query);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInput('');

    executeStreamingChat(query, nextHistory);
  };

  // Stop Generating button action
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setIsWaitingFirstChunk(false);

    setMessages((prev) =>
      prev.map((m) =>
        m.isStreaming
          ? {
              ...m,
              isStreaming: false,
              isStopped: true,
              text:
                m.text ||
                (language === 'so'
                  ? 'Dhalinta jawaabta waa la joojiyay.'
                  : language === 'sw'
                  ? 'Uzalishaji ulisitishwa.'
                  : 'Generation stopped by user.')
            }
          : m
      )
    );
  };

  // Regenerate response action
  const handleRegenerate = (targetAssistantId?: string) => {
    if (isStreaming) return;

    const targetIdx = targetAssistantId
      ? messages.findIndex((m) => m.id === targetAssistantId)
      : messages.length - 1;

    let userPromptToUse = lastUserPrompt;
    let cutOffIdx = targetIdx;

    if (targetIdx !== -1) {
      for (let i = targetIdx - 1; i >= 0; i--) {
        if (messages[i].sender === 'user') {
          userPromptToUse = messages[i].text;
          cutOffIdx = targetIdx;
          break;
        }
      }
    }

    if (!userPromptToUse) return;

    // Slice out the previous assistant response so we regenerate clean
    const preservedHistory = messages.slice(0, cutOffIdx);
    setMessages(preservedHistory);
    executeStreamingChat(userPromptToUse, preservedHistory);
  };

  const handleResetChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setIsWaitingFirstChunk(false);

    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'assistant',
        text: getInitialGreeting(language, selectedRole),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: selectedModel,
        model: selectedModel,
        role: selectedRole
      }
    ]);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  {language === 'so' 
                    ? 'La-Taliyaha Beeraha (CropGuard Chat)' 
                    : language === 'sw' 
                    ? 'Mshauri wa Kilimo (CropGuard Chat)' 
                    : 'CropGuard AI Agronomist Chat'}
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100/70 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Streaming AI
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'so'
                  ? 'Ka jawaabista su\'aalaha beeraha, baadhitaanka unugyada, iyo xakamaynta dabiiciga ah'
                  : language === 'sw'
                  ? 'Majibu ya haraka ya kilimo, patholojia ya magonjwa, na dawa asili za mimea'
                  : 'ChatGPT-style streaming with Markdown rendering, live search grounding & persona switching'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetChat}
            disabled={isStreaming}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs text-slate-600 hover:text-rose-600 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 transition-colors disabled:opacity-50 cursor-pointer"
            title="Reset conversation thread"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'so' ? 'Bilaaw Wadahadal Cusub' : language === 'sw' ? 'Anzisha Mazungumzo Mapya' : 'Reset Thread'}</span>
          </button>
        </div>

        {/* Persona Selectors & Model Settings */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-0.5">
          {/* Persona Mode Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500 mr-1">
              {language === 'so' ? 'Khabiirka:' : language === 'sw' ? 'Mtaalamu:' : 'Specialist:'}
            </span>
            
            <button
              type="button"
              onClick={() => handleRoleChange('agronomist')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                selectedRole === 'agronomist'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              {language === 'so' ? 'Khabiirka Beeraha' : language === 'sw' ? 'Mtaalamu wa Shamba' : 'Field Agronomist'}
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('pathologist')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                selectedRole === 'pathologist'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              {language === 'so' ? 'Khabiirka Cudurrada' : language === 'sw' ? 'Daktari wa Mimea' : 'Plant Pathologist'}
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('triage')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                selectedRole === 'triage'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              {language === 'so' ? 'Gurmadka Degdegga' : language === 'sw' ? 'Huduma ya Dharura' : 'Rapid Triage'}
            </button>
          </div>

          {/* Model Selection & Search Grounding Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500">
                {language === 'so' ? 'Matoorka:' : 'Engine:'}
              </span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as ModelTier)}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="gemini-3.5-flash">Gemini 3.5 Flash (Grounded)</option>
                <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Deep)</option>
                <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash-Lite (Fast)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setEnableSearchGrounding(!enableSearchGrounding)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                enableSearchGrounding
                  ? 'bg-blue-50 text-blue-900 border-blue-300 font-semibold'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle Google Search Grounding"
            >
              <Globe className={`w-3.5 h-3.5 ${enableSearchGrounding ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{language === 'so' ? 'Xaqiijin Toos ah' : 'Grounding'}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${enableSearchGrounding ? 'bg-blue-600' : 'bg-slate-300'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-[560px] shadow-sm">
        
        {/* Messages Scroll Area */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/40 relative scroll-smooth"
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isPathologist = msg.role === 'pathologist';
            const isTriage = msg.role === 'triage';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl transition-opacity duration-300 ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Role / User Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                  isUser
                    ? 'bg-emerald-600 text-white'
                    : isPathologist
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : isTriage
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {isUser ? (
                    <User className="w-4 h-4" />
                  ) : isPathologist ? (
                    <Brain className="w-4 h-4" />
                  ) : isTriage ? (
                    <Zap className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed transition-all duration-500 ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none shadow-xs'
                    : msg.isJustFinished
                    ? 'bg-white text-slate-800 border-2 border-emerald-400/80 rounded-tl-none shadow-md ring-2 ring-emerald-100'
                    : msg.error
                    ? 'bg-rose-50/90 text-rose-950 border border-rose-200 rounded-tl-none shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                }`}>
                  {/* Persona & Metadata Header for Assistant messages */}
                  {!isUser && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-2 pb-2 border-b border-slate-100 text-[11px] text-slate-500 font-medium">
                      <span className="font-semibold text-slate-800">
                        {msg.role === 'pathologist' ? 'Plant Pathologist' : msg.role === 'triage' ? 'Rapid Triage' : 'CropGuard Agronomist'}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                        {msg.model || selectedModel}
                      </span>
                      {msg.groundingSources && msg.groundingSources.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-medium">
                          <Globe className="w-2.5 h-2.5" /> {msg.groundingSources.length} Search Sources
                        </span>
                      )}
                      {msg.isStreaming && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold ml-auto animate-pulse">
                          <Sparkles className="w-3 h-3" /> {language === 'so' ? 'Waa la soo qorayaa...' : 'Streaming...'}
                        </span>
                      )}
                      {msg.isStopped && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded ml-auto">
                          {language === 'so' ? 'La hakiyay' : 'Stopped'}
                        </span>
                      )}
                    </div>
                  )}

                  {/* AI Typing Indicator (Animated Dots ● ● ● before first streamed text arrives) */}
                  {!isUser && msg.isStreaming && !msg.text && (
                    <div className="py-2 px-1 flex items-center gap-1.5 text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                      <span className="text-xs text-slate-400 font-medium ml-2">
                        {language === 'so' ? 'Khabiirka ayaa fekeraya & diyaarinta talada...' : 'Thinking & formulating advice...'}
                      </span>
                    </div>
                  )}

                  {/* Message Content: Rendered with Markdown support */}
                  {isUser ? (
                    <div className="whitespace-pre-wrap font-sans text-white">
                      {msg.text}
                    </div>
                  ) : msg.text ? (
                    <MarkdownRenderer 
                      content={msg.text} 
                      isStreaming={msg.isStreaming} 
                    />
                  ) : null}

                  {/* Inline Error Message & Retry */}
                  {msg.error && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-rose-100/70 border border-rose-300 text-rose-800 text-xs flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{msg.error}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRegenerate(msg.id)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-rose-300 hover:bg-rose-50 text-rose-900 font-semibold transition-colors cursor-pointer text-[11px] shrink-0"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                    </div>
                  )}

                  {/* Google Search Grounding Sources Cards */}
                  {!isUser && msg.groundingSources && msg.groundingSources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50/70 -mx-2 -mb-2 p-2.5 rounded-xl border border-slate-200/80">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 mb-1.5">
                        <Search className="w-3 h-3 text-blue-600" />
                        <span>Verified Live Search Sources:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.groundingSources.map((source, sIdx) => (
                          <a
                            key={sIdx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-900 border border-slate-200 hover:border-blue-300 px-2 py-1 rounded-lg transition-colors shadow-2xs font-medium max-w-[260px] truncate"
                            title={source.title}
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span className="truncate">{source.title || source.url}</span>
                          </a>
                        ))}
                      </div>

                      {msg.webSearchQueries && msg.webSearchQueries.length > 0 && (
                        <div className="mt-2 text-[10px] text-slate-500 flex flex-wrap items-center gap-1">
                          <span className="font-semibold text-slate-600">Search Queries:</span>
                          {msg.webSearchQueries.map((query, qIdx) => (
                            <span key={qIdx} className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-mono">
                              "{query}"
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Action Footer (Timestamp, Copy & Regenerate) */}
                  <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[11px] ${
                    isUser ? 'border-emerald-500/40 text-emerald-100' : 'border-slate-100 text-slate-500'
                  }`}>
                    <span className="font-mono">{msg.timestamp}</span>

                    {!isUser && (
                      <div className="flex items-center gap-2.5">
                        {/* Regenerate Action */}
                        {!msg.isStreaming && (
                          <button
                            type="button"
                            onClick={() => handleRegenerate(msg.id)}
                            className="flex items-center gap-1 text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer font-medium"
                            title="Regenerate this response"
                          >
                            <RotateCw className="w-3 h-3" />
                            <span>{language === 'so' ? 'Dib u curi' : 'Regenerate'}</span>
                          </button>
                        )}

                        {/* Copy Action */}
                        <button
                          type="button"
                          onClick={() => copyToClipboard(msg.id, msg.text)}
                          className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer font-medium"
                          title="Copy advice to clipboard"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700 font-semibold">{language === 'so' ? 'Waa la guuriyay' : 'Copied'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{language === 'so' ? 'Guuri' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Floating "Scroll to Bottom" pill if user has scrolled upward during stream */}
        {userHasScrolledUp && (
          <button
            type="button"
            onClick={() => scrollToBottom('smooth')}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-slate-700 cursor-pointer backdrop-blur-xs transition-transform hover:scale-105 z-10"
          >
            <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'so' ? 'Hoos u deg' : 'Scroll to newest'}</span>
            {isStreaming && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>
        )}

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 overflow-x-auto flex gap-2">
          {currentPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              disabled={isStreaming}
              className="text-[11px] bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs font-medium disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Bottom Input and Stop Generating Controls */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          {/* Main Input Text Field */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isStreaming}
            placeholder={
              isStreaming
                ? (language === 'so' ? 'CropGuard AI ayaa soo qoraya...' : language === 'sw' ? 'CropGuard AI inazalisha ushauri...' : 'AI is streaming response...')
                : language === 'so'
                ? 'Weydii su\'aal ku saabsan beeraha ama cudurrada dhirta...'
                : language === 'sw'
                ? 'Uliza swali kuhusu kilimo, mbolea au magonjwa ya mimea...'
                : selectedRole === 'pathologist'
                ? 'Ask a complex pathology, spore dispersal, or disease modeling question...'
                : selectedRole === 'triage'
                ? 'Enter urgent symptoms for instant 60-second containment...'
                : 'Ask CropGuard AI about treatments, companion crops, or neem oil spray...'
            }
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors disabled:bg-slate-100 disabled:text-slate-500"
          />

          {/* Dynamic Action Button: "Stop Generating" or "Send" */}
          {isStreaming ? (
            <button
              type="button"
              onClick={handleStopGeneration}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer border border-slate-700"
              title="Stop generating response"
            >
              <Square className="w-3.5 h-3.5 fill-current text-rose-400" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-100 disabled:text-slate-400 text-white transition-all cursor-pointer shadow-xs"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
