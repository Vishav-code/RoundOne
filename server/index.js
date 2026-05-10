require('dotenv').config();

const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate-workout', async (req, res) => {
  try {
    const { focus, difficulty } = req.body;

    const response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: `
Create a kickboxing workout.

Focus: ${focus}
Difficulty: ${difficulty}

Return only JSON:
{
  "title": "",
  "warmup": "",
  "rounds": [
    { "round": 1, "drill": "", "coachingTip": "" },
    { "round": 2, "drill": "", "coachingTip": "" },
    { "round": 3, "drill": "", "coachingTip": "" }
  ],
  "finisher": "",
  "tips": ["", ""]
}
`,
    });

    let text = response.output_text.trim();

text = text
  .replace(/```json/g, '')
  .replace(/```/g, '')
  .trim();

res.json(JSON.parse(text));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate workout' });
  }
});

app.listen(3001, () => {
  console.log('AI workout server running on http://localhost:3001');
});