// src/app/api/generateResponse/route.ts
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt, priority } = await request.json();
    console.log(`Received prompt: ${prompt}`);
    console.log(`Priority: ${priority}`);

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 50,
    });

    console.log('Bot response:', response);
    return NextResponse.json({ text: response.choices[0].message.content });
  } catch (error) {
    console.error('Error generating response:', error);
    return NextResponse.json({ error: 'Failed to generate response.' }, { status: 500 });
  }
}
