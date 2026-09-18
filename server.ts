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
    aiClient = new GoogleGenAI({ apiKey });
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

// AI Agronomist consultation endpoint
app.post("/api/advise", async (req, res) => {
  const { crop, disease, symptoms, language = "en", question } = req.body;
  
  const client = getGeminiClient();

  // If Gemini API is available, generate dynamic response
  if (client) {
    try {
      const languagePrompt = language === "so"
        ? "Respond in clear, natural Somali (Af-Soomaali), with easy-to-follow agricultural instructions."
        : language === "sw"
        ? "Respond in clear, friendly Swahili (Kiswahili), with practical farming advice."
        : "Respond in clear, concise English with practical, accessible guidance.";

      const prompt = `You are CropGuard AI, an expert sustainable agronomist advisor trained to support smallholder farmers in Africa and developing regions.
The user has the following context:
- Crop: ${crop || "General field crop"}
- Diagnosed / Suspected Condition: ${disease || "General health inquiry"}
- Observed Symptoms: ${symptoms || "Unspecified leaf symptoms"}
- Farmer's Question: "${question || "What are the recommended organic treatments, cultural prevention measures, and soil recovery steps?"}"

${languagePrompt}

Structure your response with:
1. Brief Diagnosis & Root Cause (1-2 sentences)
2. Immediate Organic/Cultural Action (2-3 concrete, low-cost steps e.g. neem extract, wood ash, infected leaf pruning, crop spacing)
3. Preventive & Soil Management Tips (e.g. crop rotation, mulch, watering timing)
4. Safety & Sustainable Harvest advice.
Keep the advice practical, chemical-safe, and low-cost for smallholders.`;

      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      return res.json({
        advice: response.text || "Treatment advice generated successfully.",
        source: "gemini-3.8-flash"
      });
    } catch (err: any) {
      console.error("Gemini API error, falling back to expert knowledge base:", err?.message);
    }
  }

  // Graceful fallback agronomist advice when offline or key not provided
  let localizedFallback = "";
  if (language === "so") {
    localizedFallback = `Talooyinka Beeraleyda (CropGuard AI):
1. **Xaaladda Dalagga**: Wax ka qabashada cudurka ${disease || "dhibaatada caleemaha"} ee geedka ${crop || "dalaggaaga"}.
2. **Tallaabooyinka Degdegga ah ee Dabiiciga ah**:
   - Jar caleemaha aadka u buka oo gub ama meel fog ku aas si aanu cudurku ugu fidin beerta inteeda kale.
   - Isticmaal daawada dabiiciga ah ee saliidda geedka Neebka (Neem oil) ama dambaska qoryaha oo lagu qaso biyo iyo saabuun yar oo dabiici ah.
3. **Ilaalinta Ciidda iyo Biyaha**: Biyaha ha ku shubin caleemaha dushooda, ee waraabi xididdada hoose subaxdii hore si huurka xad-dhaafka ah looga fogaado.
4. **Beddelka Dalagga (Crop Rotation)**: Xilli beereedka dambe ha ku beerin isla noocan, ku beddel digir ama laws si carradu u hesho nafaqada Nitrogen-ta.`;
  } else if (language === "sw") {
    localizedFallback = `Ushauri wa Kilimo Endelevu (CropGuard AI):
1. **Hali ya Zao**: Kudhibiti ugonjwa wa ${disease || "majani"} kwenye zao la ${crop || "shamba lako"}.
2. **Hatua za Haraka za Kiasili**:
   - Punguza majani yaliyoathirika na uyachome mbali na shamba ili kuzuia kuenea kwa fangasi.
   - Nyunyizia dawa ya kiasili ya mwarobaini (Neem extract) au majivu ya kuni yaliyochanganywa na sabuni kidogo ya asili.
3. **Usimamizi wa Shamba**: Mwagilia maji chini kwenye mizizi asubuhi na mapema badala ya kunyunyizia juu ya majani.
4. **Mzunguko wa Mazao**: Badilisha zao msimu ujao kwa kupanda kunde au maharagwe ili kuboresha rutuba ya udongo.`;
  } else {
    localizedFallback = `Expert Agronomy Advisory for ${crop || "Crops"} (${disease || "Plant Health Concern"}):
1. **Immediate Cultural Remediation**:
   - Prune and safely dispose of severely infected leaves (burn or bury away from compost) to halt spore dispersal.
   - Apply organic botanical spray: Dilute cold-pressed neem oil (5ml per liter of water with a dash of mild soap) or steeped garlic-chili spray every 5-7 days.
2. **Moisture & Microclimate Control**:
   - Transition to drip or basin irrigation at soil level. Avoid overhead watering which creates prolonged leaf-wetness periods (>4 hours) ideal for fungal sporulation.
3. **Soil & Ecosystem Resilience**:
   - Apply dry grass mulch (leaving 5cm collar around main stem) to conserve moisture and prevent soil-borne pathogens from splashing onto lower foliage.
   - Practice a 3-year crop rotation with non-host legumes (e.g., cowpeas, beans) to fix nitrogen and break pathogen soil lifecycles.`;
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
