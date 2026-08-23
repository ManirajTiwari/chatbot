import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// 1. Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 2. Validate key presence
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ CRITICAL: GEMINI_API_KEY is not defined in server/.env");
}

// 3. Initialize GoogleGenAI
const ai = new GoogleGenAI({ apiKey: apiKey });

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 4. Call Gemini Model
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
    });

    res.json({ reply: response.text });
  } catch (error) {
    // Print the EXACT Google error object to terminal
    console.error('❌ Detailed Gemini API Error:', error);

    res.status(500).json({ 
      error: 'Failed to generate response', 
      details: error.message || String(error) 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));