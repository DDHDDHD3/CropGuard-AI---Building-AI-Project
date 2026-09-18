import { CropDisease } from '../types';

export const SAMPLE_CROPS: CropDisease[] = [
  {
    id: 'maize-nlb',
    crop: 'Maize (Corn)',
    name: 'Northern Corn Leaf Blight',
    scientificName: 'Exserohilum turcicum',
    pathogenType: 'Fungus',
    severity: 'High',
    confidence: 96.4,
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    description: 'A devastating foliar fungal disease causing large cigar-shaped necrotic lesions on maize leaves, leading to up to 50% yield loss in humid environments.',
    symptoms: [
      'Long, elliptical grayish-green or tan lesions (2.5 to 15 cm)',
      'Lesions develop parallel to leaf margins',
      'Dark olive fungal sporulation visible during damp mornings',
      'Premature leaf senescence reducing photosynthesis during ear filling'
    ],
    organicTreatment: [
      'Apply cold-pressed neem oil solution (0.5%) directly to affected lower canopy',
      'Prune and destroy severely infected lower leaves before spores blow upward',
      'Spray dilute bio-fungicide containing Bacillus subtilis',
      'Dust with screened wood ash to absorb surface leaf moisture'
    ],
    preventativeMeasures: [
      'Practice 2-year crop rotation with non-grass crops like legumes or cassava',
      'Plant certified blight-resistant hybrid varieties suited for semi-arid tropics',
      'Increase inter-row spacing to 75cm to improve sunlight penetration and air circulation',
      'Incorporate maize stubble into soil after harvest to accelerate decomposition'
    ],
    optimalConditions: {
      tempRange: '18°C - 27°C',
      humidityRange: '> 80% Relative Humidity',
      riskTrigger: 'Extended dew periods exceeding 6 consecutive hours'
    }
  },
  {
    id: 'tomato-eb',
    crop: 'Tomato',
    name: 'Early Blight',
    scientificName: 'Alternaria solani',
    pathogenType: 'Fungus',
    severity: 'Moderate',
    confidence: 94.8,
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    description: 'A common soil-splashed fungus characterized by concentric target-like rings on older leaves, progressing upwards to stems and fruit calyxes.',
    symptoms: [
      'Circular brown spots with distinctive concentric rings (target board pattern)',
      'Yellow chlorotic halos surrounding brown lesions',
      'Lower foliage dies and drops, exposing fruit to sunscald',
      'Dark leathery sunken lesions near the stem end of fruits'
    ],
    organicTreatment: [
      'Spray baking soda solution (1 tbsp sodium bicarbonate + 1 tsp vegetal soap per 4L water)',
      'Prune all leaves below the lowest flowering fruit cluster',
      'Apply fermented compost tea as a biological foliar shield',
      'Sterilize pruning shears between rows with 70% alcohol or boiling water'
    ],
    preventativeMeasures: [
      'Apply 5-8cm of dry straw mulch around base to prevent rain splashing spores from soil',
      'Stake or trellis tomato vines to keep foliage 30cm above the ground',
      'Water exclusively at the soil base or drip line; avoid overhead sprinkler wetting',
      'Avoid planting Solanaceae (peppers, eggplants, potatoes) in the same soil consecutively'
    ],
    optimalConditions: {
      tempRange: '24°C - 29°C',
      humidityRange: '> 75% Relative Humidity',
      riskTrigger: 'Frequent warm rainfall followed by hot humid afternoons'
    }
  },
  {
    id: 'cassava-cmd',
    crop: 'Cassava',
    name: 'Cassava Mosaic Disease (CMD)',
    scientificName: 'African Cassava Mosaic Geminivirus',
    pathogenType: 'Virus',
    severity: 'Critical',
    confidence: 98.2,
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
    description: 'One of the most destructive plant viruses in Sub-Saharan Africa, transmitted by the silverleaf whitefly (Bemisia tabaci) and vegetative cuttings.',
    symptoms: [
      'Severe yellow and green mosaic mottling across leaf lobes',
      'Marked leaf distortion, curling, and crinkling',
      'Stunted root tuber development and reduced starch accumulation',
      'Asymmetrical leaflets with reduced surface area'
    ],
    organicTreatment: [
      'Rogue (uproot) and burn heavily infected plants immediately to prevent whitefly vector spread',
      'Control whitefly populations using yellow sticky traps placed at canopy height',
      'Spray natural insecticidal soap or neem seed kernel extract on the undersides of leaves',
      'Never harvest cuttings from symptom-bearing mother plants for next season'
    ],
    preventativeMeasures: [
      'Source certified disease-free tissue culture stems or CMD-resistant varieties',
      'Intercrop with maize or sorghum to disrupt whitefly flight and wind currents',
      'Inspect fields weekly during the first 3 months of planting',
      'Establish community sanitary zones with neighboring smallholders'
    ],
    optimalConditions: {
      tempRange: '26°C - 34°C',
      humidityRange: '50% - 85% Relative Humidity',
      riskTrigger: 'High whitefly vector multiplication during early rainy season'
    }
  },
  {
    id: 'potato-lb',
    crop: 'Potato',
    name: 'Late Blight',
    scientificName: 'Phytophthora infestans',
    pathogenType: 'Fungus',
    severity: 'Critical',
    confidence: 97.1,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    description: 'The infamous water-mold oomycete responsible for catastrophic crop collapse within days during cool, damp fog or continuous drizzling rain.',
    symptoms: [
      'Water-soaked pale to dark brown spots that expand rapidly across leaves',
      'White cottony downy fungal mildew on undersides of leaves in high humidity',
      'Entire stems collapse and turn black with a characteristic rotten smell',
      'Tubers exhibit granular reddish-brown dry rot beneath the skin'
    ],
    organicTreatment: [
      'Copper hydroxide or Bordeaux mixture approved for certified organic horticulture',
      'Immediate removal and deep burial of blighted foliage before rain',
      'Spray bio-control Trichoderma harzianum to outcompete pathogen spores',
      'Harvest tubers only 2 weeks after all vines are dead to prevent spore transfer to tubers'
    ],
    preventativeMeasures: [
      'Ensure deep hilling of potato ridges (at least 15cm soil coverage over tubers)',
      'Select well-drained sloping land with excellent sunlight orientation',
      'Use certified disease-free seed tubers from reputable research institutes',
      'Monitor agro-climatic late blight advisory warning models'
    ],
    optimalConditions: {
      tempRange: '10°C - 20°C',
      humidityRange: '> 90% Relative Humidity',
      riskTrigger: 'Continuous leaf wetness for 10+ hours under cool overcast skies'
    }
  },
  {
    id: 'healthy-maize',
    crop: 'Maize (Corn)',
    name: 'Healthy Foliage',
    scientificName: 'Zea mays (Normal)',
    pathogenType: 'Healthy',
    severity: 'Healthy',
    confidence: 99.4,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    description: 'Vigorous chlorophyll synthesis, uniform leaf blade pigmentation, and absence of chlorosis or fungal pustules.',
    symptoms: [
      'Deep emerald green coloration with smooth leaf lamina',
      'Strong central midrib without vascular streaking',
      'No necrotic spotting, rust pustules, or insect chewing galleries',
      'Uniform vegetative growth corresponding to expected calendar stage'
    ],
    organicTreatment: [
      'No chemical or curative intervention required',
      'Maintain regular balanced organic nourishment (compost or composted manure)',
      'Apply preventative microbial inoculants to support root mycorrhizae'
    ],
    preventativeMeasures: [
      'Maintain adequate soil moisture via conservation tillage and mulching',
      'Regular scouting routine (twice weekly) during peak vegetative stages',
      'Maintain clean border buffer strips around field perimeter'
    ],
    optimalConditions: {
      tempRange: '20°C - 30°C',
      humidityRange: '50% - 70% Relative Humidity',
      riskTrigger: 'Optimal vegetative growth parameters'
    }
  },
  {
    id: 'banana-sigatoka',
    crop: 'Banana & Plantain',
    name: 'Black Sigatoka Leaf Spot',
    scientificName: 'Pseudocercospora fijiensis',
    pathogenType: 'Fungus',
    severity: 'High',
    confidence: 93.6,
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
    description: 'A major threat to banana production causing extensive leaf necrosis and premature ripening of fruit bunches.',
    symptoms: [
      'Minute reddish-rusty specks progressing into spindle-shaped dark brown streaks',
      'Streaks coalesce into large necrotic black patches with gray centers',
      'Leaf edges dry out and curl downwards prematurely',
      'Bunches fail to fill properly and ripen before harvest weight is reached'
    ],
    organicTreatment: [
      'De-leafing: surgically cut away infected portions of leaves with disinfected knife',
      'Spray mineral horticultural oil emulsified with biodegradable soap',
      'Foliar spray with aqueous garlic and chili botanical extract'
    ],
    preventativeMeasures: [
      'Plant at wider spacing (3m x 3m) and de-sucker regularly to reduce canopy shade',
      'Install deep drainage canals to prevent waterlogging around banana root mats',
      'Plant FHIA improved hybrid cultivars resistant to Sigatoka and Fusarium wilt'
    ],
    optimalConditions: {
      tempRange: '25°C - 29°C',
      humidityRange: '> 85% Relative Humidity',
      riskTrigger: 'Frequent rain showers with standing water in banana mats'
    }
  }
];
