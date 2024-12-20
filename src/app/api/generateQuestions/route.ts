import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { context } = await request.json();
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an academic assistant capable of generating example questions based on the provided text. Your task is to generate the top 5 most important example questions based on the provided context. The questions should be a mix of:
                    1. Questions based on individual documents.
                    2. Questions that compare or contrast different documents.
                    3. Broader questions that integrate the key points from all documents.

                    Please consider the following:
                    - If the context contains only one document, generate questions specific to that document.
                    - If the context contains multiple documents, generate comparative and integrative questions, along with specific questions for each document.
                    - Make sure the questions cover diverse aspects such as methodology, conclusions, comparisons, and key themes across the documents.`,
        },
        {
          role: 'user',
          content: context,
        },
      ],
      max_tokens: 1000,
    });
    if (!response || !response.choices || response.choices.length === 0) {
      console.error('Invalid response structure:', response);
      return NextResponse.json(
        { error: 'Invalid response from OpenAI API.' },
        { status: 500 }
      );
    }
    const content = response.choices[0].message?.content;
    if (!content) {
      console.error('No content in response:', response);
      return NextResponse.json(
        { error: 'No content in response from OpenAI API.' },
        { status: 500 }
      );
    }
    const questions = content
      .split('\n')
      .filter((question) => question.trim())
      .slice(0, 5);
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions.' },
      { status: 500 }
    );
  }
}
