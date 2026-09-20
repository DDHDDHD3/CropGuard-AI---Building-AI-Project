import { ScanHistoryEntry, CropDisease } from '../types';
import { SAMPLE_CROPS } from '../data/sampleCrops';

const STORAGE_KEY = 'cropguard_scan_history_v1';

// Seed realistic field records
const INITIAL_HISTORY: ScanHistoryEntry[] = [
  {
    id: 'scan-hist-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    formattedDate: 'Today, 06:15 AM',
    cropName: 'Tomato',
    disease: SAMPLE_CROPS.find(c => c.id === 'tomato-eb') || SAMPLE_CROPS[1],
    imageUrl: SAMPLE_CROPS.find(c => c.id === 'tomato-eb')?.image || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    source: 'Live Camera',
    severity: 'Moderate',
    confidence: 94.8,
    fieldZone: 'Greenhouse 1 (Row 4)',
    status: 'Treatment Applied',
    notes: 'Pruned lowest 2 leaf tiers and sprayed dilute sodium bicarbonate foliar shield.',
    pixelMetrics: {
      chlorosisPercent: 18.4,
      necrosisPercent: 8.2,
      excessGreenIndex: 42.1
    }
  },
  {
    id: 'scan-hist-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    formattedDate: 'Today, 01:45 AM',
    cropName: 'Maize (Corn)',
    disease: SAMPLE_CROPS.find(c => c.id === 'maize-nlb') || SAMPLE_CROPS[0],
    imageUrl: SAMPLE_CROPS.find(c => c.id === 'maize-nlb')?.image || 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    source: 'File Upload',
    severity: 'High',
    confidence: 96.4,
    fieldZone: 'North Plot (Acre B)',
    status: 'High Risk Alert',
    notes: 'Cigar-shaped lesions identified on 12 canopy samples after heavy overnight dew.',
    pixelMetrics: {
      chlorosisPercent: 26.5,
      necrosisPercent: 14.8,
      excessGreenIndex: 35.8
    }
  },
  {
    id: 'scan-hist-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // Yesterday
    formattedDate: 'Yesterday, 03:20 PM',
    cropName: 'Cassava',
    disease: SAMPLE_CROPS.find(c => c.id === 'cassava-cmd') || SAMPLE_CROPS[2] || SAMPLE_CROPS[0],
    imageUrl: SAMPLE_CROPS.find(c => c.id === 'cassava-cmd')?.image || 'https://images.unsplash.com/photo-1598965402089-897ce52e8355?auto=format&fit=crop&w=800&q=80',
    source: 'Live Camera',
    severity: 'Critical',
    confidence: 93.1,
    fieldZone: 'River Basin Terrace',
    status: 'Under Observation',
    notes: 'Severe chlorotic mosaic pattern on young leaflets. Vector whitefly population flagged.',
    pixelMetrics: {
      chlorosisPercent: 34.2,
      necrosisPercent: 5.6,
      excessGreenIndex: 28.4
    }
  },
  {
    id: 'scan-hist-004',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(), // 2 days ago
    formattedDate: '2 days ago, 11:10 AM',
    cropName: 'Potato',
    disease: SAMPLE_CROPS.find(c => c.id === 'potato-lb') || SAMPLE_CROPS[3] || SAMPLE_CROPS[0],
    imageUrl: SAMPLE_CROPS.find(c => c.id === 'potato-lb')?.image || 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    source: 'Field Sample',
    severity: 'High',
    confidence: 95.2,
    fieldZone: 'Valley Furrows - Sector 3',
    status: 'Treatment Applied',
    notes: 'Applied copper hydroxide organic spray and removed infected leaf stems.',
    pixelMetrics: {
      chlorosisPercent: 22.1,
      necrosisPercent: 16.9,
      excessGreenIndex: 38.5
    }
  },
  {
    id: 'scan-hist-005',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 76).toISOString(), // 3 days ago
    formattedDate: '3 days ago, 09:30 AM',
    cropName: 'Maize (Corn)',
    disease: SAMPLE_CROPS.find(c => c.id === 'healthy-maize') || {
      ...SAMPLE_CROPS[0],
      id: 'healthy-maize-entry',
      name: 'Healthy Foliage',
      scientificName: 'Zea mays (Optimum Vigour)',
      pathogenType: 'Healthy',
      severity: 'Healthy',
      confidence: 98.6,
      description: 'Foliage shows vibrant chlorophyll distribution and no fungal mycelium.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80',
    source: 'Live Camera',
    severity: 'Healthy',
    confidence: 98.6,
    fieldZone: 'South Organic Nursery',
    status: 'Resolved',
    notes: 'Uniform excess green index, robust chlorophyll vigor, clear leaf margins.',
    pixelMetrics: {
      chlorosisPercent: 2.1,
      necrosisPercent: 0.4,
      excessGreenIndex: 68.2
    }
  }
];

export function getScanHistory(): ScanHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HISTORY));
      return INITIAL_HISTORY;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_HISTORY;
  } catch (err) {
    console.warn('Failed to load scan history from localStorage:', err);
    return INITIAL_HISTORY;
  }
}

export function saveScanHistory(history: ScanHistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.warn('Failed to persist scan history:', err);
  }
}

export function addScanToHistory(
  crop: CropDisease,
  source: 'Live Camera' | 'File Upload' | 'Field Sample' = 'Live Camera',
  customImageUrl?: string,
  pixelMetrics?: {
    chlorosisPercent: number;
    necrosisPercent: number;
    excessGreenIndex: number;
  },
  fieldZone: string = 'Field Zone Alpha'
): ScanHistoryEntry {
  const currentHistory = getScanHistory();

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = `Today, ${timeStr}`;

  const defaultStatus: ScanHistoryEntry['status'] = 
    crop.severity === 'Critical' ? 'High Risk Alert' :
    crop.severity === 'High' ? 'High Risk Alert' :
    crop.severity === 'Healthy' ? 'Resolved' : 'Under Observation';

  const newEntry: ScanHistoryEntry = {
    id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now.toISOString(),
    formattedDate,
    cropName: crop.crop,
    disease: crop,
    imageUrl: customImageUrl || crop.image,
    source,
    severity: crop.severity,
    confidence: crop.confidence,
    fieldZone,
    status: defaultStatus,
    notes: crop.description.slice(0, 110) + '...',
    pixelMetrics
  };

  const updated = [newEntry, ...currentHistory];
  saveScanHistory(updated);
  return newEntry;
}

export function updateScanHistoryItem(
  id: string,
  updates: Partial<ScanHistoryEntry>
): ScanHistoryEntry[] {
  const current = getScanHistory();
  const updated = current.map(item => item.id === id ? { ...item, ...updates } : item);
  saveScanHistory(updated);
  return updated;
}

export function deleteScanHistoryItem(id: string): ScanHistoryEntry[] {
  const current = getScanHistory();
  const updated = current.filter(item => item.id !== id);
  saveScanHistory(updated);
  return updated;
}

export function resetScanHistoryToDefault(): ScanHistoryEntry[] {
  saveScanHistory(INITIAL_HISTORY);
  return INITIAL_HISTORY;
}
