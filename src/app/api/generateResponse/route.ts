import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    console.log(`Received prompt: ${prompt}`);

    const messages = prompt.split('\n').map((line: string) => {
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

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        ...messages,
        {
          role: 'system',
          content: `When generating the response, please provide the generated answer along with the specific text excerpts you used from the context. Format your response as: "Answer: <generated answer>. Used Text: <text excerpts>".`,
        },
      ],
      max_tokens: 300,
    });

    if (!response || !response.choices || response.choices.length === 0) {
      console.error('Invalid response structure:', response);
      return NextResponse.json({ error: 'Invalid response from OpenAI API.' }, { status: 500 });
    }

    const fullResponse = response.choices[0].message?.content;

    if (!fullResponse) {
      console.error('No content in response:', response);
      return NextResponse.json({ error: 'No content in response from OpenAI API.' }, { status: 500 });
    }

    // 解析模型返回的回答和使用的文本
    const [answer, usedText] = fullResponse.split('Used Text:').map(part => part.trim());
    const usedTextArray = usedText ? usedText.split('\n').map(text => text.trim()).filter(text => text) : [];

    return NextResponse.json({ text: answer.replace('Answer:', '').trim(), usedText: usedTextArray });
  } catch (error) {
    console.error('Error generating response:', error);
    return NextResponse.json({ error: 'Failed to generate response.' }, { status: 500 });
  }
}
