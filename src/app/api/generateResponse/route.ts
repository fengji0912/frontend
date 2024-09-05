import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const {prompt} = await request.json(); 
    const priority = (prompt.match(/priority:\s*(\w+)/))[1];
    const messages = prompt.split('\n').map((line: string) => {
      if (line.startsWith('context:')) {
        return { role: 'system', content: line.replace('context:', '').trim() };
      } else if (line.startsWith('user:')) {
        return { role: 'user', content: line.replace('user:', '').trim() };
      } else if (line.startsWith('chatbot:')) {
        return { role: 'assistant', content: line.replace('chatbot:', '').trim() };
      }else if (line.startsWith('question:')) {
        return { role: 'user', content: line.replace('question:', '').trim() };
      }
      return null;
    }).filter((msg: null) => msg !== null);

    console.log('Parsed messages:', messages,);

    let systemMessage: string;
    switch (priority) {
      case 'low':
        systemMessage = `answer the question based on the context and chat history and direct extract the used full sentences from the context as source(dont add any generated word into source, direct copy), the answer should be suitable for a non-expert, only use language that is understandable for people that are not familiar with the topic, avoid jargon, and explain concepts that require domain knowledge, 
        Format your response as: "answer: <generated answer>. source: <text excerpts>".`;
        break;
      case 'high':
        systemMessage = `answer the question based on the context and chat history and direct extract the used full sentences from the context as source(dont add any generated word into source, direct copy), the answer should be detailed, comprehensive and suitable for an expert, Include technical details and thorough explanations as needed. 
        Format your response as: "answer: <generated answer>. source: <text excerpts>".`;
        break;
      default:
        systemMessage = `answer the question based on the context and chat history and direct extract the used full sentences from the context as source(dont add any generated word into source, direct copy), the answer should be suitable for a non-expert, only use language that is understandable for people that are not familiar with the topic, avoid jargon, and explain concepts that require domain knowledge, 
        Format your response as: "answer: <generated answer>. source: <text excerpts>".`;
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
      max_tokens: 1000,
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