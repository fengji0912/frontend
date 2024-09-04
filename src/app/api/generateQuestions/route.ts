// src/app/api/generateQuestions/route.ts
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    console.log(`Received text: ${text}`);
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Generate the top 5 most important example questions based on the provided text.'
        },
        {
          role: 'user',
          content: text
        }
      ],
      max_tokens: 150, 
    });
    if (!response || !response.choices || response.choices.length === 0) {
      console.error('Invalid response structure:', response);
      return NextResponse.json({ error: 'Invalid response from OpenAI API.' }, { status: 500 });
    }
    const content = response.choices[0].message?.content;
    if (!content) {
      console.error('No content in response:', response);
      return NextResponse.json({ error: 'No content in response from OpenAI API.' }, { status: 500 });
    }
    const questions = content
      .split('\n')
      .filter(question => question.trim())
      .slice(0, 5); 
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json({ error: 'Failed to generate questions.' }, { status: 500 });
  }
}
