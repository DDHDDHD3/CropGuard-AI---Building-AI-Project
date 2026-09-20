import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Award, 
  Github, 
  FileText, 
  Code2, 
  BookOpen,
  Info
} from 'lucide-react';

const RAW_README_CONTENT = `<!-- This is the markdown template for the final project of the Building AI course, 
created by Reaktor Innovations and University of Helsinki. 
Copy the template, paste it to your GitHub README and edit! -->

# CropGuard AI: Early Plant Disease Diagnostic & Climate-Smart Advisory

Final project for the Building AI course

## Summary

CropGuard AI is an accessible, offline-capable crop health diagnostic and drought-risk advisory system empowering smallholder farmers to detect crop diseases from leaf photos early and adopt climate-resilient farming techniques. (Building AI course project)

![CropGuard AI Course Project Overview](leaf2.png)

## Background

Agriculture forms the backbone of livelihood and food security for over 60% of Sub-Saharan Africa and arid/semi-arid regions worldwide. However, smallholder farmers lose up to 40% of their harvests annually to preventable plant pathogens, pests, and sudden climatic shifts.

The primary issues faced in local farming communities:
* **Severe shortage of agricultural extension officers**: In many rural districts, there is only one extension officer for every 3,000 to 5,000 farmers, making timely in-person field diagnosis nearly impossible.
* **Delayed disease identification**: Fungal blights (such as Northern Corn Leaf Blight and Potato Late Blight) and viral vectors (such as Cassava Mosaic Disease) spread rapidly through fields before farmers can obtain expert diagnosis.
* **Misuse of chemical treatments**: Farmers frequently purchase expensive or incorrect chemical fungicides due to misidentification, damaging soil microbiomes and incurring debt.
* **Climate volatility & erratic precipitation**: Shifting rainy seasons demand predictive guidance on drought stress and microclimate disease risk rather than reactive guessing.

My personal motivation stems from witnessing how drought cycles and preventable crop blights directly impact rural livelihoods and food availability in East Africa. Equipping farmers with a lightweight AI advisor running on accessible devices can protect yields, stabilize household income, and promote regenerative food security.


## How is it used?

CropGuard AI is designed for frontline use in rural and peri-urban farm fields under variable connectivity conditions:

1. **Leaf Symptom Capture**: The farmer or community agro-dealer takes a photo of a suspicious leaf using a mobile phone camera (or selects symptoms in the web app).
2. **Instant Neural Diagnosis**: A lightweight MobileNet convolutional vision model inspects visual lesion patterns, discoloration margins, and spore clustering to return the top predicted disease along with a calibrated confidence score.
3. **Microclimate Blight Risk Scoring**: Combining local weather observations (temperature, relative humidity, recent rainfall, soil moisture), the system calculates Bayesian outbreak risk odds for early prophylactic action.
4. **Actionable Organic & Cultural Remediation**: The farmer receives clear, step-by-step non-chemical treatment protocols (e.g. neem extract spray, infected leaf pruning, spacing adjustments) translated into local languages (including English and Somali).

![Crop Diagnostic Demo](https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80)

### Code Example: Bayesian Disease Risk & Likelihood Estimation
Below is a Python demonstration illustrating how Bayes' Rule and likelihood ratios (concepts taught in Building AI) evaluate disease probability conditioned on weather humidity factors:

\`\`\`python
def calculate_disease_posterior(prior_prob, humidity_rh, temp_c):
    """
    Building AI Bayes calculation: Update prior probability of fungal blight 
    based on environmental likelihood ratios.
    """
    # Likelihood ratio given high humidity (>80%) and warm temp (20-28C)
    if humidity_rh > 80 and 20 <= temp_c <= 28:
        likelihood_ratio = 4.5  # Ideal sporulation environment
    elif humidity_rh > 65:
        likelihood_ratio = 1.8
    else:
        likelihood_ratio = 0.3  # Unfavorable for spore germination

    # Convert prior probability to prior odds
    prior_odds = prior_prob / (1.0 - prior_prob)
    
    # Calculate posterior odds using Bayes Rule: Posterior Odds = Prior Odds * Likelihood Ratio
    posterior_odds = prior_odds * likelihood_ratio
    
    # Convert back to posterior probability
    posterior_prob = posterior_odds / (1.0 + posterior_odds)
    return round(posterior_prob, 4)

def main():
    crops = ['Maize', 'Tomato', 'Cassava', 'Potato']
    baseline_priors = [0.08, 0.12, 0.05, 0.10]
    ambient_humidity = 86  # % RH
    ambient_temperature = 24  # Celsius
    
    print("--- CropGuard AI: Outbreak Risk Assessment ---")
    for crop, prior in zip(crops, baseline_priors):
        updated_risk = calculate_disease_posterior(prior, ambient_humidity, ambient_temperature)
        print(f"Crop: {crop:<8} | Baseline Prior: {prior*100:.1f}% | Climate-Updated Risk: {updated_risk*100:.1f}%")

if __name__ == '__main__':
    main()
\`\`\`


## Data sources and AI methods

The project leverages open agricultural computer vision datasets and agrometeorological data streams:

| Dataset / Source | Type | Description & Usage |
| :--- | :--- | :--- |
| **PlantVillage Open Dataset** | Image Library | Over 54,000 curated leaf images across 38 crop-disease pairs used for vision training. |
| **CGIAR & FAO AgriData** | Field Observations | Real-world smallholder farm surveys across East Africa documenting pest & pathogen frequencies. |
| **NASA POWER & Open-Meteo** | Agroclimatology API | Solar radiation, precipitation anomalies, soil moisture (0-10cm), and surface temperature. |
| **LLM Agronomy Knowledge** | Reasoning & Dialogue | Google Gemini API with specialized prompt engineering for multilingual agricultural extensions. |

### AI Techniques Applied:
* **Transfer Learning with Convolutional Neural Networks (CNNs)**: Utilizing a lightweight MobileNetV3 backbone fine-tuned on crop pathology images to enable fast inference on mobile web edge runtimes.
* **Bayesian Probability & Likelihood Updating**: Calculating environmental outbreak risks using conditional probabilities taught in the Building AI curriculum.
* **LLM Grounding & Natural Language Generation**: Synthesizing localized organic IPM (Integrated Pest Management) action plans in clear, jargon-free terminology.


## Challenges

While CropGuard AI provides rapid early-warning capabilities, several limitations must be acknowledged:
* **Visual Symptom Ambiguity**: Nutrient deficiencies (e.g. nitrogen chlorosis) can visually resemble viral stunt or early root-rot. Physical soil testing remains essential for conclusive mineral diagnostics.
* **Camera Sensor & Lighting Variations**: Low-end smartphone sensors in direct glaring sunlight or intense shadows may degrade classification confidence.
* **Ethical Considerations & Chemical Safety**: The system prioritizes organic cultural practices (crop rotation, companion planting, biological controls) and includes safety disclaimers to prevent toxic chemical misapplication.
* **Offline Frontier Deployment**: Rural internet intermittency requires edge-cached neural weights (ONNX/TFLite Web) so farmers without mobile data can still receive diagnostics.


## What next?

CropGuard AI has substantial potential for growth and community integration:
* **Acoustic & Drone Sensor Integration**: Expanding from leaf photos to acoustic pest detection (e.g. locust swarm frequency) and drone multispectral NDVI imagery.
* **Voice-First Local Dialects**: Developing Somali, Oromo, and Swahili voice interfaces using lightweight speech models to assist non-literate farmers.
* **Community Cooperative Alert Network**: Enabling automated SMS broadcasts when nearby farms report contagious airborne rusts or armyworm infestations.
* **Partnership with Local Agricultural Ministries**: Collaborating with local universities, extension programs, and agricultural cooperatives to validate field datasets.


## Acknowledgments

![Course Acknowledgments and Maintainer](leaf3.png)

* **University of Helsinki & Reaktor**: Creators of the inspiring *Elements of AI* and *Building AI* courses.
* **PlantVillage Project (Penn State University)**: For releasing the open crop disease computer vision dataset.
* **CGIAR & FAO**: For open data publications on agricultural development and sustainable pest management.
* [Sleeping Cat on Her Back by Umberto Salvagnin](https://commons.wikimedia.org/wiki/File:Sleeping_cat_on_her_back.jpg#filelinks) / [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) (referenced as per course template guidelines).
* Developer Profile & Repository Maintainer: [Abdullahi Muse Isse (@DDHDDHD3)](https://github.com/DDHDDHD3)
`;

interface CourseReadmeSubmissionModalProps {
  language?: 'en' | 'so' | 'sw';
}

export const CourseReadmeSubmissionModal: React.FC<CourseReadmeSubmissionModalProps> = ({ language = 'en' }) => {
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(RAW_README_CONTENT);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([RAW_README_CONTENT], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Building AI Final Task Submission Honors */}
      <div className="bg-gradient-to-br from-amber-50/90 via-white to-emerald-50/70 rounded-2xl p-6 border border-amber-300/80 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <Award className="w-3.5 h-3.5 text-amber-700" />
                {language === 'so' ? 'Mashruuca Koorsada Building AI ee Shahaadada' : 'Building AI Final Project Honors Ready'}
              </span>
              <span className="text-xs text-slate-600 font-mono font-semibold">University of Helsinki &bull; Reaktor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-['Space_Grotesk']">
              {language === 'so' 
                ? 'README GitHub & Tilmaamaha Gudbinta ee @DDHDDHD3' 
                : 'GitHub README & Submission Guide for @DDHDDHD3'}
            </h1>
            <p className="text-sm text-slate-700 max-w-3xl leading-relaxed">
              {language === 'so'
                ? 'Qorshahan mashruuca ee la qaabeeyey wuxuu si buuxda ugu hoggaansamayaa shuruudaha koorsada Building AI. Waad guurin kartaa ama soo dejisan kartaa README-kan, waxaad ku shubi kartaa akoonkaaga GitHub (https://github.com/DDHDDHD3/), kadibna gudbi xiriirinta si aad u hesho shahaadada.'
                : 'This formatted project plan conforms strictly to the Building AI course criteria. You can copy or download this README, push it to your GitHub account (https://github.com/DDHDDHD3/), and submit the repository URL for course completion honors.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {isCopied 
                ? (language === 'so' ? 'Waa la guuriyay!' : 'Copied to Clipboard!') 
                : (language === 'so' ? 'Guuri README.md' : 'Copy README.md')}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 transition-all cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4" />
              {language === 'so' ? 'Soo Degso Faylka' : 'Download File'}
            </button>
            <a
              href="https://github.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition-all cursor-pointer shadow-2xs"
            >
              <Github className="w-4 h-4" />
              <span>{language === 'so' ? 'Ka Fur Repo Cusub GitHub' : 'Create Repo on GitHub'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Course Grading Requirements Validation Checklist */}
        <div className="mt-5 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 text-slate-700 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{language === 'so' ? 'Cinwaanka ## Summary wuu ku jiraa' : 'Heading ## Summary included'}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 text-slate-700 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{language === 'so' ? 'Qoraalka kooban ~250 xaraf' : '~250 character summary text'}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 text-slate-700 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{language === 'so' ? 'Wuxuu wataa "Building AI course project"' : 'Includes "Building AI course project"'}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 text-slate-700 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{language === 'so' ? 'Qaabka saxda ah ee Koorsada' : 'Standard Course Markdown Structure'}</span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Submission Guide for Abdullahi Muse Isse (@DDHDDHD3) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-600" />
          {language === 'so' 
            ? 'Talaabooyinka Gudbinta: Sida Loo Gudbiyo & Loo Helo Shahaadada' 
            : 'Step-by-Step Guide: How to Submit & Receive Course Honors'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold text-xs">
              1
            </span>
            <h3 className="font-bold text-slate-900 text-sm">
              {language === 'so' ? 'Abuur Repo GitHub ah' : 'Create GitHub Repo'}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {language === 'so' ? (
                <>Gal <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-mono font-medium">github.com/new</a> adoo isticmaalaya akoonkaaga <strong className="text-slate-900">DDHDDHD3</strong>. U bixi repo-ga <code className="text-amber-900 bg-amber-50 border border-amber-200 px-1 py-0.5 rounded font-mono">cropguard-ai</code>, ka dhig <strong>Public</strong>, oo calaamadee <em>"Initialize with a README"</em>.</>
              ) : (
                <>Go to <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-mono font-medium">github.com/new</a> with your account <strong className="text-slate-900">DDHDDHD3</strong>. Name the repo <code className="text-amber-900 bg-amber-50 border border-amber-200 px-1 py-0.5 rounded font-mono">cropguard-ai</code>, set it to <strong>Public</strong>, and check <em>"Initialize with a README"</em>.</>
              )}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold text-xs">
              2
            </span>
            <h3 className="font-bold text-slate-900 text-sm">
              {language === 'so' ? 'Dhig & Badbaadi README' : 'Paste & Commit README'}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {language === 'so' ? (
                <>Guji calaamadda qalinkaa si aad wax uga beddesho <code className="text-amber-900 bg-amber-50 border border-amber-200 px-1 py-0.5 rounded font-mono">README.md</code> ee repo-gaaga. Guji <strong>Guuri README.md</strong> kor ku xusan, ku dheji qoraalka, kadibna riix <strong>"Commit changes"</strong>.</>
              ) : (
                <>Click the pencil icon to edit <code className="text-amber-900 bg-amber-50 border border-amber-200 px-1 py-0.5 rounded font-mono">README.md</code> in your repo. Click <strong>Copy README.md</strong> above, paste the content into the editor, and click <strong>"Commit changes"</strong>.</>
              )}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold text-xs">
              3
            </span>
            <h3 className="font-bold text-slate-900 text-sm">
              {language === 'so' ? 'Gudbi Xiriirinta & Qiimee 3 Kale' : 'Submit URL & Peer Review'}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {language === 'so' ? (
                <>Koobbiyeeso xiriirinta repo-gaaga <code className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-1 py-0.5 rounded font-mono">https://github.com/DDHDDHD3/cropguard-ai</code> oo geli foomka gudbinta koorsada. Samee 3 dib-u-eegis oo arday kale ah si aad u dhammaystirto shahaadada!</>
              ) : (
                <>Copy your repository link <code className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-1 py-0.5 rounded font-mono">https://github.com/DDHDDHD3/cropguard-ai</code> into the course submission form. Complete 3 peer reviews to finalize your certificate!</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* README Viewer Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-3 sm:px-6 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              {language === 'so' ? 'Muuqaalka Qoraalka' : 'Rendered Preview'}
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'raw'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              {language === 'so' ? 'Koodhka Markdown' : 'Raw Markdown'}
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 px-3 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs font-medium"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? (language === 'so' ? 'Waa la guuriyay' : 'Copied') : (language === 'so' ? 'Guuri' : 'Copy')}</span>
          </button>
        </div>

        {/* Content Viewer */}
        {viewMode === 'raw' ? (
          <div className="p-4 sm:p-6 bg-slate-900 overflow-x-auto font-mono text-xs text-emerald-300 leading-relaxed whitespace-pre-wrap max-h-[600px] overflow-y-auto">
            {RAW_README_CONTENT}
          </div>
        ) : (
          <div className="p-6 sm:p-8 bg-white space-y-6 text-slate-700 text-sm max-h-[600px] overflow-y-auto leading-relaxed font-sans">
            
            <div className="border-b border-slate-200 pb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Space_Grotesk']">
                CropGuard AI: Early Plant Disease Diagnostic & Climate-Smart Advisory
              </h1>
              <p className="text-xs font-mono text-amber-800 font-semibold mt-1">
                Final project for the Building AI course
              </p>
            </div>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 font-['Space_Grotesk'] border-b border-slate-200 pb-1">
                Summary
              </h2>
              <p className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-emerald-950 text-xs sm:text-sm font-medium leading-relaxed">
                CropGuard AI is an accessible, offline-capable crop health diagnostic and drought-risk advisory system empowering smallholder farmers to detect crop diseases from leaf photos early and adopt climate-resilient farming techniques. (Building AI course project)
              </p>
              <div className="my-3 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                <img 
                  src="/leaf2.png" 
                  alt="CropGuard AI Course Project Overview" 
                  className="w-full h-auto object-contain"
                  referrerPolicy="no-referrer" 
                />
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 font-['Space_Grotesk'] border-b border-slate-200 pb-1">
                Background
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Agriculture forms the backbone of livelihood and food security for over 60% of Sub-Saharan Africa and arid/semi-arid regions worldwide. However, smallholder farmers lose up to 40% of their harvests annually to preventable plant pathogens, pests, and sudden climatic shifts.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pl-2">
                <li><strong>Severe shortage of agricultural extension officers</strong>: In rural districts, the ratio is often 1 officer per 3,000+ farmers.</li>
                <li><strong>Delayed disease identification</strong>: Fungal blights and viral vectors spread rapidly across fields before diagnosis.</li>
                <li><strong>Misuse of chemical treatments</strong>: Purchasing inappropriate chemicals damages soil microbiomes and incurs debt.</li>
                <li><strong>Climate volatility</strong>: Shifting rainy seasons demand predictive guidance on drought stress and microclimate disease risk.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 font-['Space_Grotesk'] border-b border-slate-200 pb-1">
                How is it used?
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Designed for frontline use in rural and peri-urban fields under variable connectivity conditions:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-xs text-slate-700 pl-2">
                <li><strong>Leaf Symptom Capture</strong>: Mobile photo upload or symptom selection.</li>
                <li><strong>Instant Neural Diagnosis</strong>: MobileNet vision model returns top disease and confidence score.</li>
                <li><strong>Microclimate Blight Risk Scoring</strong>: Weather inputs feed Bayesian outbreak risk calculations.</li>
                <li><strong>Actionable Organic Remediation</strong>: Clear non-chemical steps in local languages (English, Somali, Swahili).</li>
              </ol>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 font-['Space_Grotesk'] border-b border-slate-200 pb-1">
                Data sources and AI methods
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-700 border border-slate-200 rounded-lg">
                  <thead className="bg-slate-100 text-slate-900 font-semibold">
                    <tr>
                      <th className="p-2.5 border-b border-slate-200">Source</th>
                      <th className="p-2.5 border-b border-slate-200">Type</th>
                      <th className="p-2.5 border-b border-slate-200">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-900">PlantVillage</td>
                      <td className="p-2.5">Image Library</td>
                      <td className="p-2.5">54,000+ leaf images across 38 crop-disease pairs.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-900">CGIAR & FAO</td>
                      <td className="p-2.5">Surveys</td>
                      <td className="p-2.5">East African field surveys of pathogen frequencies.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-900">Open-Meteo & NASA</td>
                      <td className="p-2.5">Agroclimatic API</td>
                      <td className="p-2.5">Surface temp, precipitation anomalies, soil moisture.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 font-['Space_Grotesk'] border-b border-slate-200 pb-1">
                Challenges
              </h2>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pl-2">
                <li>Nutrient deficiencies can mimic viral stunt; physical soil testing remains essential.</li>
                <li>Low-end phone cameras in bright sun or shadows require robust data augmentation.</li>
                <li>Offline edge caching (ONNX/TFLite) is required for remote farms without cell data.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 font-['Space_Grotesk'] border-b border-slate-200 pb-1">
                What next?
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Acoustic pest sensing (locust frequency), native voice interfaces in Somali and Swahili, and automated SMS cooperative alerts to nearby farms upon confirmed blight outbreaks.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 font-['Space_Grotesk'] border-b border-slate-200 pb-1">
                Acknowledgments
              </h2>
              <div className="my-3 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                <img 
                  src="/leaf3.png" 
                  alt="Course Acknowledgments and Maintainer" 
                  className="w-full h-auto object-contain"
                  referrerPolicy="no-referrer" 
                />
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pl-2">
                <li>University of Helsinki & Reaktor (Building AI course team)</li>
                <li>PlantVillage Project (Penn State University)</li>
                <li>CGIAR & FAO Agricultural Data initiatives</li>
                <li>Maintained by: <strong>Abdullahi Muse Isse (@DDHDDHD3)</strong></li>
              </ul>
            </section>

          </div>
        )}
      </div>

    </div>
  );
};
