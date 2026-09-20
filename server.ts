import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
    project: "CropGuard AI - Building AI Final Project",
    author: "Abdullahi Muse Isse (@DDHDDHD3)"
  });
});

// Helper to construct role-specific system instructions
function buildSystemInstruction(
  role: string = "agronomist",
  language: string = "en",
  cropContext?: any,
  bayesContext?: any,
  enableSearch?: boolean
): string {
  const langDirective = language === "so"
    ? "Always respond in clear, natural Somali (Af-Soomaali) with practical, accessible terminology for farmers in East Africa."
    : language === "sw"
    ? "Always respond in clear, friendly Swahili (Kiswahili) with practical terminology for smallholder farmers."
    : "Always respond in clear, precise English with structured formatting.";

  let rolePersona = "";
  if (role === "pathologist") {
    rolePersona = `You are a Senior Plant Pathologist & Quantitative Epidemiologist for CropGuard AI.
Your expertise is deep cellular pathology, fungal sporulation dynamics, viral vector transmission (e.g. whitefly, aphids), physiological chlorosis/necrosis distinction, and Bayesian disease risk modeling.
Provide rigorous, scientifically backed analysis, differential diagnoses, and biochemical/biological containment protocols.`;
  } else if (role === "triage") {
    rolePersona = `You are a Rapid Field Triage First Responder for CropGuard AI.
Your priority is ultra-fast, direct, and actionable emergency triage for field workers encountering active blight or pests.
Provide concise bullet points:
1. Immediate Field Containment (pruning, quarantine distance, hygiene)
2. Fast Organic Treatment Recipe & Dosage (neem, ash, bio-fungicides)
3. 24-Hour Watchlist Signs`;
  } else {
    rolePersona = `You are CropGuard AI, an expert Sustainable Field Agronomist & Organic Extension Advisor.
Your mission is to support smallholder farmers in developing nations with practical, chemical-safe, low-cost Integrated Pest Management (IPM), companion planting, soil moisture preservation, and sustainable fertility.`;
  }

  let contextBlock = "";
  if (cropContext) {
    contextBlock += `\n[Active Crop Diagnostic Context]:
- Crop: ${cropContext.crop || "General crop"}
- Identified Pathology: ${cropContext.name || "None"}
- Scientific Name: ${cropContext.scientificName || "N/A"}
- Pathogen Type: ${cropContext.pathogenType || "Unknown"}
- Diagnostic Severity: ${cropContext.severity || "Moderate"}
- Reported Symptoms: ${Array.isArray(cropContext.symptoms) ? cropContext.symptoms.join(", ") : cropContext.symptoms || "None"}`;
  }

  if (bayesContext) {
    contextBlock += `\n[Microclimate Bayesian Risk Calculation]:
- Calculated Posterior Outbreak Probability: ${bayesContext.posteriorProbability}% (${bayesContext.riskCategory})
- Combined Environmental Likelihood Ratio: ${bayesContext.likelihoodRatio}x
- Active Microclimate Risk Drivers: ${bayesContext.keyDrivers || "High humidity / leaf wetness"}
- Epidemiological Urgency: ${bayesContext.posteriorProbability > 50 ? "CRITICAL OUTBREAK WARNING" : "PREVENTATIVE MONITORING"}`;
  }

  if (enableSearch) {
    contextBlock += `\n[Search Grounding Enabled]: Use real-time Google Search data to verify current regional outbreak alerts, recent research findings, weather patterns, or emerging pest strains when relevant. Cite verified insights.`;
  }

  return `${rolePersona}

${langDirective}
${contextBlock}

Maintain helpful, authoritative, respectful tone. Format responses using clean markdown headers and bullet points.`;
}

// Comprehensive Agronomy Fallback Generator with rich Markdown
function getAgronomyFallback(
  lastUserMessage: string,
  language: string,
  role: string,
  activeCrop?: any,
  activeBayesRisk?: any
): string {
  const cropName = activeCrop?.crop || "Field Crop";
  const diseaseName = activeCrop?.name || "Leaf Stress";
  const bayesText = activeBayesRisk
    ? `\n\n> **Microclimate Risk Alert**: Bayesian posterior outbreak probability is rated at **${activeBayesRisk.posteriorProbability || 58}% (${activeBayesRisk.riskCategory || "Elevated"})** with a likelihood ratio of **${activeBayesRisk.likelihoodRatio || "2.4"}x** due to sustained leaf wetness.`
    : "";

  if (language === "so") {
    if (role === "triage") {
      return `### 🚨 Samatabixinta Degdegga ah ee Beerta (CropGuard AI Triage)

**Cudurka/Dhibaatada**: ${cropName} (${diseaseName})
${bayesText}

#### 1. Go'doominta Degdegga ah (Immediate Field Isolation)
* **Kala fogaanshaha**: Dhirta jiran ka ilaali kuwa caafimaadka qaba ugu yaraan 2 mitir.
* **Qalabka beerta**: Ku nadiifi mindiyaha iyo maqasyada xalka dambaska qoryaha ama jeermis-dile ka hor intaadan taaban dhir kale.
* **Jarista caleemaha**: Jar dhammaan caleemaha dhibco madow ama huruud leh, ku rid kiish xiran, oo gub ama meel fog ku aas.

#### 2. Daawo Dabiici ah oo Degdeg ah (Organic Spray)
* **Cuntada Neebka**: Isku qas 50ml oo saliidda Neebka ah (Neem oil), 10L oo biyo qandac ah, iyo 5g oo saabuun dabiici ah.
* **Habka Buufinta**: Ku buufi caleenta hoosteeda iyo korkeeda subaxdii hore ka hor qorraxda xooggan.

#### 3. Waxyaabaha La Iska Ilaalinayo (24-Saac ee Soo Socda)
1. Caleemaha dushooda biyo ha ku shubin (waxay kordhisaa faafitaanka fangaska).
2. Ha dhex socon beerta inta caleentu qoyan tahay.`;
    }

    return `### 🌱 Talooyinka Cilmiga Beeraha (CropGuard AI Agronomist)

Waxaan falanqeynay su'aashaada: **"${lastUserMessage}"** ee ku saabsan **${cropName}** (${diseaseName}).
${bayesText}

#### Falanqaynta Cudurka & Xaaladda
Cudurrada caleemaha ku dhaca sida dhibic-dhibicda fangaska (Fungal Blight) waxay ku faafaan huurka sare iyo dhibcaha biyaha ee ku fida caleenta.

#### Jadwalka Daaweynta Dabiiciga ah (Integrated Pest Management)

| Maalinta | Tallaabada La Qaadayo | Qalabka / Daawada |
| :--- | :--- | :--- |
| **Maalinta 1** | Jarista caleemaha buka iyo nadiifinta beerta | Maqas jeermis dilay |
| **Maalinta 2** | Buufinta saliidda geedka Neebka ama toonta | 5ml Neem / 1L biyo |
| **Maalinta 5** | Ku dhex-bearidda dalagyo kale (Companion Planting) | Digir ama Basal |
| **Maalinta 8** | Ku buufinta dambaska qoryaha si loo adkeeyo caleenta | Dambas la sifeeyay |

#### Talooyinka Ilaalinta Ciidda iyo Biyaha
* **Daboolista Carrada (Mulching)**: Dhig caws qallalan oo dhumucdiisu tahay 5cm xididdada geedka agtiisa si looga hortago in carrada wasakhoowday ay ku booddo caleenta hoose.
* **Habka Waraabka**: Isticmaal waraabka dhibicda (Drip irrigation) halkii aad dusha kaga rushayn lahayd.`;
  }

  if (language === "sw") {
    if (role === "triage") {
      return `### 🚨 Hatua za Dharura za Shamba (CropGuard AI Triage)

**Zao / Ugonjwa**: ${cropName} (${diseaseName})
${bayesText}

#### 1. Kutenga Sehemu Iliyoathirika (Immediate Containment)
* **Tenga mimea**: Zuia kugusana kwa mimea yenye dalili na mimea yenye afya kwa umbali wa mita 2.
* **Usafi wa vifaa**: Safisha mikasi ya kupogoa kwa maji moto na majivu ya kuni kabla ya kuhamia kwenye mimea mingine.
* **Uondoaji wa majani**: Kata majani yaliyoathirika na uyazike mbali na shamba au kuyachoma moto.

#### 2. Dawa ya Haraka ya Kiasili (Organic Formulation)
* **Dawa ya Mwarobaini (Neem)**: Changanya vijiko 2 vya mafuta ya mwarobaini na nusu kijiko cha sabuni ya asili kwenye lita 1 ya maji.
* **Upuliziaji**: Nyunyizia asubuhi na mapema chini ya majani na juu ya majani.

#### 3. Ishara za Kufuatilia Masaa 24
1. Zingatia iwapo madoa mapya meusi yanajitokeza kwenye mimea jirani.
2. Hakikisha majani hayalowi maji wakati wa umwagiliaji.`;
    }

    return `### 🌱 Ushauri wa Kitaalamu wa Kilimo (CropGuard AI Agronomist)

Uchambuzi wa swali lako: **"${lastUserMessage}"** kuhusu **${cropName}** (${diseaseName}).
${bayesText}

#### Usimamizi Endelevu wa Shamba (IPM Strategy)
Ili kudhibiti magonjwa ya majani bila kutumia kemikali zenye madhara, tumia mbinu zifuatazo zilizojaribiwa:

#### Ratiba ya Matibabu ya Asili

| Siku | Hatua ya Matibabu | Dawa / Njia |
| :--- | :--- | :--- |
| **Siku ya 1** | Kupogoa majani yenye madoa na kuyaangamiza | Mikasi iliyosafishwa |
| **Siku ya 2** | Kunyunyizia mchanganyiko wa mwarobaini na kitunguu saumu | Mwarobaini + Maji |
| **Siku ya 5** | Kuweka matandazo ya majani makavu (Mulch) | Majani makavu |
| **Siku ya 9** | Kupanda mimea rafiki kama marigold au vitunguu | Mimea kinga |

#### Ushauri wa Umwagiliaji
* Mwagilia maji chini kwenye shina badala ya kunyunyizia juu ya majani ili kupunguza unyevu unaosababisha fangasi.`;
  }

  // English Default
  if (role === "pathologist") {
    return `### 🔬 Cellular Pathology & Epidemiological Assessment

**Pathology Target**: ${cropName} — *${diseaseName}*
${bayesText}

#### Pathophysiological Diagnosis
The foliar symptoms reflect active parenchymal tissue breakdown. Fungal conidia germinate rapidly under elevated relative humidity (>85%) and surface moisture films exceeding 4 to 6 continuous hours.

#### Differential Diagnostic Framework

| Diagnostic Trait | Observed Manifestation | Pathological Indicator |
| :--- | :--- | :--- |
| **Lesion Morphology** | Concentric target rings or water-soaked chlorosis | Active fungal mycelial expansion |
| **Marginal Halos** | Yellow chlorotic margins surrounding necrotic tissue | Toxigenic breakdown of chlorophyll cells |
| **Vector Association** | Whitefly (*Bemisia tabaci*) or aphid colonization | Potential Begomovirus co-infection |
| **Leaf Wetness Vulnerability** | Rapid sporulation post-condensation | Phytophthora / Alternaria complex |

#### Biological & Cultural Interventions
1. **Bio-Fungicide Inoculation**:
   * Apply *Bacillus subtilis* or copper octanoate soap solutions at 7-day intervals to colonize leaf surface microflora competitively.
2. **Canopy Microclimate Manipulation**:
   * Increase inter-plant spacing by 20% to facilitate airflow and drive leaf vapor pressure deficits (VPD) above condensation thresholds.
3. **Soil Splash Suppression**:
   * Establish an organic mulch barrier (minimum 6 cm depth) to mitigate rain-drop kinetic velocity from aerosolizing soil-borne resting oospores.`;
  }

  if (role === "triage") {
    return `### ⚡ Emergency Field Triage Protocol (Rapid Response)

**Active Concern**: ${cropName} displaying symptoms of **${diseaseName}**.
${bayesText}

#### 1. Immediate Field Containment (First 60 Minutes)
* **Quarantine Perimeter**: Mark a 2-meter buffer zone around symptomatic plants; cease all cross-row field transit while leaves are damp.
* **Sanitation Protocol**: Sterilize pruning shears with 70% isopropyl alcohol or fresh wood-ash extract between each cut.
* **Foliar Pruning**: Excise heavily spotted (>30% lesion coverage) lower canopy leaves. **Do not compost** infected cuttings; seal and solarize or incinerate.

#### 2. Fast Botanical Protective Recipe
* **Cold-Pressed Neem Oil Emulsion**:
  * **Ratio**: 5 ml pure cold-pressed neem oil + 2 ml mild biodegradable liquid castile soap per 1 liter of lukewarm water.
  * **Application**: Spray thoroughly coating the **underside** of leaf canopies during late evening or dawn to prevent solar phytotoxicity.
* **Wood-Ash Protective Dusting**:
  * Dust a fine layer of clean, sifted hardwood ash directly onto moist foliage to elevate surface pH beyond the fungal spore germination zone.

#### 3. 24-Hour Critical Watchlist
1. **Water-Soaking**: Check if pale halo margins darken into limp, water-soaked tissue.
2. **Neighboring Rows**: Inspect upwind plants daily for early pinpoint chlorotic speckling.`;
  }

  // Field Agronomist
  return `### 🌱 Sustainable Agronomy Advisory & Treatment Plan

**Subject**: Management Protocol for **${cropName}** exhibiting symptoms of **${diseaseName}**.
${bayesText}

#### Integrated Pest Management (IPM) Overview
To achieve long-term control without expensive synthetic chemicals, we combine cultural sanitation, botanical biopesticides, and microclimate regulation.

#### Recommended Organic Action Schedule

| Timeline | Recommended Action | Method & Dosage |
| :--- | :--- | :--- |
| **Day 1 (Immediate)** | Selective Pruning & Disposal | Remove bottom necrotic leaves; bury away from garden |
| **Day 2 (Protection)** | Botanical Neem Foliar Spray | 5 ml neem oil + mild soap per 1 liter clean water |
| **Day 5 (Nutrition)** | Potassium & Micronutrient Boost | Diluted compost tea or wood-ash water drenches |
| **Day 8 (Repetition)** | Secondary Protective Coating | Re-spray neem or steeped garlic-chili extract |
| **Post-Harvest** | Legume Crop Rotation | Rotate with cowpeas or beans to break soil spore cycles |

#### Practical Field Tips for Smallholders
* **Irrigation Timing**: Always water directly at the root base during the early morning hours (6:00 AM – 8:00 AM). Avoid overhead bucket splashing which keeps leaves moist into the evening.
* **Mulching Barrier**: Place 5 cm of clean straw or dry grass around each plant stem (leaving a 3 cm air gap around the stem collar). This stops fungal spores in the soil from splashing onto lower leaves during rainfall.
* **Companion Planting**: Intercrop with pungent herbs such as basil, coriander, or African marigold (*Tagetes erecta*) to deter insect vectors that carry plant viruses.`;
}

// Multi-turn Gemini Chat Endpoint
app.post("/api/chat", async (req, res) => {
  const {
    messages = [],
    model = "gemini-3.5-flash",
    role = "agronomist",
    language = "en",
    enableSearchGrounding = true,
    activeCrop,
    activeBayesRisk
  } = req.body;

  const client = getGeminiClient();

  // Model selection enforcement:
  // User requested: gemini-3.1-pro-preview for complex tasks, gemini-3.5-flash for general tasks, and gemini-3.1-flash-lite for fast tasks.
  // Search Grounding uses gemini-3.5-flash with googleSearch tool.
  let selectedModel = model;
  if (enableSearchGrounding) {
    // Search Grounding is best anchored on gemini-3.5-flash as specified in requirements
    if (selectedModel !== "gemini-3.1-pro-preview") {
      selectedModel = "gemini-3.5-flash";
    }
  }

  if (client) {
    try {
      const systemInstruction = buildSystemInstruction(
        role,
        language,
        activeCrop,
        activeBayesRisk,
        enableSearchGrounding
      );

      // Build conversation contents maintaining multi-turn history
      // Gemini expects: [{ role: 'user' | 'model', parts: [{ text: '...' }] }]
      const formattedContents = messages.map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));

      // Ensure at least one message is present
      if (formattedContents.length === 0) {
        formattedContents.push({
          role: "user",
          parts: [{ text: "Hello CropGuard AI, please introduce your capabilities." }]
        });
      }

      // Configure tools: Google Search Grounding when enabled
      const tools = enableSearchGrounding ? [{ googleSearch: {} }] : undefined;

      let response: any;
      const callWithTimeout = async <T>(promise: Promise<T>, ms: number): Promise<T> => {
        let timeoutHandle: any;
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutHandle = setTimeout(() => reject(new Error(`Call timed out after ${ms}ms`)), ms);
        });
        return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutHandle));
      };

      const candidateModels = [
        selectedModel,
        "gemini-3.5-flash",
        "gemini-3.1-flash-lite"
      ];
      // Deduplicate candidate models
      const modelsToTry = Array.from(new Set(candidateModels));

      // Attempt 1: with search grounding if requested using gemini-3.5-flash (or selectedModel)
      if (enableSearchGrounding) {
        try {
          const searchModel = selectedModel === "gemini-3.1-pro-preview" ? "gemini-3.1-pro-preview" : "gemini-3.5-flash";
          response = await callWithTimeout(
            client.models.generateContent({
              model: searchModel,
              contents: formattedContents,
              config: {
                systemInstruction,
                tools: [{ googleSearch: {} }]
              }
            }),
            3500
          );
          selectedModel = searchModel;
        } catch (searchErr: any) {
          console.warn(`Google Search Grounding attempt with ${selectedModel} bypassed (${searchErr?.message || searchErr?.status}). Proceeding to direct model generation...`);
        }
      }

      // Attempt 2: direct model generation (without tools) if search wasn't used or failed
      if (!response) {
        for (const m of modelsToTry) {
          try {
            // Flash-lite gets 7000ms, other models get 3500ms
            const timeoutLimit = m === "gemini-3.1-flash-lite" ? 7000 : 3500;
            response = await callWithTimeout(
              client.models.generateContent({
                model: m,
                contents: formattedContents,
                config: {
                  systemInstruction
                }
              }),
              timeoutLimit
            );
            selectedModel = m;
            break;
          } catch (modelErr: any) {
            console.warn(`Attempt with ${m} without tools bypassed (${modelErr?.message || modelErr?.status})...`);
          }
        }
      }

      if (!response) {
        throw new Error("All Gemini model generation attempts exhausted");
      }

      const responseText = response.text || "Advice formulated successfully.";

      // Extract Google Search Grounding metadata
      const candidate = response.candidates?.[0];
      const groundingMetadata = candidate?.groundingMetadata;
      const groundingSources: { title: string; url: string }[] = [];

      if (groundingMetadata?.groundingChunks) {
        for (const chunk of groundingMetadata.groundingChunks) {
          if (chunk.web?.uri) {
            groundingSources.push({
              title: chunk.web.title || chunk.web.uri,
              url: chunk.web.uri
            });
          }
        }
      }

      const webSearchQueries: string[] = groundingMetadata?.webSearchQueries || [];

      return res.json({
        text: responseText,
        source: selectedModel,
        model: selectedModel,
        role,
        groundingSources,
        webSearchQueries
      });
    } catch (err: any) {
      console.error("Gemini Multi-turn Chat error:", err?.message || err);
    }
  }

  // Graceful Offline / Fallback Agronomy Engine
  const lastUserMessage = messages[messages.length - 1]?.text || "General Crop Advice";
  const fallbackText = getAgronomyFallback(lastUserMessage, language, role, activeCrop, activeBayesRisk);

  return res.json({
    text: fallbackText,
    source: "agronomy-knowledge-base",
    model: selectedModel,
    role,
    groundingSources: [],
    webSearchQueries: []
  });
});

// Real HTTP Server-Sent Events (SSE) Chat Streaming Endpoint
app.post("/api/chat/stream", async (req, res) => {
  const {
    messages = [],
    model = "gemini-3.5-flash",
    role = "agronomist",
    language = "en",
    enableSearchGrounding = true,
    activeCrop,
    activeBayesRisk
  } = req.body;

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  let isAborted = false;
  res.on("close", () => {
    if (!res.writableFinished) {
      isAborted = true;
    }
  });

  const sendSSE = (payload: any) => {
    if (!res.writableEnded && !isAborted) {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
      // @ts-ignore
      if (typeof res.flush === "function") res.flush();
    }
  };

  const client = getGeminiClient();

  let selectedModel = model;
  if (enableSearchGrounding && selectedModel !== "gemini-3.1-pro-preview") {
    selectedModel = "gemini-3.5-flash";
  }

  let streamedSuccessfully = false;

  if (client && !isAborted) {
    try {
      const systemInstruction = buildSystemInstruction(
        role,
        language,
        activeCrop,
        activeBayesRisk,
        enableSearchGrounding
      );

      const formattedContents = messages.map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));

      if (formattedContents.length === 0) {
        formattedContents.push({
          role: "user",
          parts: [{ text: "Hello CropGuard AI, please advise on field crop health." }]
        });
      }

      // Priority list of models to attempt streaming with
      const streamAttempts: Array<{ model: string; withSearch: boolean }> = [];

      if (enableSearchGrounding) {
        streamAttempts.push({ model: selectedModel, withSearch: true });
      }
      // Direct models without tools if search fails or is disabled
      streamAttempts.push({ model: selectedModel, withSearch: false });
      if (selectedModel !== "gemini-3.1-flash-lite") {
        streamAttempts.push({ model: "gemini-3.1-flash-lite", withSearch: false });
      }

      for (const attempt of streamAttempts) {
        if (isAborted) break;
        try {
          const config: any = { systemInstruction };
          if (attempt.withSearch) {
            config.tools = [{ googleSearch: {} }];
          }

          const responseStream = await client.models.generateContentStream({
            model: attempt.model,
            contents: formattedContents,
            config
          });

          let collectedGroundingSources: { title: string; url: string }[] = [];
          let collectedWebQueries: string[] = [];

          for await (const chunk of responseStream) {
            if (isAborted) break;

            if (chunk.text) {
              sendSSE({ type: "chunk", text: chunk.text });
            }

            const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata;
            if (groundingMetadata) {
              if (groundingMetadata.groundingChunks) {
                for (const gChunk of groundingMetadata.groundingChunks) {
                  if (gChunk.web?.uri) {
                    collectedGroundingSources.push({
                      title: gChunk.web.title || gChunk.web.uri,
                      url: gChunk.web.uri
                    });
                  }
                }
              }
              if (groundingMetadata.webSearchQueries) {
                collectedWebQueries.push(...groundingMetadata.webSearchQueries);
              }
            }
          }

          if (!isAborted) {
            if (collectedGroundingSources.length > 0 || collectedWebQueries.length > 0) {
              // Deduplicate sources
              const uniqueSources = Array.from(new Map(collectedGroundingSources.map(s => [s.url, s])).values());
              const uniqueQueries = Array.from(new Set(collectedWebQueries));
              sendSSE({
                type: "metadata",
                groundingSources: uniqueSources,
                webSearchQueries: uniqueQueries,
                model: attempt.model
              });
            }

            sendSSE({
              type: "done",
              model: attempt.model,
              role,
              source: attempt.model
            });
            streamedSuccessfully = true;
          }
          break; // Successfully streamed!
        } catch (attemptErr: any) {
          console.warn(`Stream attempt with ${attempt.model} (search: ${attempt.withSearch}) bypassed (${attemptErr?.status || attemptErr?.message}). Trying fallback stream...`);
        }
      }
    } catch (err: any) {
      console.error("Gemini streaming error:", err?.message || err);
    }
  }

  // If Gemini streaming did not occur or was exhausted, stream high-quality agronomy fallback progressively
  if (!streamedSuccessfully && !isAborted) {
    const lastUserMessage = messages[messages.length - 1]?.text || "General Crop Health";
    const fallbackText = getAgronomyFallback(lastUserMessage, language, role, activeCrop, activeBayesRisk);

    // Stream the fallback text in small natural chunks (2-3 words per chunk, 25ms pacing)
    const tokenChunks = fallbackText.match(/[^\s]+(\s+|$)/g) || [fallbackText];
    const chunkSize = 2; // small chunks for smooth streaming

    for (let i = 0; i < tokenChunks.length; i += chunkSize) {
      if (isAborted) break;
      const piece = tokenChunks.slice(i, i + chunkSize).join("");
      sendSSE({ type: "chunk", text: piece });
      await new Promise(resolve => setTimeout(resolve, 25));
    }

    if (!isAborted) {
      sendSSE({
        type: "done",
        model: selectedModel,
        role,
        source: "agronomy-knowledge-base"
      });
    }
  }

  if (!res.writableEnded) {
    res.end();
  }
});

// Backward compatibility alias for /api/advise
app.post("/api/advise", async (req, res) => {
  const { 
    crop, 
    disease, 
    symptoms, 
    language = "en", 
    question,
    bayesianRisk
  } = req.body;

  const messages = [
    {
      sender: "user",
      text: question || `What are the recommended organic treatments, cultural prevention measures, and soil recovery steps for ${crop || "field crops"} exhibiting symptoms of ${disease || "foliar stress"}?`
    }
  ];

  // Delegate to /api/chat handler logic
  const client = getGeminiClient();
  if (client) {
    try {
      const systemInstruction = buildSystemInstruction(
        "agronomist",
        language,
        { crop, name: disease, symptoms },
        bayesianRisk,
        true
      );

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ role: "user", parts: [{ text: messages[0].text }] }],
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }]
        }
      });

      return res.json({
        advice: response.text || "Treatment advice generated successfully.",
        source: "gemini-3.5-flash"
      });
    } catch (err: any) {
      console.warn("Advise endpoint fallback triggered:", err?.message);
    }
  }

  // Fallback
  let localizedFallback = `Expert Agronomy Advisory for ${crop || "Crops"} (${disease || "Plant Health Concern"}):
1. Immediately prune and dispose of infected foliage to prevent spore spread.
2. Apply cold-pressed neem oil or wood-ash extract.
3. Switch to soil-level irrigation and apply dry grass mulch.`;
  if (language === "so") {
    localizedFallback = `Talooyinka Beeraleyda ee ${crop || "Dalagga"}:
1. Jar caleemaha buka si cudurku uusan u fidin.
2. Isticmaal saliidda Neebka ama dambaska qoryaha.
3. Waraabi xididdada hoose subaxdii hore hana qoysin caleemaha dushooda.`;
  } else if (language === "sw") {
    localizedFallback = `Ushauri wa Kilimo kwa ${crop || "Zao"}:
1. Punguza majani yaliyoathirika na uyateketeze.
2. Nyunyizia dawa asili ya mwarobaini au majivu.
3. Mwagilia mashinani asubuhi na weka matandazo.`;
  }

  res.json({
    advice: localizedFallback,
    source: "agronomy-knowledge-base"
  });
});

// Setup Vite dev middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CropGuard AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
