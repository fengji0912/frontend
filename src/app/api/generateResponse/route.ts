import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    console.log(`Received prompt: ${prompt}`);

    // 创建聊天消息列表
    const messages = prompt.split('\n').map((line: string, index: any) => {
      // 解析消息类型
      if (line.startsWith('Context:')) {
        return { role: 'system', content: line.replace('Context:', '').trim() };
      } else if (line.startsWith('User:')) {
        return { role: 'user', content: line.replace('User:', '').trim() };
      } else if (line.startsWith('Bot:')) {
        return { role: 'assistant', content: line.replace('Bot:', '').trim() };
      }
      return null;
    }).filter((msg: null) => msg !== null);

    console.log('Parsed messages:', messages);

    // 使用 OpenAI API 生成响应
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 150,
    });

    console.log('Bot response:', response);
    return NextResponse.json({ text: response.choices[0].message.content });
  } catch (error) {
    console.error('Error generating response:', error);
    return NextResponse.json({ error: 'Failed to generate response.' }, { status: 500 });
  }
}
