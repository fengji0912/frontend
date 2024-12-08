import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { full_text } = await request.json();
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an academic assistant responsible for summarizing academic literature. 
          Please read the following literature, summarize its core ideas and state the research objectives, methods and conclusions of the paper in the abstract (make sure the abstract is accurate, clear and concise)`,
        },
        {
          role: 'user',
          content: full_text,
        },
      ],
      max_tokens: 1000,
    });
    const abstract = response.choices[0]?.message?.content || '';

    return NextResponse.json({ abstract });
  } catch (error) {
    console.error('Error generating abstract:', error);
    return NextResponse.json({ abstract: '' }, { status: 500 });
  }
}
