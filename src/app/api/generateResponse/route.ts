import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt, priority } = await request.json(); // 解构 priority
    console.log(`Received prompt: ${prompt}, priority: ${priority}`);

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

    // 根据优先级设置不同的系统消息
    let systemMessage: string;
    switch (priority) {
      case 'low':
        systemMessage = `Provide a simple and easy-to-understand response suitable for a non-expert. Avoid technical jargon and keep explanations brief. Format your response as: "Answer: <generated answer>. Used Text: <text excerpts>".`;
        break;
      case 'mid':
        systemMessage = `Provide a moderately detailed response suitable for someone with basic knowledge in the field. Include explanations where necessary, but avoid overly technical details. Format your response as: "Answer: <generated answer>. Used Text: <text excerpts>".`;
        break;
      case 'high':
        systemMessage = `Provide a detailed and comprehensive response suitable for an expert. Include technical details and thorough explanations as needed. Format your response as: "Answer: <generated answer>. Used Text: <text excerpts>".`;
        break;
      default:
        systemMessage = `Provide a response with appropriate detail based on the given context. Format your response as: "Answer: <generated answer>. Used Text: <text excerpts>".`;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        ...messages,
        {
          role: 'system',
          content: systemMessage,
        },
      ],
      max_tokens: 300,
      stream: true,  // 关键：开启流式传输
    });

    // 创建一个可读流，用于发送数据
    const stream = new ReadableStream({
      async start(controller) {
        let accumulatedText = '';

        for await (const chunk of response) {
          const { choices } = chunk;
          if (choices && choices[0] && choices[0].delta && choices[0].delta.content) {
            const text = choices[0].delta.content;
            accumulatedText += text;
          }
        }

        // 解析响应中的 answer 和 usedText
        const [answerText, usedText] = accumulatedText.split('Used Text:').map(part => part.trim());
        const usedTextArray = usedText ? usedText.split('\n').map(text => text.trim()).filter(text => text) : [];

        // 返回格式化的响应
        controller.enqueue(new TextEncoder().encode(JSON.stringify({ text: answerText.replace('Answer:', '').trim(), usedText: usedTextArray })));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error generating response:', error);
    return new Response('Failed to generate response.', { status: 500 });
  }
}
