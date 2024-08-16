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

    // 使用 OpenAI API 生成最重要的 5 个实例问题
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
      max_tokens: 150, // 适当设置以确保返回的内容不超长
    });

    // 检查响应对象是否为 null 或 undefined
    if (!response || !response.choices || response.choices.length === 0) {
      console.error('Invalid response structure:', response);
      return NextResponse.json({ error: 'Invalid response from OpenAI API.' }, { status: 500 });
    }

    // 检查 message.content 是否存在
    const content = response.choices[0].message?.content;
    if (!content) {
      console.error('No content in response:', response);
      return NextResponse.json({ error: 'No content in response from OpenAI API.' }, { status: 500 });
    }

    console.log('Generated questions:', content);
    
    // 处理并提取问题
    const questions = content
      .split('\n') // 根据实际响应格式调整
      .filter(question => question.trim()) // 过滤掉空行
      .slice(0, 5); // 取前 5 个问题

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json({ error: 'Failed to generate questions.' }, { status: 500 });
  }
}
