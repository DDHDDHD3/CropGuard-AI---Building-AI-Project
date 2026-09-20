import { WeatherCondition, ClimateSmartAdvisory, Language } from '../types';

export interface WeatherPresetLocation {
  id: string;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

export const PRESET_FARMING_REGIONS: WeatherPresetLocation[] = [
  {
    id: 'afgooye',
    name: 'Afgooye / Shabelle Valley',
    region: 'Lower Shabelle',
    country: 'Somalia',
    lat: 2.1408,
    lon: 45.1206
  },
  {
    id: 'gabiley',
    name: 'Gabiley / Maroodi Jeex',
    region: 'Waqooyi Galbeed',
    country: 'Somaliland',
    lat: 9.7000,
    lon: 43.6231
  },
  {
    id: 'baidoa',
    name: 'Baidoa Agricultural Belt',
    region: 'Bay',
    country: 'Somalia',
    lat: 3.1138,
    lon: 43.6501
  },
  {
    id: 'jowhar',
    name: 'Jowhar Irrigation Scheme',
    region: 'Middle Shabelle',
    country: 'Somalia',
    lat: 2.7809,
    lon: 45.5006
  },
  {
    id: 'kismayo',
    name: 'Juba Riverine Basin',
    region: 'Lower Juba',
    country: 'Somalia',
    lat: -0.3582,
    lon: 42.5454
  },
  {
    id: 'nairobi',
    name: 'Nairobi / Central Highlands',
    region: 'Central',
    country: 'Kenya',
    lat: -1.2921,
    lon: 36.8219
  },
  {
    id: 'kampala',
    name: 'Lake Victoria Basin',
    region: 'Central',
    country: 'Uganda',
    lat: 0.3476,
    lon: 32.5825
  },
  {
    id: 'addis',
    name: 'Rift Valley / Oromia',
    region: 'Oromia',
    country: 'Ethiopia',
    lat: 8.5414,
    lon: 39.2689
  }
];

// Helper to decode WMO weather code to human-readable string and icon type
export function decodeWmoCode(code: number, language: Language = 'en'): { description: string; conditionType: 'clear' | 'partly_cloudy' | 'cloudy' | 'rain' | 'thunderstorm' | 'fog' } {
  switch (code) {
    case 0:
      return {
        description: language === 'so' ? 'Cir Saafi ah / Qorrax' : language === 'sw' ? 'Anga Safi / Jua' : 'Clear Sky',
        conditionType: 'clear'
      };
    case 1:
      return {
        description: language === 'so' ? 'Balaaran Saafi ah' : language === 'sw' ? 'Kiasi Safi' : 'Mainly Clear',
        conditionType: 'clear'
      };
    case 2:
      return {
        description: language === 'so' ? 'Daruuro Fudud' : language === 'sw' ? 'Mawingu Kiasi' : 'Partly Cloudy',
        conditionType: 'partly_cloudy'
      };
    case 3:
      return {
        description: language === 'so' ? 'Cir Daruuro Leh' : language === 'sw' ? 'Mawingu Mazito' : 'Overcast',
        conditionType: 'cloudy'
      };
    case 45:
    case 48:
      return {
        description: language === 'so' ? 'Ceeryaamo / Qiiq' : language === 'sw' ? 'Ukungu' : 'Fog & Dew Mist',
        conditionType: 'fog'
      };
    case 51:
    case 53:
    case 55:
      return {
        description: language === 'so' ? 'Dhibicyo Roob / Fudud' : language === 'sw' ? 'Manyunyu ya Mvua' : 'Light Drizzle',
        conditionType: 'rain'
      };
    case 61:
    case 63:
      return {
        description: language === 'so' ? 'Roob Dhexdhexaad ah' : language === 'sw' ? 'Mvua ya Kawaida' : 'Moderate Rain',
        conditionType: 'rain'
      };
    case 65:
      return {
        description: language === 'so' ? 'Roob Xooggan' : language === 'sw' ? 'Mvua Kubwa' : 'Heavy Rain',
        conditionType: 'rain'
      };
    case 80:
    case 81:
    case 82:
      return {
        description: language === 'so' ? 'Mahiigaan Roob' : language === 'sw' ? 'Mvua ya Radi na Upepo' : 'Rain Showers',
        conditionType: 'rain'
      };
    case 95:
    case 96:
    case 99:
      return {
        description: language === 'so' ? 'Duufaan & Hillaac' : language === 'sw' ? 'Dhoruba ya Radi' : 'Thunderstorm',
        conditionType: 'thunderstorm'
      };
    default:
      return {
        description: language === 'so' ? 'Daruuro Dhexdhexaad ah' : language === 'sw' ? 'Hali ya Mawingu' : 'Partly Cloudy',
        conditionType: 'partly_cloudy'
      };
  }
}

// Fallback Mock Service for realistic Agrometeorological conditions
export function getMockWeather(
  lat: number = 2.1408,
  lon: number = 45.1206,
  locationName: string = 'Afgooye / Shabelle Valley',
  region: string = 'Lower Shabelle',
  country: string = 'Somalia',
  presetType: 'standard' | 'high_humidity' | 'arid_heat' | 'stormy' = 'standard'
): WeatherCondition {
  let temp = 28.5;
  let humidity = 74;
  let wind = 14;
  let rain = 2.4;
  let rainProb = 35;
  let code = 2; // partly cloudy

  if (presetType === 'high_humidity') {
    temp = 24.2;
    humidity = 88;
    wind = 18;
    rain = 14.5;
    rainProb = 85;
    code = 63; // moderate rain
  } else if (presetType === 'arid_heat') {
    temp = 34.8;
    humidity = 38;
    wind = 12;
    rain = 0.0;
    rainProb = 5;
    code = 0; // clear
  } else if (presetType === 'stormy') {
    temp = 22.0;
    humidity = 92;
    wind = 32;
    rain = 28.0;
    rainProb = 95;
    code = 95; // thunderstorm
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIndex = new Date().getDay();

  const dailyForecast = Array.from({ length: 5 }, (_, i) => {
    const day = daysOfWeek[(todayIndex + i) % 7];
    return {
      date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
      dayName: i === 0 ? 'Today' : day,
      tempMax: Math.round(temp + 2 + Math.sin(i) * 2),
      tempMin: Math.round(temp - 4 + Math.cos(i) * 1.5),
      precipitationSum: i === 0 ? rain : Number((Math.max(0, Math.sin(i * 1.2) * 8)).toFixed(1)),
      weatherCode: i === 0 ? code : (i % 2 === 0 ? 2 : 1)
    };
  });

  return {
    locationName,
    region,
    country,
    latitude: lat,
    longitude: lon,
    temperature: temp,
    apparentTemperature: Number((temp + (humidity > 70 ? 2.5 : -1)).toFixed(1)),
    humidity,
    precipitation: rain,
    precipitationProbability: rainProb,
    windSpeed: wind,
    windDirection: 145,
    weatherCode: code,
    weatherDescription: decodeWmoCode(code).description,
    isDay: true,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    source: 'mock_service',
    dailyForecast
  };
}

// Fetch live weather from Open-Meteo free API with automatic mock fallback
export async function fetchLiveWeather(
  lat: number,
  lon: number,
  locationName: string,
  region: string,
  country: string
): Promise<WeatherCondition> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP ${res.status}`);
    }

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const dailyForecast = (daily?.time || []).slice(0, 5).map((tStr: string, idx: number) => {
      const d = new Date(tStr);
      const dayName = idx === 0 ? 'Today' : daysOfWeek[d.getDay()];
      return {
        date: tStr,
        dayName,
        tempMax: Math.round(daily.temperature_2m_max?.[idx] ?? 30),
        tempMin: Math.round(daily.temperature_2m_min?.[idx] ?? 20),
        precipitationSum: Math.round((daily.precipitation_sum?.[idx] ?? 0) * 10) / 10,
        weatherCode: daily.weather_code?.[idx] ?? 0
      };
    });

    const rainProb = daily?.precipitation_probability_max?.[0] ?? (current.precipitation > 0 ? 80 : 15);

    return {
      locationName,
      region,
      country,
      latitude: lat,
      longitude: lon,
      temperature: Math.round(current.temperature_2m * 10) / 10,
      apparentTemperature: Math.round(current.apparent_temperature * 10) / 10,
      humidity: Math.round(current.relative_humidity_2m),
      precipitation: Math.round(current.precipitation * 10) / 10,
      precipitationProbability: Math.round(rainProb),
      windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
      windDirection: Math.round(current.wind_direction_10m || 0),
      weatherCode: current.weather_code,
      weatherDescription: decodeWmoCode(current.weather_code).description,
      isDay: Boolean(current.is_day),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'live_api',
      dailyForecast
    };
  } catch (err) {
    console.warn('Open-Meteo real-time fetch failed or timed out, using agrometeorological mock fallback:', err);
    // Return high quality mock data with clear flag
    const fallback = getMockWeather(lat, lon, locationName, region, country);
    return {
      ...fallback,
      source: 'mock_service'
    };
  }
}

// Generates climate-smart agro-advisory based on current weather parameters
export function generateClimateSmartAdvisory(weather: WeatherCondition, language: Language = 'en'): ClimateSmartAdvisory {
  const { temperature, humidity, precipitation, precipitationProbability, windSpeed } = weather;

  // 1. Fungal / Blight Risk Index
  let fungalScore = 0;
  let fungalLevel: ClimateSmartAdvisory['fungalRisk']['level'] = 'Low';

  // Blights love RH > 75% and temp between 18-28°C
  if (humidity >= 85 && temperature >= 18 && temperature <= 27) {
    fungalScore = 90;
    fungalLevel = 'Severe';
  } else if (humidity >= 75 && temperature >= 16 && temperature <= 30) {
    fungalScore = 75;
    fungalLevel = 'High';
  } else if (humidity >= 60 || precipitation > 5) {
    fungalScore = 48;
    fungalLevel = 'Moderate';
  } else {
    fungalScore = 20;
    fungalLevel = 'Low';
  }

  const fungalDesc = language === 'so'
    ? (fungalLevel === 'Severe'
        ? `Qoyaanka aadka u sarreeya (${humidity}%) iyo heerkulka ${temperature}°C waxay si degdeg ah u abuuraan caariyowga (fungal blight spores). Kormeer caleemaha yaanyada & baradhada maanta.`
        : fungalLevel === 'High'
        ? `Khatarta cudurrada fangaska waa sareysaa qoyaanka (${humidity}%) dartiis. Iska ilaali in caleemaha lagu waraabiyo korka.`
        : fungalLevel === 'Moderate'
        ? `Khatarta fangaska waa dhexdhexaad. Ku hayso hawo wanaagsan geedaha dhexdooda.`
        : `Khatar yar oo fangas ah; qoyaanka hooseeya (${humidity}%) wuxuu hortaagan yahay samaysanka caariyowga.`)
    : language === 'sw'
    ? (fungalLevel === 'Severe'
        ? `Unyevu wa juu sana (${humidity}%) na joto la ${temperature}°C vinakuza ukungu kwa kasi. Kagua majani mara moja.`
        : `Kiwango cha ukungu: ${fungalLevel}. Zingatia unyevu wa ${humidity}%.`)
    : (fungalLevel === 'Severe'
        ? `High canopy humidity (${humidity}%) and warm ${temperature}°C provide ideal fungal spore germination conditions. Check Solanaceae foliage immediately.`
        : fungalLevel === 'High'
        ? `Elevated fungal pathogen pressure due to sustained ${humidity}% RH. Avoid overhead irrigation.`
        : fungalLevel === 'Moderate'
        ? `Moderate fungal risk. Maintain plant spacing for canopy aeration.`
        : `Low fungal outbreak risk; ambient humidity (${humidity}%) limits spore germination.`);

  // 2. Spray Window Feasibility
  let sprayStatus: ClimateSmartAdvisory['sprayWindow']['status'] = 'Optimal';
  let sprayReason = '';

  if (windSpeed > 22) {
    sprayStatus = 'Unfavorable';
    sprayReason = language === 'so'
      ? `Dabayl xooggan (${windSpeed} km/h). Ha buufin dawooyinka ama faleemada dabiiciga ah maanta; daawadu way dhibic-lumi doontaa (drift).`
      : language === 'sw'
      ? `Upepo mkali (${windSpeed} km/h). Usipulize dawa; kuna hatari ya dawa kupeperushwa.`
      : `High wind speed (${windSpeed} km/h). Prohibit foliar spraying due to chemical drift risk.`;
  } else if (precipitation > 1.5 || precipitationProbability > 50) {
    sprayStatus = 'Unfavorable';
    sprayReason = language === 'so'
      ? `Khatar roob (${precipitationProbability}% suurtagalnimo, ${precipitation} mm). Roobku wuxuu mayri doonaa dawada ka hor inta aanay caleentu nuugin.`
      : language === 'sw'
      ? `Uwezekano mkubwa wa mvua (${precipitationProbability}%). Mvua itaosha dawa kwenye majani.`
      : `High rain likelihood (${precipitationProbability}% chance). Rain will wash off foliar treatments before absorption.`;
  } else if (windSpeed > 14 || precipitationProbability > 30) {
    sprayStatus = 'Caution';
    sprayReason = language === 'so'
      ? `Dabayl dhexdhexaad ah (${windSpeed} km/h). Buufi subaxdii hore ama fiidkii marka dabayshu degto.`
      : language === 'sw'
      ? `Upepo wa wastani (${windSpeed} km/h). Pulizia mapema asubuhi au jioni upepo ukitulia.`
      : `Marginal spray conditions (${windSpeed} km/h wind). Restrict spraying to early morning calm windows.`;
  } else {
    sprayStatus = 'Optimal';
    sprayReason = language === 'so'
      ? `Xaalad ku habboon buufinta! Dabayshu waa deggan tahay (${windSpeed} km/h), mana jiro roob degdeg ah.`
      : language === 'sw'
      ? `Hali nzuri sana ya kupulizia dawa! Upepo mdogo (${windSpeed} km/h) na hakuna mvua.`
      : `Ideal spray window. Calm air (${windSpeed} km/h) and dry foliage guarantee maximum absorption.`;
  }

  // 3. Irrigation Demand & Soil Evapotranspiration
  let irrigationLevel: ClimateSmartAdvisory['irrigationDemand']['level'] = 'Moderate';
  let irrigationAdvice = '';

  if (precipitation >= 12) {
    irrigationLevel = 'Low';
    irrigationAdvice = language === 'so'
      ? `Roob ku filan ayaa da\'ay (${precipitation} mm). Jooji waraabka si looga fogaado biyo fariisiya xididdada.`
      : `Sufficient precipitation (${precipitation} mm). Suspend irrigation to prevent rootzone waterlogging.`;
  } else if (temperature >= 32 && humidity < 50) {
    irrigationLevel = 'High';
    irrigationAdvice = language === 'so'
      ? `Kuleyl daran (${temperature}°C) & qallayl (${humidity}%). Waraabi subaxda hore adoo isticmaalaya dhibic-biyo (drip) ama caws ku ded carrada (mulch).`
      : `High thermal evaporative demand (${temperature}°C, ${humidity}% RH). Irrigate deeply at dawn; apply organic mulch.`;
  } else {
    irrigationLevel = 'Moderate';
    irrigationAdvice = language === 'so'
      ? `Heerkul caadi ah (${temperature}°C). Raac jadwalka waraabka caadiga ah ee beertaada.`
      : `Balanced evapotranspiration (${temperature}°C). Maintain standard regulated irrigation intervals.`;
  }

  // 4. Pest Vector Risk (Aphids, Whiteflies)
  let vectorLevel: ClimateSmartAdvisory['pestVectorRisk']['level'] = 'Low';
  let vectorAlert = '';

  if (temperature >= 28 && humidity <= 60 && windSpeed <= 20) {
    vectorLevel = 'High';
    vectorAlert = language === 'so'
      ? `Kuleyl qallalan wuxuu kiciyaa cayayaanka sida duqsiga cad (whiteflies) iyo shilinta (aphids) ee qaada fayraska mosaic.`
      : `Warm, dry microclimate accelerates whitefly and aphid reproductive cycles (vectors for mosaic virus).`;
  } else if (temperature >= 25 && humidity <= 70) {
    vectorLevel = 'Moderate';
    vectorAlert = language === 'so'
      ? `Heerkulka wuxuu dhiirigelin karaa kormeerka cayayaanka qaada fayraska caleemaha.`
      : `Moderate pest vector activity. Inspect lower leaf undersides for aphid colonies.`;
  } else {
    vectorLevel = 'Low';
    vectorAlert = language === 'so'
      ? `Khatar yar oo cayayaan ah xilligan cimilada deggan.`
      : `Low insect vector activity under current temperature and humidity balance.`;
  }

  // Key summary action
  let keyAction = '';
  if (fungalLevel === 'Severe' || fungalLevel === 'High') {
    keyAction = language === 'so' 
      ? 'DIGNIIN CAARIYOW: Marso faleemada naxaasta (copper fungicide) ama biyo dambas leh; jar caleemaha hoose ee dhulka taabanaya.'
      : 'FUNGAL BLIGHT ALERT: Apply protective copper fungicide / bio-extracts; prune lower soil-contact foliage.';
  } else if (sprayStatus === 'Optimal') {
    keyAction = language === 'so'
      ? 'Waqti Wanaagsan: Maanta waa maalin ku habboon daaweynta caleemaha iyo nafaqada bacriminta foliar-ka.'
      : 'Spray Window Active: Execute scheduled organic pest and foliar nutrient treatments today.';
  } else if (irrigationLevel === 'High') {
    keyAction = language === 'so'
      ? 'Kuleyl Sare: Dedi carrada (mulch) si biyuhu uumi ugu noqon, waraabina subaxdii hore.'
      : 'High Evaporation: Apply straw/grass mulching to conserve moisture and avoid flower abortion.';
  } else {
    keyAction = language === 'so'
      ? 'Cimilo Deggan: Samee kormeer caadi ah oo ku saabsan caafimaadka caleemaha iyo koritaanka midhaha.'
      : 'Stable Microclimate: Perform routine scouting for chlorophyll vitality and soil aeration.';
  }

  return {
    fungalRisk: {
      level: fungalLevel,
      score: fungalScore,
      description: fungalDesc
    },
    sprayWindow: {
      status: sprayStatus,
      reason: sprayReason
    },
    irrigationDemand: {
      level: irrigationLevel,
      advice: irrigationAdvice
    },
    pestVectorRisk: {
      level: vectorLevel,
      alert: vectorAlert
    },
    keyAction
  };
}
