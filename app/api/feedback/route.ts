import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

export async function POST(req: Request) {
  const data = await req.json();
  const { apiKey, mode, prompt, question } = data;
  const openai = new OpenAI({
    apiKey: apiKey,
  });

  const response = await openai.chat.completions.create({
    stream: true,
    temperature: 0.1,
    messages: [
      {
        role: 'system',
        content: `You are an AI Computer Science Data Structures teaching system that gives 
        feedback on students respones to given questions. You will be given a question and a student's 
        answer, give a helpful, concise feedback on their answer.`,
      },
      {
        role: 'user',
        content: `question: ${question}, answer: ${prompt}`,
      },
    ],
    model: 'gpt-4',
  });
  console.log('server');
  console.log(response);

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
