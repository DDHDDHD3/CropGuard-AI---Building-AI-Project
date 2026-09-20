import { ScanHistoryEntry, Language, SeasonalPlantingAdvice, SeasonalPlantingTip } from '../types';

interface MonthSeasonData {
  name: { en: string; so: string; sw: string };
  seasonPhase: { en: string; so: string; sw: string };
  climateContext: { en: string; so: string; sw: string };
  generalSowingList: {
    crop: { en: string; so: string; sw: string };
    reason: { en: string; so: string; sw: string };
    maturityDays: string;
  }[];
  defaultCompanion: {
    main: { en: string; so: string; sw: string };
    companion: { en: string; so: string; sw: string };
    benefit: { en: string; so: string; sw: string };
  };
}

const MONTH_DATA: MonthSeasonData[] = [
  // 0: January
  {
    name: { en: 'January', so: 'Janaayo', sw: 'Januari' },
    seasonPhase: { en: 'Dry Post-Harvest & Land Clearing (Jilaal Onset)', so: 'Xilliga Jilaalka & Gurashada Dalagga', sw: 'Msimu wa Kiangazi & Maandalizi ya Mashamba' },
    climateContext: { en: 'Low precipitation, high solar radiation, elevated soil evaporation.', so: 'Roobab aad u yar, kulayl daran iyo uumibax dhulka ah.', sw: 'Mvua kidogo, joto kali na ukavu wa udongo.' },
    generalSowingList: [
      { crop: { en: 'Drip-Irrigated Watermelon', so: 'Xabxabka Waraabka ah', sw: 'Tikiti Maji ya Umwagiliaji' }, reason: { en: 'Thrives in dry heat with minimal foliar fungal risks', so: 'Wuxuu ku koraa kulaylka iyadoon fangas ku dhicin', sw: 'Hustawi vizuri kwenye joto bila ukungu wa majani' }, maturityDays: '75-85 days' },
      { crop: { en: 'Cowpeas (Fodder/Grain)', so: 'Digirta Cawska/Midhaha', sw: 'Kunde za Mifugo/Kula' }, reason: { en: 'Deep taproot withstands declining soil moisture', so: 'Xididdo dhuuban oo u adkaysta qallaylka', sw: 'Mizizi mirefu inayostahimili ukame' }, maturityDays: '60-70 days' }
    ],
    defaultCompanion: {
      main: { en: 'Sorghum', so: 'Haruur / Masago', sw: 'Mtama' },
      companion: { en: 'Cowpeas', so: 'Digirta Cagaaran', sw: 'Kunde' },
      benefit: { en: 'Nitrogen fixation & drought ground shielding', so: 'Hagaajinta nitrogen-ta iyo daboolka carrada', sw: 'Kurutubisha udongo na kuzuia upotevu wa maji' }
    }
  },
  // 1: February
  {
    name: { en: 'February', so: 'Febraayo', sw: 'Februari' },
    seasonPhase: { en: 'Pre-Planting Tillage & Organic Soil Preparation', so: 'Diyaarinta Beerta & Bacriminta Carrada', sw: 'Kutayarisha Udongo & Mboji Kabla ya Mvua' },
    climateContext: { en: 'End of dry spell, rising ambient temperatures, preparing for seasonal rains.', so: 'Dhamaadka abaar-yaraha iyo u diyaargaroowga roobka.', sw: 'Mwisho wa kiangazi, kujiandaa kwa mvua za kwanza.' },
    generalSowingList: [
      { crop: { en: 'Green Manure / Sunn Hemp', so: 'Cawska Bacriminta Carrada', sw: 'Mbolea ya Majani Mabichi' }, reason: { en: 'Quick biomass generation before main food crop sowing', so: 'Kordhinta bacriminta ciidda ka hor abuurka', sw: 'Kurutubisha shamba kabla ya kupanda mazao makuu' }, maturityDays: '45 days' },
      { crop: { en: 'Sweet Potato Vines (Nursery)', so: 'Geedka Bataatada Macaan', sw: 'Mavazi ya Viazi Vitamu' }, reason: { en: 'Multiply disease-free cuttings for upcoming rains', so: 'Badi caleemaha caafimaadka qaba ee roobka cusub', sw: 'Kuotesha vikonyo visivyo na magonjwa' }, maturityDays: '90-120 days' }
    ],
    defaultCompanion: {
      main: { en: 'Maize', so: 'Galleyda', sw: 'Mahindi' },
      companion: { en: 'Beans / Cowpeas', so: 'Digir', sw: 'Maharage' },
      benefit: { en: 'Rhizobial bacteria fix nitrogen directly for root uptake', so: 'Bakteeriyada xididka oo carrada siisa nafaqo', sw: 'Bakteria za mizizi hutoa rutuba ya asili' }
    }
  },
  // 2: March
  {
    name: { en: 'March', so: 'Maarso', sw: 'Machi' },
    seasonPhase: { en: 'Main Rainy Season Sowing Window (Gu Onset)', so: 'Bilawga Xilliga Roobabka Guuga (Abuurka Guud)', sw: 'Mwanzo wa Mvua za Masika (Upandaji Mkuu)' },
    climateContext: { en: 'Onset of primary seasonal rains, steady soil re-wetting, optimal seed germination.', so: 'Bilowga roobka weyn, carrada oo qoyaan fiican hesha.', sw: 'Mvua kuu kuanza, udongo kupata unyevu bora kwa mbegu.' },
    generalSowingList: [
      { crop: { en: 'Main-Season Maize (Hybrid/OPV)', so: 'Galleyda Xilliga Guuga', sw: 'Mahindi ya Msimu Mkuu' }, reason: { en: 'Full vegetative development supported by sustained rains', so: 'Biyo ku filan korriinka caleenta iyo xasiloonida', sw: 'Mvua za kutosha kukuza shina na mazao' }, maturityDays: '110-130 days' },
      { crop: { en: 'Cassava (Stem Cuttings)', so: 'Kasaafada / Qasabada', sw: 'Muhogo' }, reason: { en: 'Root establishment during peak moisture availability', so: 'Xididaysiga wanaagsan xilliga qoyaanku badan yahay', sw: 'Kushika mizizi haraka wakati wa unyevu' }, maturityDays: '9-12 months' },
      { crop: { en: 'Common Climbing Beans', so: 'Digirta Fuulada', sw: 'Maharage ya Kupanda' }, reason: { en: 'Intercropped along maize stalks for spatial efficiency', so: 'Ku dhex-beerta galleyda si meel yar looga faa\'iidaysto', sw: 'Kupandwa pamoja na mahindi kuokoa nafasi' }, maturityDays: '65-75 days' }
    ],
    defaultCompanion: {
      main: { en: 'Maize', so: 'Galley', sw: 'Mahindi' },
      companion: { en: 'Desmodium (Silverleaf)', so: 'Geedka Desmodium', sw: 'Desmodium' },
      benefit: { en: 'Push-pull stem borer suppression & nitrogen enhancement', so: 'Eryida cayayaanka galleyda gasha iyo hagaajinta nafaqada', sw: 'Kufukuza viwavi wa shina na kurutubisha ardhi' }
    }
  },
  // 3: April
  {
    name: { en: 'April', so: 'Abriil', sw: 'Aprili' },
    seasonPhase: { en: 'Peak Rains & Vegetative Growth Phase (Gu Active)', so: 'Roobka Xooggan & Korriinka Caleenta', sw: 'Kilele cha Mvua za Masika & Ukuaji wa Majani' },
    climateContext: { en: 'High relative humidity (>80%), continuous leaf wetness, peak vegetative growth.', so: 'Huurka oo sareeya (>80%), caleemaha oo biyo badan hela.', sw: 'Unyevu mwingi angani (>80%), majani kubaki na maji muda mrefu.' },
    generalSowingList: [
      { crop: { en: 'Fast-Cycle Leafy Greens (Amaranth/Kale)', so: 'Khaudaarta Dhaqsaha u Baxda', sw: 'Mchicha na Sukuma Wiki' }, reason: { en: 'Harvest within 25 days under optimal rainfall', so: 'Goosasho degdeg ah 25 maalmood gudahood', sw: 'Kuvuna mapema ndani ya siku 25' }, maturityDays: '25-35 days' },
      { crop: { en: 'Pigeon Peas (Long Duration)', so: 'Digirta Dheer (Pigeon Pea)', sw: 'Mbaazi' }, reason: { en: 'Deep taproot formation to anchor through season', so: 'Xididdada oo si qoto dheer carrada u qabsada', sw: 'Mizizi kwenda chini kuzuia mmomonyoko' }, maturityDays: '150-180 days' }
    ],
    defaultCompanion: {
      main: { en: 'Tomato', so: 'Yaanyo', sw: 'Nyanya' },
      companion: { en: 'African Marigold', so: 'Ubaxa Marigold', sw: 'Maua ya Marigold' },
      benefit: { en: 'Root exudates suppress parasitic nematodes & fungal spores', so: 'Kahortagga gooryaanka ciidda iyo fangaska', sw: 'Kufukuza minyoo hatari ya mizizi ardhini' }
    }
  },
  // 4: May
  {
    name: { en: 'May', so: 'May', sw: 'Mei' },
    seasonPhase: { en: 'Mid-Season Weeding & Organic Top-Dressing', so: 'Nadiifinta Hararka & Bacriminta Dabiiciga ah', sw: 'Kupalilia & Kuweka Mbolea ya Asili' },
    climateContext: { en: 'Rainfall tapering off, high canopy density, warm microclimate under leaves.', so: 'Roobka oo yaraanaya, caleemaha oo isku daboolan.', sw: 'Mvua kuanza kupungua, vichaka kuwa vizito na joto chini ya majani.' },
    generalSowingList: [
      { crop: { en: 'Cowpeas (Short Duration)', so: 'Digirta Cagaaran', sw: 'Kunde za Haraka' }, reason: { en: 'Captures residual soil moisture for quick late-season pod fill', so: 'Ka faa\'iidaysiga qoyaanka hadhay ee ciidda', sw: 'Kutumia unyevu uliobaki ardhini kukamilisha mbegu' }, maturityDays: '60 days' },
      { crop: { en: 'Butternut Squash / Pumpkin', so: 'Bocor / Qare', sw: 'Maboga' }, reason: { en: 'Broad leaves suppress late weeds and shield topsoil', so: 'Caleemo waawayn oo hararka celiya ciiddana ilaaliya', sw: 'Majani mapana huzuia magugu na kulinda udongo' }, maturityDays: '85-95 days' }
    ],
    defaultCompanion: {
      main: { en: 'Cassava', so: 'Kasaafada', sw: 'Muhogo' },
      companion: { en: 'Groundnuts', so: 'Lawska Dhulka', sw: 'Karanga' },
      benefit: { en: 'Low-growing living mulch prevents water run-off', so: 'Dabool dabiici ah oo biyaha ordaya celiya', sw: 'Hutandaa ardhini na kuzuia maji kutoroka' }
    }
  },
  // 5: June
  {
    name: { en: 'June', so: 'Juun', sw: 'Juni' },
    seasonPhase: { en: 'Late Grain Filling & Pest Scouting (Hagaa Transition)', so: 'Bislaanshaha Midhaha & Ilaalinta Cayayaanka', sw: 'Kukomaa kwa Nafaka & Ukaguzi wa Wadudu' },
    climateContext: { en: 'Cooler winds, intermittent light showers, ripening canopies.', so: 'Dabaylo qabow, roobab teel-teel ah, dalagga oo bislaanaya.', sw: 'Upepo wa baridi, mvua ndogo za hapa na pale, nafaka kukomaa.' },
    generalSowingList: [
      { crop: { en: 'Bulb Onions (Nursery Seedlings)', so: 'Basasha Madaxa ah', sw: 'Vitunguu Maji' }, reason: { en: 'Cooler nighttime temperatures stimulate bulb initiation', so: 'Habeenkii qabowgu wuxuu caawiyaa weynaanta basasha', sw: 'Hali ya ubaridi usiku husaidia vitunguu kufunga vizuri' }, maturityDays: '100-120 days' },
      { crop: { en: 'Carrots', so: 'Karootada', sw: 'Karoti' }, reason: { en: 'Deep loose soil post-tillage produces straight taproots', so: 'Carrada jilicsan waxay soo saartaa karooto toosan', sw: 'Hustawi vyema kwenye udongo uliotifuliwa' }, maturityDays: '70-80 days' }
    ],
    defaultCompanion: {
      main: { en: 'Cabbage / Brassica', so: 'Kaabash', sw: 'Kabichi' },
      companion: { en: 'Coriander / Mint', so: 'Kabsar / Naanac', sw: 'Dania / Nanaa' },
      benefit: { en: 'Strong aromatics mask host plants from diamondback moths', so: 'Udugga adag oo cayayaanka ka lumiya kaabashka', sw: 'Harufu kali huchanganya nondo waharibifu' }
    }
  },
  // 6: July
  {
    name: { en: 'July', so: 'Luuliyo', sw: 'Julai' },
    seasonPhase: { en: 'Main Season Grain Harvest & Irrigated Horticulture', so: 'Gurashada Galleyda & Beerista Khudaarta Waraabka', sw: 'Kuvuna Nafaka Kuu & Mboga za Maji' },
    climateContext: { en: 'Coolest month of the agrarian cycle, overcast skies, low evapotranspiration.', so: 'Bisha ugu qabow sanadka, daruuro badan, biyo yaraan yar.', sw: 'Mwezi wenye baridi zaidi, mawingu mengi, udongo kubaki na unyevu.' },
    generalSowingList: [
      { crop: { en: 'Fresh Market Tomatoes (Raised Beds)', so: 'Yaanyada Sariiraha Sare', sw: 'Nyanya kwenye Matuta' }, reason: { en: 'Lower humidity reduces early foliar fungal pressure', so: 'Huurka yar wuxuu yareeyaa cudurrada fangaska caleenta', sw: 'Unyevu mdogo hupunguza magonjwa ya fangasi' }, maturityDays: '75-90 days' },
      { crop: { en: 'Green Beans (French Beans)', so: 'Digirta Cagaaran ee Casriga ah', sw: 'Maharage Machanga' }, reason: { en: 'High market value and rapid turn-around with furrow irrigation', so: 'Qiimo suuqeed sarreeya iyo goosasho degdeg ah', sw: 'Thamani kubwa sokoni na mavuno ya haraka' }, maturityDays: '50-60 days' }
    ],
    defaultCompanion: {
      main: { en: 'Tomato', so: 'Yaanyo', sw: 'Nyanya' },
      companion: { en: 'Sweet Basil', so: 'Geedka Raxanka (Basil)', sw: 'Rehani (Basil)' },
      benefit: { en: 'Enhances tomato vigor and deters hornworms and thrips', so: 'Kordhinta carafta yaanyada iyo cayayaan eryidda', sw: 'Inaboresha ukuaji wa nyanya na kuzuia wadudu' }
    }
  },
  // 7: August
  {
    name: { en: 'August', so: 'Agoosto', sw: 'Agosti' },
    seasonPhase: { en: 'Soil Solarization & Cover Crop Incorporation', so: 'Nadiifinta Ciidda Qorraxda & Bacriminta', sw: 'Kuanika Shamba Juani & Maandalizi ya Pili' },
    climateContext: { en: 'Dry, sunny, high solar irradiance ideal for soil pathogen sanitization.', so: 'Qorrax kulul oo ku habboon in ciidda lagu dillo bakteeriyada.', sw: 'Jua kali linalofaa kuanika udongo kuua vijidudu na magugu.' },
    generalSowingList: [
      { crop: { en: 'Drought-Tolerant Sorghum (Early Sowing)', so: 'Masagada Adkaysiga Leh', sw: 'Mtama Unaostahimili Ukame' }, reason: { en: 'Requires minimal water to establish initial root system', so: 'Biyo yar oo ku filan bilowga xididdada', sw: 'Huhitaji maji kidogo kuanzisha mizizi' }, maturityDays: '90-110 days' },
      { crop: { en: 'Sesame (Simsim)', so: 'Sisinta', sw: 'Ufuta' }, reason: { en: 'Excellent heat tolerance and low nitrogen input demand', so: 'U adkaysiga kulaylka iyo baahida yar ee nafaqada', sw: 'Ustahimilivu bora wa joto kali' }, maturityDays: '80-90 days' }
    ],
    defaultCompanion: {
      main: { en: 'Sorghum', so: 'Masago', sw: 'Mtama' },
      companion: { en: 'Pigeon Peas', so: 'Digirta Geedka ah', sw: 'Mbaazi' },
      benefit: { en: 'Deep rooted companion balances soil nutrients without competition', so: 'Isku dheelitirka nafaqada iyadoo aan la isku cariirin', sw: 'Kushirikiana ardhini bila kushindania rutuba' }
    }
  },
  // 8: September (CURRENT MONTH: September 2026)
  {
    name: { en: 'September', so: 'Sebtembar', sw: 'Septemba' },
    seasonPhase: { en: 'Secondary Sowing Pre-Window (Deyr / Short Rains Prep)', so: 'Diyaarinta Abuurka Roobabka Deyrta', sw: 'Maandalizi ya Upandaji wa Mvua Fupi (Vuli)' },
    climateContext: { en: 'Transition from cool dry winds to rising humidity and onset of short rains (Deyr). Ideal for land furrowing and short-cycle drought-tolerant crop sowing.', so: 'Kala guurka xilliga qabow iyo bilowga roobabka Deyrta. Waa xilliga ugu habboon diyaarinta beerta iyo abuurka gaaban.', sw: 'Kipindi cha mpito kuelekea mvua fupi za vuli. Wakati mwafaka wa kutayarisha mitaro na kupanda mbegu za muda mfupi.' },
    generalSowingList: [
      { crop: { en: 'Short-Cycle Maize (Drought Hardy, 85-Day)', so: 'Galleyda Dhaqsaha u Baxda (85 Maalmood)', sw: 'Mahindi ya Muda Mfupi (Siku 85)' }, reason: { en: 'Capitalizes on short-rain moisture without getting trapped in mid-season dry spells', so: 'Ka faa\'iidaysiga roobka kooban ee deyrta ka hor qallaylka', sw: 'Kuvuna kabla ya mvua fupi kuisha' }, maturityDays: '80-90 days' },
      { crop: { en: 'Green Grams / Mung Beans', so: 'Digirta Cagaaran (Mung Bean)', sw: 'Choroko' }, reason: { en: 'Fast pod maturity in 60 days with high market cash returns', so: 'Bislaansho degdeg ah 60 maalmood gudahood iyo faa\'iido wanaagsan', sw: 'Kukomaa haraka ndani ya siku 60 na faida kubwa sokoni' }, maturityDays: '60-65 days' },
      { crop: { en: 'Cowpeas (Dual Purpose: Grain + Foliage)', so: 'Digirta Labada Faa\'iido Leh', sw: 'Kunde za Majani na Mbegu' }, reason: { en: 'Tolerates erratic rain bursts, fixes atmospheric nitrogen, controls weeds', so: 'U adkaysiga roobabka isbeddelaaya iyo hagaajinta bacriminta ciidda', sw: 'Ustahimilivu wa mvua za kubahatisha na kurutubisha shamba' }, maturityDays: '65-75 days' },
      { crop: { en: 'Kale & Spinach (Direct Transplanting)', so: 'Khaudaarta Cagaaran (Kaabashka Caleenta)', sw: 'Sukuma Wiki na Mchicha' }, reason: { en: 'Rapid leaf harvest every 7 days as temperatures moderate', so: 'Goosashada caleenta toddobaad kasta marka heerkulku dhexdhexaad noqdo', sw: 'Kuvuna kila wiki joto linapopungua' }, maturityDays: '40-50 days' }
    ],
    defaultCompanion: {
      main: { en: 'Maize', so: 'Galleyda', sw: 'Mahindi' },
      companion: { en: 'Cowpeas or Bush Beans', so: 'Digirta Dhulka', sw: 'Kunde au Maharage Mfupi' },
      benefit: { en: 'Suppresses soil moisture loss, adds nitrogen, and deters weed colonization', so: 'Ilaalinta qoyaanka ciidda, ku daridda nitrogen, iyo xakamaynta hararka', sw: 'Kuzuia ardhi kukauka, kuweka rutuba asili na kuzuia magugu' }
    }
  },
  // 9: October
  {
    name: { en: 'October', so: 'Oktoobar', sw: 'Oktoba' },
    seasonPhase: { en: 'Short Rains Active Sowing & Germination (Peak Deyr)', so: 'Xilliga Abuurka Tooska ah ee Deyrta', sw: 'Upandaji Kamili wa Mvua za Vuli' },
    climateContext: { en: 'Steady rainfall showers, warm soil temperatures, rapid seed emergence.', so: 'Roobab xiriir ah, carro diirran, iyo abuurka oo dhaqso u dillaaca.', sw: 'Mvua za kutosha, ardhi vuguvugu, mbegu kuota haraka.' },
    generalSowingList: [
      { crop: { en: 'Dryland Beans & Cowpeas', so: 'Digirta Dhulka Abaaraha', sw: 'Maharage ya Maeneo Kavu' }, reason: { en: 'High seedling vigor under moderate October rains', so: 'Korriin xooggan xilliga roobka Oktoobar', sw: 'Mimea kuota kwa nguvu chini ya mvua ya Oktoba' }, maturityDays: '70 days' },
      { crop: { en: 'Sweet Potato Vines', so: 'Geedka Bataatada Macaan', sw: 'Vikonyo vya Viazi Vitamu' }, reason: { en: 'Vigorous runner spread covers ground before rains terminate', so: 'Caleemaha oo si degdeg ah dhulka ugu fida', sw: 'Hutandaa haraka kabla ya mvua kukatika' }, maturityDays: '100-110 days' }
    ],
    defaultCompanion: {
      main: { en: 'Maize', so: 'Galley', sw: 'Mahindi' },
      companion: { en: 'Beans', so: 'Digir', sw: 'Maharage' },
      benefit: { en: 'Ground-covering foliage traps early dew and reduces soil splash pathogens', so: 'Daboolka caleenta oo celiya qoyaanka subaxdii', sw: 'Majani huzuia mchanga kurukia mimea wakati wa mvua' }
    }
  },
  // 10: November
  {
    name: { en: 'November', so: 'Nofeembar', sw: 'Novemba' },
    seasonPhase: { en: 'Foliar Health Monitoring & Weed Clearance', so: 'Ilaalinta Caafimaadka Caleenta & Jarista Hararka', sw: 'Kupalilia & Kulinda Afya ya Majani' },
    climateContext: { en: 'Moderate showers, high morning dew, critical window for foliar pathogen scouting.', so: 'Dharabka subaxdii oo badan, xilliga baaritaanka cudurrada caleenta.', sw: 'Umande mwingi asubuhi, wakati muhimu wa kuangalia magonjwa ya majani.' },
    generalSowingList: [
      { crop: { en: 'Coriander & African Basil (Companion Herbs)', so: 'Kabsar iyo Raxan (Herbs)', sw: 'Dania na Rehani' }, reason: { en: 'Pungent aroma repels late aphid vectors and whiteflies', so: 'Carafta xooggan oo cayayaanka ka fogeysa beerta', sw: 'Harufu kali hufukuza wadudu waharibifu' }, maturityDays: '35-45 days' },
      { crop: { en: 'Radishes & Quick Turnips', so: 'Fadhis / Kuulbix', sw: 'Figili za Haraka' }, reason: { en: 'Fast root crop filling between primary rows', so: 'Dalag degdeg ah oo safafka dhexdooda lagu beero', sw: 'Hukomaa haraka katikati ya mistari ya mazao' }, maturityDays: '28-35 days' }
    ],
    defaultCompanion: {
      main: { en: 'Tomato', so: 'Yaanyo', sw: 'Nyanya' },
      companion: { en: 'Garlic / Chives', so: 'Toon / Basal Cagaaran', sw: 'Kitunguu Saumu' },
      benefit: { en: 'Natural sulfur volatile emission deters fungal spore germination', so: 'Uumiga toonta oo ka hortaga dillaaca fangaska', sw: 'Moshi wa asili wa kitunguu saumu huzuia ukungu' }
    }
  },
  // 11: December
  {
    name: { en: 'December', so: 'Diseembar', sw: 'Desemba' },
    seasonPhase: { en: 'Short Rains Harvest & Dry Mulch Application', so: 'Goosashada Deyrta & Dhigista Xaadheedhka', sw: 'Kuvuna Mvua za Vuli & Kutandaza Majani Makavu' },
    climateContext: { en: 'Rains subsiding, cloud cover clearing, wind speeds increasing.', so: 'Roobka oo yaraanaya, qorraxda oo soo baxda, dabaysha oo kororta.', sw: 'Mvua kuisha, jua kuanza kuchomoza, upepo kuongezeka.' },
    generalSowingList: [
      { crop: { en: 'Drought-Hardy Pigeon Peas', so: 'Digirta Geedka ah', sw: 'Mbaazi' }, reason: { en: 'Continues flowering through the dry season with deep root tap', so: 'Wuxuu sii wadaa ubaxa xilliga qallalan xididkiisa dheer dartiis', sw: 'Hustawi hata jua likiwaka kutokana na mizizi mirefu' }, maturityDays: '120-150 days' },
      { crop: { en: 'Watermelon (Irrigated Basins)', so: 'Xabxabka Waraabka', sw: 'Tikiti Maji' }, reason: { en: 'Thrives in increasing sunshine with controlled furrow irrigation', so: 'Ku baxa qorraxda badan iyo waraabka tooska ah', sw: 'Hupenda jua kali na umwagiliaji mzuri' }, maturityDays: '75-85 days' }
    ],
    defaultCompanion: {
      main: { en: 'Maize', so: 'Galley', sw: 'Mahindi' },
      companion: { en: 'Dry Straw Mulch', so: 'Caws Qallalan (Mulch)', sw: 'Majani Makavu (Mulch)' },
      benefit: { en: 'Traps residual moisture in root zone into the upcoming dry spell', so: 'Ilaalinta qoyaanka xididka xilliga jiilaalka soo socda', sw: 'Kuhifadhi unyevu ardhini msimu wa jua unapoanza' }
    }
  }
];

/**
 * Intelligent seasonal planting recommendation engine tailored to the current month
 * and the user's historical scan diagnoses.
 */
export function getSeasonalPlantingTips(
  history: ScanHistoryEntry[],
  targetMonthIndex: number = new Date().getMonth(),
  language: Language = 'en'
): SeasonalPlantingAdvice {
  // Normalize month index
  const safeMonthIndex = Math.max(0, Math.min(11, targetMonthIndex));
  const monthInfo = MONTH_DATA[safeMonthIndex];

  // 1. Extract and normalize scanned crops from user's history
  const scannedCropsMap = new Map<string, {
    count: number;
    highestSeverity: string;
    pathogens: Set<string>;
    diseases: Set<string>;
  }>();

  history.forEach(item => {
    const rawCrop = (item.cropName || 'Field Crop').trim();
    // Normalize e.g. "Maize (Corn)" -> "Maize"
    const normalizedCrop = rawCrop.split('(')[0].trim();

    const existing = scannedCropsMap.get(normalizedCrop) || {
      count: 0,
      highestSeverity: 'Healthy',
      pathogens: new Set<string>(),
      diseases: new Set<string>()
    };

    existing.count += 1;
    if (item.disease.name && item.disease.name !== 'Healthy Foliage') {
      existing.diseases.add(item.disease.name);
    }
    if (item.disease.pathogenType && item.disease.pathogenType !== 'Healthy') {
      existing.pathogens.add(item.disease.pathogenType);
    }
    if (item.severity === 'Critical' || (item.severity === 'High' && existing.highestSeverity !== 'Critical')) {
      existing.highestSeverity = item.severity;
    }

    scannedCropsMap.set(normalizedCrop, existing);
  });

  const uniqueScannedCrops = Array.from(scannedCropsMap.keys());
  const allDetectedPathogens = Array.from(
    new Set(Array.from(scannedCropsMap.values()).flatMap(v => Array.from(v.pathogens)))
  );

  const tips: SeasonalPlantingTip[] = [];
  let rotationWarning: string | undefined = undefined;

  // 2. Personalize Advice based on User's Scanned History
  const hasTomatoScan = uniqueScannedCrops.some(c => c.toLowerCase().includes('tomato'));
  const hasMaizeScan = uniqueScannedCrops.some(c => c.toLowerCase().includes('maize') || c.toLowerCase().includes('corn'));
  const hasCassavaScan = uniqueScannedCrops.some(c => c.toLowerCase().includes('cassava'));
  const hasPotatoScan = uniqueScannedCrops.some(c => c.toLowerCase().includes('potato'));

  // Disease specific flags
  const hasFungalHistory = allDetectedPathogens.includes('Fungus');
  const hasViralHistory = allDetectedPathogens.includes('Virus');

  // Generate Crop Rotation Rule if Fungal issues were scanned on Solanaceae
  if (hasTomatoScan || hasPotatoScan) {
    const solanaceaeEntry = scannedCropsMap.get('Tomato') || scannedCropsMap.get('Potato');
    const solanaceaeHasFungus = solanaceaeEntry?.pathogens.has('Fungus') || hasFungalHistory;

    if (solanaceaeHasFungus) {
      if (language === 'so') {
        rotationWarning = 'DIGNIIN BEDDELKA BEERTA: Maadaama yaanyada/baradhada aad horay u baartay ay lahaayeen cudurrada fangaska (Blight/Spot), ha ku celin isla dhulkaas xilligan. U beddel beerta digirta ama galleyda si aad u joojiso wareegga cudurka.';
      } else if (language === 'sw') {
        rotationWarning = 'ONYO LA MZUNGUKO WA MAZAO: Kwa kuwa nyanya au viazi vilivyochanganuliwa viliathiriwa na ukungu (Blight), epuka kupanda tena familia ya nyanya kwenye eneo lile lile msimu huu. Pandisha kunde au mahindi kuvunja mzunguko wa ugonjwa.';
      } else {
        rotationWarning = 'CROP ROTATION ALERT: Your scanned Solanaceae (Tomato/Potato) exhibited foliar fungal blights. Avoid planting nightshades in the same plot this season. Rotate immediately with nitrogen-fixing legumes (Cowpeas, Beans) or cereals to starve out soil-borne fungal spores.';
      }

      tips.push({
        title: language === 'so' ? 'Beddelka Dalagga ee Beerta (IPM Rotation)' : language === 'sw' ? 'Mzunguko Salama wa Mazao (IPM)' : 'Nightshade Crop Rotation Protocol',
        description: language === 'so' 
          ? 'Ku beero digirta (Cowpeas ama Green Grams) meelihii yaanyadu ku jirtay si carrada loogu celiyo bacriminta loona tirtiro fangaska.'
          : language === 'sw'
          ? 'Panda kunde au choroko kwenye sehemu iliyokuwa na nyanya ili kurutubisha ardhi na kumaliza spora za ukungu.'
          : 'Plant cowpeas or green grams in previous tomato beds to interrupt fungal pathogen cycles and fix natural root nitrogen.',
        category: 'rotation',
        targetScannedCrop: 'Tomato / Potato',
        badge: 'Critical Rotation',
        recommendedCrops: ['Cowpeas', 'Mung Beans', 'Sweet Potatoes']
      });
    }
  }

  // Sowing tip for Maize farmers
  if (hasMaizeScan) {
    if (safeMonthIndex >= 8 && safeMonthIndex <= 10) { // Sept, Oct, Nov
      tips.push({
        title: language === 'so' ? 'Abuurka Galleyda ee Xilliga Gaaban' : language === 'sw' ? 'Upandaji wa Mahindi ya Haraka' : 'Early Short-Cycle Maize Sowing',
        description: language === 'so'
          ? 'Dooro abuurka galleyda ee 80-90 maalmood ku baxa. Ku beero fogaan ah 75cm x 25cm si ay u hesho qoyaan ku filan deyrta.'
          : language === 'sw'
          ? 'Chagua mbegu za mahindi ya siku 80-90. Panda kwa nafasi ya 75cm kwa 25cm ili kuhifadhi unyevu wakati wa mvua fupi.'
          : 'Select drought-hardy 80-90 day certified maize seed. Sow at 75cm x 25cm spacing with legume intercropping to balance moisture.',
        category: 'sowing',
        targetScannedCrop: 'Maize (Corn)',
        badge: 'Tailored for Your Maize',
        recommendedCrops: ['Drought-Tolerant Maize', 'Desmodium', 'Bush Beans']
      });
    } else {
      tips.push({
        title: language === 'so' ? 'Ilaalinta Galleyda & Bacriminta' : language === 'sw' ? 'Utunzaji wa Mahindi & Mboji' : 'Maize Plot Nitrogen Replenishment',
        description: language === 'so'
          ? 'Kordhi dambaska qoryaha iyo digada xoolaha si jiridda galleydu u noqoto mid adag oo u adkaysata dabaysha.'
          : language === 'sw'
          ? 'Tumia mbolea ya samadi na majivu ya miti kuimarisha shina la mahindi dhidi ya upepo na wadudu.'
          : 'Incorporate well-rotted farmyard manure and wood-ash to bolster stalk silica and deter stem borers.',
        category: 'soil',
        targetScannedCrop: 'Maize (Corn)',
        badge: 'Soil Nutrition'
      });
    }
  }

  // Virus prevention for Cassava farmers
  if (hasCassavaScan && (hasViralHistory || scannedCropsMap.get('Cassava')?.pathogens.has('Virus'))) {
    tips.push({
      title: language === 'so' ? 'Abuurka Kasaafada oo Ka Caagan Fayraska' : language === 'sw' ? 'Vikonyo Safi vya Muhogo Bila Virusi' : 'Clean Stem Selection for Cassava',
      description: language === 'so'
        ? 'Isticmaal laamo caafimaad qaba oo 25cm ah, kana ilaali duqsiga cad (whitefly) bilowga korriinka adigoo ku dhex beeraya lawska.'
        : language === 'sw'
        ? 'Tumia vikonyo vyenye afya vya 25cm visivyo na dalili za virusi, na panda karanga katikati kufunika ardhi.'
        : 'Source certified CMD-tolerant cuttings (20-25cm length). Intercrop with groundnuts to shield bare soil and lower whitefly vector flights.',
      category: 'pest_prevention',
      targetScannedCrop: 'Cassava',
      badge: 'Virus Containment',
      recommendedCrops: ['Certified Cassava Cuttings', 'Groundnuts']
    });
  }

  // Seasonal Sowing Tip for Current Month
  const generalSowingCrops = monthInfo.generalSowingList.map(g => g.crop[language] || g.crop.en);
  tips.push({
    title: language === 'so' 
      ? `Dalagyada Lagu Taliyay Bisha ${monthInfo.name[language]}`
      : language === 'sw'
      ? `Mazao ya Kupanda Mwezi wa ${monthInfo.name[language]}`
      : `Recommended Sowing for ${monthInfo.name.en}`,
    description: language === 'so'
      ? `Bishan ${monthInfo.name.so}, xaaladda cimiladu waxay ku habboon tahay: ${generalSowingCrops.slice(0, 3).join(', ')}. ${monthInfo.climateContext[language]}`
      : language === 'sw'
      ? `Mwezi huu wa ${monthInfo.name.sw}, hali ya hewa inafaa sana: ${generalSowingCrops.slice(0, 3).join(', ')}. ${monthInfo.climateContext[language]}`
      : `This month (${monthInfo.name.en}) is prime for: ${generalSowingCrops.slice(0, 3).join(', ')}. ${monthInfo.climateContext.en}`,
    category: 'sowing',
    badge: 'Seasonal Window',
    recommendedCrops: generalSowingCrops
  });

  // Moisture & Soil Prep Tip
  tips.push({
    title: language === 'so' ? 'Daboolista Carrada & Ilaalinta Biyaha (Mulching)' : language === 'sw' ? 'Kuhifadhi Unyevu wa Udongo (Matandazo)' : 'Foliar Protection & Moisture Retention',
    description: language === 'so'
      ? 'Dhig caws qallalan oo dhumucdiisu tahay 5cm geedaha hareerahooda si biyaha aysan u uumin dhibcaha roobkuna aysan carada ugu boodin caleenta.'
      : language === 'sw'
      ? 'Weka matandazo ya majani makavu ya unene wa 5cm kuzuia maji kutoroka na kuzuia tope lisirukie majani wakati wa mvua.'
      : 'Maintain a 5cm clean organic mulch layer to reduce soil moisture evaporation and prevent rain-splash from transporting soil-borne pathogens onto lower leaves.',
    category: 'soil',
    badge: 'Field Hygiene'
  });

  // Construct final recommendations list localized
  const recommendedSowingList = monthInfo.generalSowingList.map(item => ({
    crop: item.crop[language] || item.crop.en,
    reason: item.reason[language] || item.reason.en,
    maturityDays: item.maturityDays
  }));

  const companionPairing = {
    main: monthInfo.defaultCompanion.main[language] || monthInfo.defaultCompanion.main.en,
    companion: monthInfo.defaultCompanion.companion[language] || monthInfo.defaultCompanion.companion.en,
    benefit: monthInfo.defaultCompanion.benefit[language] || monthInfo.defaultCompanion.benefit.en
  };

  return {
    monthIndex: safeMonthIndex,
    monthName: monthInfo.name[language] || monthInfo.name.en,
    seasonPhase: monthInfo.seasonPhase[language] || monthInfo.seasonPhase.en,
    climateContext: monthInfo.climateContext[language] || monthInfo.climateContext.en,
    scannedCropsAnalyzed: uniqueScannedCrops.length > 0 ? uniqueScannedCrops : ['General Garden Crops'],
    detectedPathogens: allDetectedPathogens,
    topTips: tips.slice(0, 4), // Keep small and punchy
    recommendedSowingList,
    companionPairing,
    rotationWarning
  };
}
