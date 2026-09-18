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

* **University of Helsinki & Reaktor**: Creators of the inspiring *Elements of AI* and *Building AI* courses.
* **PlantVillage Project (Penn State University)**: For releasing the open crop disease computer vision dataset.
* **CGIAR & FAO**: For open data publications on agricultural development and sustainable pest management.
* [Sleeping Cat on Her Back by Umberto Salvagnin](https://commons.wikimedia.org/wiki/File:Sleeping_cat_on_her_back.jpg#filelinks) / [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) (referenced as per course template guidelines).
* Developer Profile & Repository Maintainer: [Abdullahi Muse Isse (@DDHDDHD3)](https://github.com/DDHDDHD3)
`;

export const CourseReadmeSubmissionModal: React.FC = () => {
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
      <div className="bg-gradient-to-br from-amber-950/60 via-stone-900/60 to-emerald-950/40 rounded-2xl p-6 border border-amber-500/30 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Building AI Final Project Honors Ready
              </span>
              <span className="text-xs text-stone-300 font-mono">University of Helsinki &bull; Reaktor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Space_Grotesk']">
              GitHub README & Submission Guide for @DDHDDHD3
            </h1>
            <p className="text-sm text-stone-300 max-w-3xl leading-relaxed">
              This formatted project plan conforms strictly to the Building AI course criteria. You can copy or download this README, push it to your GitHub account (<strong className="text-emerald-300 font-mono">https://github.com/DDHDDHD3/</strong>), and submit the repository URL for course completion honors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-md cursor-pointer"
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {isCopied ? 'Copied to Clipboard!' : 'Copy README.md'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs border border-stone-700 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download File
            </button>
            <a
              href="https://github.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition-all cursor-pointer"
            >
              <Github className="w-4 h-4" />
              <span>Create Repo on GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Course Grading Requirements Validation Checklist */}
        <div className="mt-5 pt-4 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-stone-950/60 border border-emerald-900/40 flex items-center gap-2 text-stone-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Heading <strong>## Summary</strong> included</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-950/60 border border-emerald-900/40 flex items-center gap-2 text-stone-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>~250 character summary text</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-950/60 border border-emerald-900/40 flex items-center gap-2 text-stone-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Includes <strong>"Building AI course project"</strong></span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-950/60 border border-emerald-900/40 flex items-center gap-2 text-stone-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Standard Course Markdown Structure</span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Submission Guide for Abdullahi Muse Isse (@DDHDDHD3) */}
      <div className="bg-stone-900/50 rounded-2xl p-5 sm:p-6 border border-stone-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400" />
          Step-by-Step Guide: How to Submit & Receive Course Honors
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
              1
            </span>
            <h3 className="font-bold text-white text-sm">Create GitHub Repo</h3>
            <p className="text-stone-300 leading-relaxed">
              Go to <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline font-mono">github.com/new</a> with your account <strong className="text-white">DDHDDHD3</strong>. Name the repo <code className="text-amber-300 bg-stone-900 px-1 py-0.5 rounded">cropguard-ai</code>, set it to <strong>Public</strong>, and check <em>"Initialize with a README"</em>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
              2
            </span>
            <h3 className="font-bold text-white text-sm">Paste & Commit README</h3>
            <p className="text-stone-300 leading-relaxed">
              Click the pencil icon to edit <code className="text-amber-300 bg-stone-900 px-1 py-0.5 rounded">README.md</code> in your repo. Click <strong>Copy README.md</strong> above, paste the content into the editor, and click <strong>"Commit changes"</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
              3
            </span>
            <h3 className="font-bold text-white text-sm">Submit URL & Peer Review</h3>
            <p className="text-stone-300 leading-relaxed">
              Copy your repository link <code className="text-emerald-300 bg-stone-900 px-1 py-0.5 rounded">https://github.com/DDHDDHD3/cropguard-ai</code> into the course submission form. Complete 3 peer reviews to finalize your certificate!
            </p>
          </div>
        </div>
      </div>

      {/* README Viewer Tabs */}
      <div className="bg-stone-900/60 rounded-2xl border border-stone-800 overflow-hidden">
        <div className="flex items-center justify-between p-3 sm:px-6 bg-stone-950 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'preview'
                  ? 'bg-emerald-600 text-white'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Rendered Preview
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'raw'
                  ? 'bg-emerald-600 text-white'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Raw Markdown
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 px-3 py-1 rounded-lg transition-colors cursor-pointer"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Content Viewer */}
        {viewMode === 'raw' ? (
          <div className="p-4 sm:p-6 bg-stone-950/90 overflow-x-auto font-mono text-xs text-emerald-300/90 leading-relaxed whitespace-pre-wrap max-h-[600px] overflow-y-auto">
            {RAW_README_CONTENT}
          </div>
        ) : (
          <div className="p-6 sm:p-8 bg-stone-950/50 space-y-6 text-stone-200 text-sm max-h-[600px] overflow-y-auto leading-relaxed font-sans">
            
            <div className="border-b border-stone-800 pb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-['Space_Grotesk']">
                CropGuard AI: Early Plant Disease Diagnostic & Climate-Smart Advisory
              </h1>
              <p className="text-xs font-mono text-amber-400 mt-1">
                Final project for the Building AI course
              </p>
            </div>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] border-b border-stone-800/80 pb-1">
                Summary
              </h2>
              <p className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-800/30 text-emerald-200 text-xs sm:text-sm font-medium">
                CropGuard AI is an accessible, offline-capable crop health diagnostic and drought-risk advisory system empowering smallholder farmers to detect crop diseases from leaf photos early and adopt climate-resilient farming techniques. (Building AI course project)
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] border-b border-stone-800/80 pb-1">
                Background
              </h2>
              <p className="text-xs sm:text-sm text-stone-300">
                Agriculture forms the backbone of livelihood and food security for over 60% of Sub-Saharan Africa and arid/semi-arid regions worldwide. However, smallholder farmers lose up to 40% of their harvests annually to preventable plant pathogens, pests, and sudden climatic shifts.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-stone-300 pl-2">
                <li><strong>Severe shortage of agricultural extension officers</strong>: In rural districts, the ratio is often 1 officer per 3,000+ farmers.</li>
                <li><strong>Delayed disease identification</strong>: Fungal blights and viral vectors spread rapidly across fields before diagnosis.</li>
                <li><strong>Misuse of chemical treatments</strong>: Purchasing inappropriate chemicals damages soil microbiomes and incurs debt.</li>
                <li><strong>Climate volatility</strong>: Shifting rainy seasons demand predictive guidance on drought stress and microclimate disease risk.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] border-b border-stone-800/80 pb-1">
                How is it used?
              </h2>
              <p className="text-xs sm:text-sm text-stone-300">
                Designed for frontline use in rural and peri-urban fields under variable connectivity conditions:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-xs text-stone-300 pl-2">
                <li><strong>Leaf Symptom Capture</strong>: Mobile photo upload or symptom selection.</li>
                <li><strong>Instant Neural Diagnosis</strong>: MobileNet vision model returns top disease and confidence score.</li>
                <li><strong>Microclimate Blight Risk Scoring</strong>: Weather inputs feed Bayesian outbreak risk calculations.</li>
                <li><strong>Actionable Organic Remediation</strong>: Clear non-chemical steps in local languages (English, Somali, Swahili).</li>
              </ol>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] border-b border-stone-800/80 pb-1">
                Data sources and AI methods
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-stone-300 border border-stone-800 rounded-lg">
                  <thead className="bg-stone-900 text-white font-semibold">
                    <tr>
                      <th className="p-2 border-b border-stone-800">Source</th>
                      <th className="p-2 border-b border-stone-800">Type</th>
                      <th className="p-2 border-b border-stone-800">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    <tr>
                      <td className="p-2 font-medium text-white">PlantVillage</td>
                      <td className="p-2">Image Library</td>
                      <td className="p-2">54,000+ leaf images across 38 crop-disease pairs.</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium text-white">CGIAR & FAO</td>
                      <td className="p-2">Surveys</td>
                      <td className="p-2">East African field surveys of pathogen frequencies.</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium text-white">Open-Meteo & NASA</td>
                      <td className="p-2">Agroclimatic API</td>
                      <td className="p-2">Surface temp, precipitation anomalies, soil moisture.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] border-b border-stone-800/80 pb-1">
                Challenges
              </h2>
              <ul className="list-disc list-inside space-y-1 text-xs text-stone-300 pl-2">
                <li>Nutrient deficiencies can mimic viral stunt; physical soil testing remains essential.</li>
                <li>Low-end phone cameras in bright sun or shadows require robust data augmentation.</li>
                <li>Offline edge caching (ONNX/TFLite) is required for remote farms without cell data.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] border-b border-stone-800/80 pb-1">
                What next?
              </h2>
              <p className="text-xs sm:text-sm text-stone-300">
                Acoustic pest sensing (locust frequency), native voice interfaces in Somali and Swahili, and automated SMS cooperative alerts to nearby farms upon confirmed blight outbreaks.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] border-b border-stone-800/80 pb-1">
                Acknowledgments
              </h2>
              <ul className="list-disc list-inside space-y-1 text-xs text-stone-300 pl-2">
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
