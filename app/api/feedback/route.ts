import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// import { Ollama } from 'langchain/llms/ollama';

export async function POST(req: Request) {
  const data = await req.json();
  console.log('this is prompt', data.prompt);
  const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
  });

  const chatCompletion = await openai.chat.completions.create({
    temperature: 0.1,
    messages: [
      {
        role: 'system',
        content: `You are an AI Computer Science Data Structures teaching system that gives 
        feedback on students respones to given questions. You will be given a question and a student's 
        answer, give a helpful, concise feedback on what their answer should clarify better.
          `,
      },
      {
        role: 'user',
        content: data.prompt,
      },
    ],
    model: 'gpt-4',
  });
  console.log('server');
  console.log(chatCompletion.choices[0].message.content);

  return NextResponse.json(
    {
      // data: 'hey',
      data: chatCompletion.choices[0].message.content,
    },
    { status: 200 }
  );
}
