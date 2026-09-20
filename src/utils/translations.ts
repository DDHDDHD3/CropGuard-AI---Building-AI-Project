import { Language } from '../types';

export const TRANSLATIONS = {
  // Navigation
  nav: {
    dashboard: { en: 'Dashboard', so: 'Bogga Hore (Dashboordhka)', sw: 'Dashibodi' },
    scanner: { en: 'Camera & Leaf Scanner', so: 'Kaamirada & Baaraha Caleenta', sw: 'Kamera & Kichanganuzi' },
    bayes: { en: 'Bayesian Climate Risk', so: 'Khatarta Cimilada (Bayes)', sw: 'Hatari ya Hali ya Hewa (Bayes)' },
    chat: { en: 'CropGuard AI Chatbot', so: 'La-taliyaha AI ee Beeraha', sw: 'Mshauri wa AI' },
    readme: { en: 'Course Submission (README)', so: 'Qorshaha Mashruuca (README)', sw: 'Mpango wa Mradi (README)' },
    brandSubtitle: { 
      en: 'Deep-Vision Pathology & Climate Resilience Advisor', 
      so: 'Ogaanshaha Cudurrada Caleenta & La-talinta Cimilada Beerta',
      sw: 'Utambuzi wa Magonjwa ya Mimea & Ushauri wa Tabianchi'
    },
    buildingAiBadge: {
      en: 'Building AI Final Project',
      so: 'Mashruuca Qalin-jabinta ee Building AI',
      sw: 'Mradi wa Mwisho wa Building AI'
    }
  },

  // Common UI
  common: {
    back: { en: 'Back', so: 'Dib u noqo', sw: 'Rudi' },
    close: { en: 'Close', so: 'Xir', sw: 'Funga' },
    save: { en: 'Save', so: 'Keydi', sw: 'Hifadhi' },
    delete: { en: 'Delete', so: 'Tirtir', sw: 'Futa' },
    reset: { en: 'Reset', so: 'Dib u celi', sw: 'Rudisha' },
    export: { en: 'Export CSV', so: 'Dhoofi CSV', sw: 'Pakua CSV' },
    loading: { en: 'Analyzing...', so: 'Waa la baarayaa...', sw: 'Inachanganua...' },
    status: { en: 'Status', so: 'Xaaladda', sw: 'Hali' },
    severity: { en: 'Severity', so: 'Darnaanta', sw: 'Ukali' },
    confidence: { en: 'AI Confidence', so: 'Kalsoonida AI', sw: 'Uhakika wa AI' },
    actions: { en: 'Actions', so: 'Tallaabooyinka', sw: 'Hatua' },
    crop: { en: 'Crop', so: 'Dalagga', sw: 'Zao' },
    disease: { en: 'Disease', so: 'Cudurka', sw: 'Ugonjwa' },
    date: { en: 'Date & Time', so: 'Taariikhda & Waqtiga', sw: 'Tarehe & Saa' },
    notes: { en: 'Notes', so: 'Xusuusin', sw: 'Maelezo' },
    all: { en: 'All', so: 'Dhammaan', sw: 'Yote' },
    search: { en: 'Search records...', so: 'Raadi diiwaanka...', sw: 'Tafuta rekodi...' }
  },

  // Disease & Pathogen Names
  crops: {
    'Maize (Corn)': { en: 'Maize (Corn)', so: 'Galley (Corn)', sw: 'Mahindi' },
    'Tomato': { en: 'Tomato', so: 'Yaanyo', sw: 'Nyanya' },
    'Cassava': { en: 'Cassava', so: 'Kasaafada (Qasabada)', sw: 'Muhogo' },
    'Potato': { en: 'Potato', so: 'Baradho', sw: 'Viazi Mviringo' },
    'Banana': { en: 'Banana', so: 'Muus', sw: 'Ndizi' },
    'Beans': { en: 'Beans', so: 'Digir', sw: 'Maharage' },
    'Sorghum': { en: 'Sorghum', so: 'Masago (Haruur)', sw: 'Mtama' }
  },

  pathogens: {
    Fungus: { en: 'Fungus', so: 'Fangas', sw: 'Fangasi' },
    Virus: { en: 'Virus', so: 'Fayras', sw: 'Virusi' },
    Bacteria: { en: 'Bacteria', so: 'Bakteeriya', sw: 'Bakteria' },
    Pest: { en: 'Pest / Insect', so: 'Cayayaan / Dullin', sw: 'Wadudu' },
    Healthy: { en: 'Healthy Foliage', so: 'Caleen Caafimaad Qabta', sw: 'Majani Yenye Afya' }
  },

  severity: {
    Low: { en: 'Low', so: 'Hooseeya', sw: 'Chini' },
    Moderate: { en: 'Moderate', so: 'Dhexdhexaad', sw: 'Wastani' },
    High: { en: 'High', so: 'Sareeya', sw: 'Juu' },
    Critical: { en: 'Critical Outbreak', so: 'Halis / Degdeg ah', sw: 'Hatari Kubwa' },
    Healthy: { en: 'Healthy', so: 'Caafimaad qaba', sw: 'Yenye Afya' }
  },

  status: {
    'Needs Review': { en: 'Needs Review', so: 'U Baahan Dib-u-eegis', sw: 'Inahitaji Ukaguzi' },
    'Treatment Applied': { en: 'Treatment Applied', so: 'Dawo Ayaa La Mariyay', sw: 'Matibabu Yamewekwa' },
    'Resolved': { en: 'Resolved / Safe', so: 'Waa Xallismay / Badbaado', sw: 'Imetatuliwa / Salama' }
  },

  // Dashboard Page
  dashboard: {
    title: { 
      en: 'Scanned Crops & Pathological History Dashboard', 
      so: 'Diiwaanka Baaritaanka Caleemaha & Taariikhda Beerta',
      sw: 'Dashibodi ya Rekodi za Magonjwa ya Mimea'
    },
    subtitle: {
      en: 'Track longitudinal disease progression, evaluate optical leaf chlorosis/necrosis trends, and directly link past scan findings to Bayesian outbreak risk modeling.',
      so: 'La socodka cudurrada beerta, qiimaynta jaallaha iyo dhimashada unugyada caleenta, iyo xiriirinta baaritaannada hore qaacidada Bayes ee cimilada.',
      sw: 'Fuatilia maendeleo ya magonjwa ya mimea, changanua uharibifu wa majani na unganisha na makisio ya hali ya hewa ya Bayes.'
    },
    archiveBadge: { en: 'Diagnostic Historical Archive', so: 'Kaydka Diiwaanka Baaritaannada', sw: 'Kumbukumbu ya Utambuzi' },
    recordsSubtitle: { en: 'Persistent Crop Health Records', so: 'Xogta Caafimaadka Dalagga ee Joogtada ah', sw: 'Rekodi za Afya ya Mazao' },
    scanNewLeafBtn: { en: 'Scan New Leaf', so: 'Baar Caleen Cusub', sw: 'Changanua Jani Jipya' },
    totalScans: { en: 'Total Scans', so: 'Wadarta Baaritaannada', sw: 'Jumla ya Ukaguzi' },
    highRisk: { en: 'High / Critical Risk', so: 'Khatar Sare / Halis', sw: 'Hatari Kubwa' },
    interventions: { en: 'Interventions Applied', so: 'Dawooyinka La Sameeyay', sw: 'Matibabu Yaliyowekwa' },
    healthyFoliage: { en: 'Healthy Foliage', so: 'Caleen Caafimaad qabta', sw: 'Majani Yenye Afya' },
    monitoredPlots: { en: 'Monitored plots', so: 'Beeraha la kormeerayo', sw: 'Mashamba yanayofuatiliwa' },
    immediateAction: { en: 'Immediate isolation needed', so: 'U baahan go\'doomin degdeg ah', sw: 'Hatua za haraka zinahitajika' },
    organicRemedies: { en: 'Organic remedies applied', so: 'Dawo dabiici ah la mariyay', sw: 'Dawa ya asili imewekwa' },
    chlorophyllVigor: { en: 'Optimum chlorophyll vigor', so: 'Caafimaad iyo midab cagaar buuxa', sw: 'Ukuaji mzuri wa kijani' },
    filterByCrop: { en: 'Filter by crop', so: 'Ku kala saar dalagga', sw: 'Chuja kwa zao' },
    filterBySeverity: { en: 'Filter by severity', so: 'Ku kala saar halista', sw: 'Chuja kwa ukali' },
    filterByStatus: { en: 'Filter by status', so: 'Ku kala saar xaaladda', sw: 'Chuja kwa hali' },
    resetDefaults: { en: 'Reset to Defaults', so: 'Dib ugu celi Tusaalooyinkii', sw: 'Rudisha Mwanzo' },
    noRecordsFound: { en: 'No matching records found', so: 'Lama helin diiwaan ku habboon', sw: 'Hakuna rekodi zilizopatikana' },
    tryAdjustingFilters: { en: 'Try adjusting your search terms or filters', so: 'Isku day inaad beddesho erayada raadinta ama shaandhaynta', sw: 'Jaribu kubadilisha maneno ya utafutaji' }
  },

  // Disease Scanner Page
  scanner: {
    title: { en: 'CropGuard Vision: Real-Time Foliar Pathology Scanner', so: 'CropGuard Vision: Baaraha Cudurrada Caleenta ee Waqtiga Dhabta ah', sw: 'CropGuard Vision: Kichanganuzi cha Magonjwa ya Majani' },
    subtitle: { 
      en: 'Capture or upload a leaf photo to trigger deep optical analysis, chlorosis/necrosis segmentation, and instant pathology diagnosis.',
      so: 'Sawir ka qaad ama soo geli sawir caleen ah si aad u hesho baaritaan degdeg ah oo muujinaya cudurka, jaallanimada caleenta iyo unugyada dhintay.',
      sw: 'Piga picha au pakia jani kupata utambuzi wa haraka wa magonjwa na maeneo yaliyoathirika.'
    },
    openCamera: { en: 'Live Camera Capture', so: 'Ku Sawir Kaamirada Tooska ah', sw: 'Piga Picha na Kamera' },
    uploadPhoto: { en: 'Upload Leaf Photo', so: 'Soo Geli Sawirka Caleenta', sw: 'Pakia Picha ya Jani' },
    analyzingImage: { en: 'Analyzing Leaf Morphology & Pigment Density...', so: 'Waxaa socda baaritaanka qaabka caleenta iyo midabka...', sw: 'Inachanganua muundo wa jani na rangi...' },
    testWithSamples: { en: 'Or Test With Field Sample Leaves:', so: 'Ama Ku Tijaabi Tusaalooyinka Caleemaha Beerta:', sw: 'Au Jaribu na Sampuli za Majani ya Shambani:' },
    pathologyResult: { en: 'Pathology & Diagnostic Finding', so: 'Natiijada Baaritaanka Cudurka', sw: 'Matokeo ya Utambuzi wa Ugonjwa' },
    symptomsObserved: { en: 'Symptoms & Visual Markers', so: 'Calaamadaha Cudurka ee La Arkay', sw: 'Dalili Zinazoonekana' },
    organicTreatmentTitle: { en: 'Recommended Organic Treatments (IPM)', so: 'Dawaynta Dabiiciga ah ee Lagu Taliyay (IPM)', sw: 'Matibabu ya Asili Yaliyopendekezwa' },
    preventativeMeasuresTitle: { en: 'Preventative Agronomic Measures', so: 'Tallaabooyinka Kahortagga ee Beerta', sw: 'Hatua za Kinga za Kilimo' },
    optimalConditionsTitle: { en: 'Microclimate Infection Triggers', so: 'Xaaladaha Cimilada ee Cudurka Dhaqaajiya', sw: 'Hali ya Hewa Inayochochea Ugonjwa' },
    sendToBayesBtn: { en: 'Compute Climate Outbreak Risk in Bayes Model', so: 'Ku Xisaabi Khatarta Cimilada Qaacidada Bayes', sw: 'Kadiria Hatari ya Hali ya Hewa na Bayes' },
    consultAiBtn: { en: 'Consult AI Agronomist for Treatment Plan', so: 'La Tasho Khabiirka AI ee Beeraha', sw: 'Wasiliana na Mshauri wa AI' },
    scanSavedToast: { en: 'Scan logged to Field History Archive!', so: 'Baaritaanka waxaa lagu keydiyay Diiwaanka Beerta!', sw: 'Ukaguzi umehifadhiwa kwenye Kumbukumbu!' },
    opticalChlorosis: { en: 'Chlorosis Index (Yellowing)', so: 'Heerka Jaallaha Caleenta (Chlorosis)', sw: 'Kiwango cha Njano Majanini' },
    opticalNecrosis: { en: 'Necrosis Index (Dead Tissue)', so: 'Unugyada Dhintay (Necrosis)', sw: 'Sehemu Zilizokufa Majanini' },
    opticalGreenness: { en: 'Excess Green (Viable Leaf)', so: 'Cagaarka Caafimaadka qaba', sw: 'Sehemu Yenye Afya ya Kijani' }
  },

  // Bayesian Climate Outbreak Model
  bayes: {
    title: { en: 'Bayesian Outbreak Probability Engine', so: 'Mishiinka Qaacidada Bayes ee Khatarta Cimilada', sw: 'Injini ya Bayes ya Hatari ya Magonjwa' },
    subtitle: {
      en: 'Calculates the real posterior probability P(Outbreak | Climate Evidence) using Bayes Theorem to guide early preventive spraying and field isolation.',
      so: 'Wuxuu xisaabiyaa fursadda dhabta ah ee cudurku ku dillaaci karo P(Dillaac | Cimilada) iyadoo la adeegsanayo Qaacidada Bayes si looga hortago cudurka inta uusan fidin.',
      sw: 'Hukokotoa uwezekano halisi wa ugonjwa kutokea kulingana na hali ya hewa kwa kutumia Nadharia ya Bayes.'
    },
    environmentalInputs: { en: 'Field Environmental & Microclimate Observations', so: 'Xaaladaha Cimilada & Cabirka Beerta', sw: 'Vipimo vya Hali ya Hewa Shambani' },
    temperature: { en: 'Ambient Temperature (°C)', so: 'Heerkulka Hawada (°C)', sw: 'Joto la Hewa (°C)' },
    humidity: { en: 'Relative Humidity (%)', so: 'Huurka Hawada (%)', sw: 'Unyevu wa Hewa (%)' },
    rainfall: { en: '7-Day Accumulated Rainfall (mm)', so: 'Roobka 7-dii Maalmood (mm)', sw: 'Mvua ya Siku 7 (mm)' },
    soilMoisture: { en: 'Soil Moisture Level (%)', so: 'Qoyaanka Ciidda (%)', sw: 'Unyevu wa Udongo (%)' },
    windSpeed: { en: 'Wind Speed (km/h)', so: 'Xawaaraha Dabaysha (km/h)', sw: 'Kasi ya Upepo (km/h)' },
    visualEvidenceToggle: { en: 'Incorporate Visual Foliar Scan Evidence', so: 'Ku dar Natiijadii Sawirka Caleenta ee Hore', sw: 'Jumuisha Ushahidi wa Picha ya Jani' },
    priorProb: { en: 'Baseline Prior Probability', so: 'Fursadda Bilowga ah (Prior)', sw: 'Uwezekano wa Awali' },
    likelihoodRatio: { en: 'Combined Likelihood Ratio (Bayes Factor)', so: 'Isku-darka Saamaynta Xaaladaha (LR)', sw: 'Uwiano wa Ushahidi (LR)' },
    posteriorProb: { en: 'Updated Posterior Outbreak Risk', so: 'Khatarta Dambe ee Dillaaca Cudurka (Posterior)', sw: 'Hatari Iliyosasishwa ya Mlipuko' },
    riskCategories: {
      'Low Risk': { en: 'Low Risk', so: 'Khatar Hooseysa', sw: 'Hatari Ndogo' },
      'Guarded': { en: 'Guarded', so: 'Feejignaan Dhexdhexaad', sw: 'Tahadhari ya Kawaida' },
      'High Alert': { en: 'High Alert', so: 'Digniin Sare', sw: 'Tahadhari Kubwa' },
      'Outbreak Imminent': { en: 'Outbreak Imminent', so: 'Dillaac Halis ah oo Soo Fool Leh', sw: 'Mlipuko Unakaribia' }
    },
    actionRecommendations: { en: 'Bayesian Agronomic Guidance', so: 'Talooyinka Beereed ee Qaacidada Bayes', sw: 'Mwongozo wa Kilimo wa Bayes' },
    consultChatWithRisk: { en: 'Consult Agronomist AI With This Risk Calculation', so: 'Kala Tasho AI-ga Xisaabtan Bayes', sw: 'Wasiliana na AI kuhusu Hesabu Hii' }
  },

  // Agronomist Chatbot
  chat: {
    title: { en: 'CropGuard AI: Agronomist & Plant Pathology Consultant', so: 'CropGuard AI: La-taliyaha Cudurrada Dhirta & Beeraha', sw: 'CropGuard AI: Mshauri wa Kilimo na Magonjwa' },
    subtitle: { 
      en: 'Ask specialized diagnostic questions, request custom organic pesticide recipes, and verify crop rotation schedules in Somali, English, or Swahili.',
      so: 'Weydii su\'aalo ku saabsan cudurrada dhirta, hel qaababka dawooyinka dabiiciga ah, oo xaqiiji wareegga beerista adigoo ku hadlaya Af-Soomaali.',
      sw: 'Uliza maswali ya kilimo, pata mapishi ya dawa za asili na maelekezo ya mzunguko wa mazao kwa Kiswahili au Kiingereza.'
    },
    roles: {
      agronomist: { en: 'Certified Agronomist', so: 'Khabiirka Guud ee Beeraha', sw: 'Mtaalamu wa Kilimo' },
      pathologist: { en: 'Plant Pathologist', so: 'Khabiirka Cudurrada Dhirta', sw: 'Mtaalamu wa Magonjwa' },
      officer: { en: 'Field Extension Officer', so: 'Sarkaalka Wacyigelinta Beerta', sw: 'Afisa Ugani' }
    },
    inputPlaceholder: { 
      en: 'Ask anything about crop symptoms, organic pest treatments, or climate planting...',
      so: 'Halkan ku qor su\'aashaada ku saabsan cudurrada dalagga, dawooyinka dabiiciga ah ama cimilada...',
      sw: 'Uliza chochote kuhusu magonjwa ya mimea, matibabu ya asili au hali ya hewa...'
    },
    sendBtn: { en: 'Send', so: 'Dir', sw: 'Tuma' },
    stopBtn: { en: 'Stop generating', so: 'Jooji qoraalka', sw: 'Sitisha' },
    regenerateBtn: { en: 'Regenerate', so: 'Dib u soo saar', sw: 'Tengeneza upya' },
    copyBtn: { en: 'Copy', so: 'Nuqul', sw: 'Nakili' },
    copied: { en: 'Copied!', so: 'Waa la guuriyay!', sw: 'Imenakiliwa!' },
    quickPrompts: {
      neemRecipe: { 
        en: 'How do I prepare a neem leaf organic extract for fungal spots?', 
        so: 'Sideen u diyaariyaa dawo dabiici ah oo caleen geed-hindi (Neem) ah si aan u daweeyo fangaska?',
        sw: 'Jinsi gani ya kuandaa dawa ya asili ya mwarobaini kutibu ukungu?'
      },
      cropRotation: {
        en: 'What crops should I rotate after harvesting diseased tomatoes?',
        so: 'Dalaggee baan ku xigsiiyaa beer yaanyadii hore cudurku ku dhacay?',
        sw: 'Mazao gani ninafaa kupanda baada ya kuvuna nyanya zenye magonjwa?'
      },
      blightSuppression: {
        en: 'How does baking soda spray protect against leaf blights?',
        so: 'Sidee buu soodhuhu (baking soda) uga hortagaa cudurrada caleemaha?',
        sw: 'Je, mchanganyiko wa baking soda unasaidiaje kuzuia ukungu wa majani?'
      }
    }
  }
};

export function t(keyPath: string, language: Language = 'so'): string {
  const parts = keyPath.split('.');
  let current: any = TRANSLATIONS;
  for (const part of parts) {
    if (current && current[part] !== undefined) {
      current = current[part];
    } else {
      return keyPath;
    }
  }

  if (typeof current === 'object') {
    return current[language] || current['so'] || current['en'] || keyPath;
  }
  return String(current);
}

export function translateCrop(cropName: string, language: Language = 'so'): string {
  const norm = cropName.trim();
  for (const [key, trans] of Object.entries(TRANSLATIONS.crops)) {
    if (norm.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(norm.toLowerCase())) {
      return trans[language] || trans.so || trans.en;
    }
  }
  return cropName;
}

export function translateSeverity(severity: string, language: Language = 'so'): string {
  const entry = (TRANSLATIONS.severity as any)[severity];
  if (entry) {
    return entry[language] || entry.so || entry.en;
  }
  return severity;
}

export function translateStatus(status: string, language: Language = 'so'): string {
  const entry = (TRANSLATIONS.status as any)[status];
  if (entry) {
    return entry[language] || entry.so || entry.en;
  }
  return status;
}

export function translatePathogen(pathogen: string, language: Language = 'so'): string {
  const entry = (TRANSLATIONS.pathogens as any)[pathogen];
  if (entry) {
    return entry[language] || entry.so || entry.en;
  }
  return pathogen;
}
