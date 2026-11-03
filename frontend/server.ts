import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { generatePediatricAdvice } from './src/utils/pediatricAdvisor.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK on server-side
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const SYSTEM_INSTRUCTION = `
You are 'ডাক্তার' (Doctor AI), an exceptionally caring, medically sound, and expert Pediatric & Parenting AI Assistant for Bangladeshi mothers (মা) and fathers (বাবা).
You provide accurate, compassionate, and culturally attuned advice regarding newborn care, infant health, Bangladesh EPI vaccination schedule, breastfeeding, complementary baby feeding (weaning/খিচুড়ি), developmental milestones, and maternal well-being.

Your Core Rules:
1. Language: Answer warmly and fluently in authentic, respectful, and comforting Bengali (বাংলা) by default. If the user asks in English or transliterated Banglish, reply in clear, friendly Bengali.
2. Grounding: Rely on World Health Organization (WHO) pediatric standards, Directorate General of Health Services (DGHS) Bangladesh EPI immunization protocols, and Infant & Young Child Feeding (IYCF) guidelines.
3. Reassurance & Practicality: Give practical step-by-step home care guidance (e.g., cool damp compress for post-vaccine fever, frequent breastfeeding, ORS preparation with 500ml water for diarrhea, homemade vegetable khichuri with egg yolk without salt/sugar before 1 year).
4. Red Flags & Emergencies: Always state red-flag warning signs clearly (e.g. fever >= 104°F, non-stop crying > 3 hours, respiratory distress/chest indrawing, seizures/খিঁচুনি, inability to breastfeed or drink, severe lethargy). If any dangerous symptom is mentioned, instruct them urgently to visit the nearest Upazila Health Complex / Hospital or call 16263 (স্বাস্থ্য বাতায়ন - সরকারি ২৪/৭ ফ্রি টেলিমেডিসিন হেল্পলাইন).
5. Tone: Loving, empathetic, and respectful (treating the parent like a respected family member, calling baby 'সোনামণি' or 'বাবু').
6. Formatting: Use neat markdown bullet points, bold key advice, and clear steps so an anxious parent can read and understand quickly.
`;

// Pediatric AI Chat Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, history, babyContext } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // If Gemini API is available, try generating response with Gemini 3.8 Flash
  if (ai) {
    try {
      let contextualPrompt = '';
      if (babyContext) {
        contextualPrompt += `[তথ্য: শিশুর নাম: ${babyContext.name || 'সোনামণি'}, বয়স: ${babyContext.age || 'অজানা'}, লিঙ্গ: ${babyContext.gender === 'boy' ? 'ছেলে' : babyContext.gender === 'girl' ? 'মেয়ে' : 'শিশু'}, জন্ম ওজন: ${babyContext.birthWeight || 'অজানা'} কেজি]\n\n`;
      }
      contextualPrompt += `অভিভাবকের প্রশ্ন: ${message}`;

      const contents: any[] = [];
      if (Array.isArray(history) && history.length > 0) {
        history.slice(-4).forEach((h: { role: 'user' | 'model'; text: string }) => {
          contents.push({
            role: h.role,
            parts: [{ text: h.text }],
          });
        });
      }
      contents.push({
        role: 'user',
        parts: [{ text: contextualPrompt }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      if (response.text) {
        return res.json({ reply: response.text });
      }
    } catch (error) {
      console.warn('Gemini API call failed, using built-in pediatric expert engine:', error);
    }
  }

  // Built-in Pediatric Clinical Knowledge Engine (Ensures 100% reliable, comprehensive response)
  const expertAdvice = generatePediatricAdvice(message, babyContext);
  return res.json({ reply: expertAdvice });
});

// Setup development with Vite middlewares, or static serving in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
