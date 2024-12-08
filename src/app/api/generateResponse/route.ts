import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    const priority = prompt.match(/priority:\s*(\w+)/)[1];
    const messages = prompt
      .split('\n')
      .map((line: string) => {
        if (line.startsWith('context:')) {
          return {
            role: 'system',
            content: line.replace('context:', '').trim(),
          };
        } else if (line.startsWith('user:')) {
          return { role: 'user', content: line.replace('user:', '').trim() };
        } else if (line.startsWith('chatbot:')) {
          return {
            role: 'assistant',
            content: line.replace('chatbot:', '').trim(),
          };
        } else if (line.startsWith('question:')) {
          return {
            role: 'user',
            content: line.replace('question:', '').trim(),
          };
        }
        return null;
      })
      .filter((msg: null) => msg !== null);

    console.log('Parsed messages:', messages);

    let systemMessage: string;
    switch (priority) {
      case 'low':
        systemMessage = `answer the question based on the context and chat history, extract the used sentences as source, the answer should be suitable for a non-expert, only use language that is understandable for people that are not familiar with the topic, avoid jargon, and explain concepts that require domain knowledge, 
        Format your response as: "<generated answer>. Source:<all the text excerpt from the paper without any line breaks, additional spaces, quotation marks or additional symbols, don't add any generated words into source, direct copy from the content, don't copy the title>".
        If the question exceeds the scope of the literature provided or is not related to the paper's topic, clearly inform the user and prompt them to adjust the question to be about the literature. For example, questions like "What is 1 + 1?" should not be answered with the literature context, and instead, ask the user to reframe their question related to the content of the paper.`;
        break;

      case 'high':
        systemMessage = `answer the question based on the context and chat history, extract the used sentences as source, the answer should be detailed, comprehensive, and suitable for an expert, Include technical details and thorough explanations as needed,
        Format your response as: "<generated answer>. Source:<all the text excerpt from the paper without any line breaks, additional spaces, quotation marks or additional symbols, don't add any generated words into source, direct copy from the content, don't copy the title>".
        If the question exceeds the scope of the literature provided or is not related to the paper's topic, clearly inform the user and prompt them to adjust the question to be about the literature. For example, questions like "What is 1 + 1?" should be addressed with a reminder that the answer should come from the literature context.`;
        break;

      default:
        systemMessage = `answer the question based on the context and chat history, extract the used sentences as source, the answer should be suitable for a non-expert, only use language that is understandable for people who are not familiar with the topic, avoid jargon, and explain concepts that require domain knowledge, 
        Format your response as: "<generated answer>. Source:<all the text excerpt from the paper without any line breaks, additional spaces, quotation marks or additional symbols, don't add any generated words into source, direct copy from the content, don't copy the title>".
        If the question exceeds the scope of the literature provided or is not related to the paper's topic, clearly inform the user and prompt them to adjust the question to be about the literature. For example, questions like "What is 1 + 1?" should be addressed with a reminder that the answer should come from the literature context.`;
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
          if (
            choices &&
            choices[0] &&
            choices[0].delta &&
            choices[0].delta.content
          ) {
            const text = choices[0].delta.content;
            accumulatedText += text;
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        console.log(accumulatedText);
        //controller.enqueue(new TextEncoder().encode(' Source: ' + sourceText));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error generating response:', error);
    return new Response('Failed to generate response.', { status: 500 });
  }
}
