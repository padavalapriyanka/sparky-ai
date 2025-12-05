// server.js - simple express + demo chatbot proxy
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../')); // serve static files (index.html etc) when run from server folder

const PORT = process.env.PORT || 3000;

// Demo /api/chat
app.post('/api/chat', async (req, res) => {
  const { message } = req.body ?? {};
  if (!message) return res.status(400).json({ error: 'No message' });

  // === Simple demo reply (local fallback) ===
  // This block will run unless you set AI_PROVIDER env var to 'OPENAI' or other and implement below.
  if (!process.env.AI_PROVIDER) {
    const reply = `You said: "${message}". (This is a demo response. To enable real AI, set AI_PROVIDER and update server.js)`;
    return res.json({ reply });
  }

  // === Example: how to forward to OpenAI (pseudocode) ===
  // If you want to call OpenAI Chat Completions, implement here. Example (DO NOT commit your API key):
  if (process.env.AI_PROVIDER === 'OPENAI') {
    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY not set on server' });

    try {
      const payload = {
        model: 'gpt-4o-mini', // choose model
        messages: [
          { role: 'system', content: 'You are Sparky, a helpful chatbot for the Sparky.ai site.' },
          { role: 'user', content: message }
        ]
      };

      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const j = await r.json();
      // parse response according to provider format:
      const reply = j.choices?.[0]?.message?.content ?? JSON.stringify(j);
      return res.json({ reply });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'AI provider error' });
    }
  }

  // unknown provider
  res.status(400).json({ error: 'Unsupported AI_PROVIDER' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
