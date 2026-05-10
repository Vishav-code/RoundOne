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
app.get('/test', (req, res) => {
  res.json({ message: 'server works' });
});
app.post('/generate-workout', async (req, res) => {
  try {
    const { focuses, difficulty } = req.body;

    const response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: `
Create a kickboxing workout.

Focus areas: ${focuses.join(', ')}
Difficulty: ${difficulty}

Create a hybrid workout that blends all selected focus areas naturally.

Each round must include:
- durationSeconds as a number
- steps as an array of 3-5 short instructions

Beginner rounds should be 60-90 seconds.
Intermediate rounds should be 90-120 seconds.
Advanced rounds should be 120-180 seconds.

Return only JSON:
{
  "title": "",
  "warmup": "",
  "rounds": [
    {
      "round": 1,
      "drill": "",
      "coachingTip": "",
      "durationSeconds": 90,
      "steps": ["", "", ""]
    },
    {
      "round": 2,
      "drill": "",
      "coachingTip": "",
      "durationSeconds": 90,
      "steps": ["", "", ""]
    },
    {
      "round": 3,
      "drill": "",
      "coachingTip": "",
      "durationSeconds": 90,
      "steps": ["", "", ""]
    }
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

app.listen(3001, '0.0.0.0', () => {
  console.log('AI workout server running on http://0.0.0.0:3001');
});