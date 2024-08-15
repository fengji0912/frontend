//generateResponse.tsx

import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this key is set in .env.local
});
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Request body:', req.body);

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 150,
      temperature: 0.7,
    });

    console.log('OpenAI response:', response);

    const text = response.choices[0]?.text?.trim() || 'No response generated.';
    console.log('Response text:', text);

    res.status(200).json({ text });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Sorry, something went wrong.' });
  }
}
