import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt, priority } = await request.json(); 
    const messages = prompt.split('\n').map((line: string) => {
      if (line.startsWith('context:')) {
        return { role: 'system', content: line.replace('context:', '').trim() };
      } else if (line.startsWith('user:')) {
        return { role: 'user', content: line.replace('user:', '').trim() };
      } else if (line.startsWith('bot:')) {
        return { role: 'chatbot', content: line.replace('chatbot:', '').trim() };
      }
      return null;
    }).filter((msg: null) => msg !== null);

    console.log('Parsed messages:', messages);

    let systemMessage: string;
    switch (priority) {
      case 'low':
        systemMessage = `Provide a simple and easy-to-understand response suitable for a non-expert. Avoid technical jargon and keep explanations brief. Format your response as: "answer: <generated answer>. source: <text excerpts>".`;
        break;
      case 'mid':
        systemMessage = `Provide a moderately detailed response suitable for someone with basic knowledge in the field. Include explanations where necessary, but avoid overly technical details. Format your response as: "answer: <generated answer>. source: <text excerpts>".`;
        break;
      case 'high':
        systemMessage = `Provide a detailed and comprehensive response suitable for an expert. Include technical details and thorough explanations as needed. Format your response as: "answer: <generated answer>. source: <text excerpts>".`;
        break;
      default:
        systemMessage = `Provide a response with appropriate detail based on the given context. Format your response as: "answer: <generated answer>. source: <text excerpts>".`;
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
      stream: true, 
    });

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
        const [answer, source] = accumulatedText.split('source:').map(part => part.trim());
        const sourceArray = source ? source.split('\n').map(text => text.trim()).filter(text => text) : [];
        controller.enqueue(new TextEncoder().encode(JSON.stringify({ answer: answer.replace('answer:', '').trim(), source: sourceArray })));
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
