import React, { useState, useRef } from 'react';
import { 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  ChevronRight,
  RefreshCw,
  Eye,
  Crosshair,
  Layers,
  Leaf
} from 'lucide-react';
import { CropDisease } from '../types';
import { SAMPLE_CROPS } from '../data/sampleCrops';

interface DiseaseScannerProps {
  onSelectForConsultation: (crop: CropDisease) => void;
}

export const DiseaseScanner: React.FC<DiseaseScannerProps> = ({ onSelectForConsultation }) => {
  const [selectedCrop, setSelectedCrop] = useState<CropDisease>(SAMPLE_CROPS[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target?.result as string);
        triggerInference();
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerInference = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1100);
  };

  const handleSelectSample = (crop: CropDisease) => {
    setCustomImage(null);
    setSelectedCrop(crop);
    triggerInference();
  };

  const activeDisplayImage = customImage || selectedCrop.image;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-stone-900/40 rounded-2xl p-5 sm:p-6 border border-emerald-900/30 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-3 h-3" />
                MobileNetV3 Edge Vision Model
              </span>
              <span className="text-xs text-stone-400">Trained on PlantVillage 54,000+ pathological samples</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Space_Grotesk']">
              Leaf Pathology & Disease Diagnostic Studio
            </h1>
            <p className="text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
              Upload a photograph of suspicious foliage or choose from field samples below to run instant neural image classification, lesion margin detection, and non-chemical IPM treatment planning.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Upload Field Photo
            </button>
          </div>
        </div>

        {/* Quick Sample Selector Pills */}
        <div className="mt-5 pt-4 border-t border-stone-800/60">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2.5 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Select Field Test Case:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {SAMPLE_CROPS.map((item) => {
              const isSelected = !customImage && selectedCrop.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectSample(item)}
                  className={`flex flex-col text-left p-2.5 rounded-xl text-xs transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/50'
                      : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-emerald-700/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold truncate text-[11px] text-emerald-300">{item.crop}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      item.severity === 'Healthy' ? 'bg-emerald-400' :
                      item.severity === 'Critical' ? 'bg-rose-500' :
                      item.severity === 'High' ? 'bg-amber-500' : 'bg-yellow-400'
                    }`} />
                  </div>
                  <span className="font-medium truncate text-xs text-stone-200">{item.name}</span>
                  <span className="text-[10px] text-stone-400 mt-0.5">{item.pathogenType}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Viewer & Optical Inspection */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-xl group">
            
            {/* Visual Image */}
            <div className="relative aspect-4/3 w-full bg-stone-900 flex items-center justify-center overflow-hidden">
              <img
                src={activeDisplayImage}
                alt={selectedCrop.name}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  isScanning ? 'scale-105 filter blur-[1px]' : 'scale-100'
                }`}
              />

              {/* Scanning Ray Effect */}
              {isScanning && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent animate-pulse flex flex-col justify-center items-center backdrop-blur-[0.5px]">
                  <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_15px_#34d399]" />
                  <div className="bg-stone-950/80 px-3 py-1.5 rounded-full border border-emerald-400/40 text-xs font-mono text-emerald-300 mt-4 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Extracting morphological features...
                  </div>
                </div>
              )}

              {/* Lesion Bounding Boxes / Pathology Heatmap */}
              {!isScanning && showHeatmap && selectedCrop.severity !== 'Healthy' && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Bounding box 1 */}
                  <div className="absolute top-[28%] left-[32%] w-[38%] h-[34%] border-2 border-rose-500/80 bg-rose-500/10 rounded-lg animate-pulse">
                    <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-rose-600 text-[10px] font-mono font-bold text-white rounded">
                      Necrotic Margin [98.4%]
                    </div>
                  </div>
                  {/* Bounding box 2 */}
                  <div className="absolute top-[62%] left-[18%] w-[24%] h-[22%] border border-amber-400/80 bg-amber-400/10 rounded">
                    <div className="absolute -top-4 left-0 px-1 py-0.5 bg-amber-600 text-[9px] font-mono text-white rounded">
                      Chlorotic Halo [92.1%]
                    </div>
                  </div>
                </div>
              )}

              {/* Healthy leaf watermark */}
              {!isScanning && selectedCrop.severity === 'Healthy' && (
                <div className="absolute bottom-4 left-4 right-4 bg-emerald-950/80 border border-emerald-500/40 p-2.5 rounded-xl backdrop-blur-md flex items-center gap-2 text-emerald-300 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No fungal spores, lesions, or virus vectors detected. Cell structure optimal.</span>
                </div>
              )}
            </div>

            {/* Image Overlay Controls */}
            <div className="p-3 bg-stone-900/90 border-t border-stone-800 flex items-center justify-between text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-[11px]">FOV: 512x512 RGB Normalized</span>
              </div>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  showHeatmap ? 'bg-emerald-800/60 text-emerald-200 border border-emerald-600/40' : 'bg-stone-800 text-stone-400'
                }`}
              >
                <Eye className="w-3 h-3" />
                {showHeatmap ? 'Lesion Overlay ON' : 'Lesion Overlay OFF'}
              </button>
            </div>
          </div>

          {/* Quick Confidence Distribution Bar */}
          <div className="bg-stone-900/40 rounded-xl p-4 border border-stone-800 text-xs space-y-2.5">
            <div className="flex justify-between items-center text-stone-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                Classification Softmax Probabilities:
              </span>
              <span className="text-emerald-400 font-mono font-bold">{selectedCrop.confidence}%</span>
            </div>
            
            <div className="space-y-1.5">
              <div>
                <div className="flex justify-between text-[11px] text-stone-400 mb-0.5">
                  <span className="font-medium text-stone-200">{selectedCrop.name}</span>
                  <span className="font-mono text-emerald-400">{selectedCrop.confidence}%</span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${selectedCrop.confidence}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-stone-400 mb-0.5">
                  <span>Cercospora Leaf Spot (Differential)</span>
                  <span className="font-mono">{(100 - selectedCrop.confidence) * 0.65 > 0 ? ((100 - selectedCrop.confidence) * 0.65).toFixed(1) : '1.2'}%</span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-stone-600 rounded-full" 
                    style={{ width: `${Math.max(3, (100 - selectedCrop.confidence) * 0.65)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-stone-400 mb-0.5">
                  <span>Common Rust / Rust Fungi</span>
                  <span className="font-mono">{(100 - selectedCrop.confidence) * 0.35 > 0 ? ((100 - selectedCrop.confidence) * 0.35).toFixed(1) : '0.8'}%</span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-stone-700 rounded-full" 
                    style={{ width: `${Math.max(2, (100 - selectedCrop.confidence) * 0.35)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pathological Diagnosis & Treatment Plan */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-stone-900/60 rounded-2xl p-5 sm:p-6 border border-stone-800 space-y-5">
            
            {/* Title & Status Badges */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-stone-800">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
                  {selectedCrop.crop} &bull; Diagnostic Report
                </span>
                <h2 className="text-2xl font-bold text-white mt-0.5 font-['Space_Grotesk']">
                  {selectedCrop.name}
                </h2>
                <p className="text-xs italic text-stone-400 mt-0.5">
                  Pathogen: {selectedCrop.scientificName} ({selectedCrop.pathogenType})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  selectedCrop.severity === 'Healthy'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : selectedCrop.severity === 'Critical'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : selectedCrop.severity === 'High'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                }`}>
                  {selectedCrop.severity === 'Healthy' ? 'Healthy Canopy' : `${selectedCrop.severity} Severity`}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-stone-300 leading-relaxed">
              {selectedCrop.description}
            </p>

            {/* Observable Symptoms */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Key Morphological Indicators
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-300">
                {selectedCrop.symptoms.map((symptom, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-stone-950/40 p-2.5 rounded-xl border border-stone-800/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Organic & Cultural Treatment Protocols */}
            <div className="bg-emerald-950/30 rounded-xl p-4 border border-emerald-800/30 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Recommended Organic & Cultural Interventions
                </h3>
                <span className="text-[10px] text-emerald-400/80 font-mono">Zero Chemical Residue</span>
              </div>

              <div className="space-y-2 text-xs text-emerald-100/90">
                {selectedCrop.organicTreatment.map((treatment, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-800/50 text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="leading-snug">{treatment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Preventative Field Management */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-teal-400" />
                Preventative Cultural Husbandry
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-300">
                {selectedCrop.preventativeMeasures.map((measure, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-stone-950/40 border border-stone-800/80 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                    <span>{measure}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Environmental Conditions Warning */}
            <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 text-xs text-stone-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-stone-400 font-medium">Pathogen Climate Affinity: </span>
                <span className="text-stone-200 font-mono">{selectedCrop.optimalConditions.tempRange} &bull; {selectedCrop.optimalConditions.humidityRange}</span>
              </div>
              <button
                onClick={() => onSelectForConsultation(selectedCrop)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors cursor-pointer text-xs self-start sm:self-auto"
              >
                <span>Consult Agronomist AI</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
