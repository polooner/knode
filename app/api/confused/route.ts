import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// import { Ollama } from 'langchain/llms/ollama';

export async function POST(req: Request) {
  const data = await req.json();
  const { prompt } = data;
  console.log('this is prompt', prompt);
  const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
  });

  const chatCompletion = await openai.chat.completions.create({
    temperature: 0.1,
    messages: [
      {
        role: 'system',
        content: `You are an AI Computer Science Data Structures teaching system that helps clarify topics for students.
        You are given a topic and its context. Clarify it well.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'gpt-4',
  });
  console.log('server');
  console.log(chatCompletion.choices[0].message.content);

  return NextResponse.json(
    {
      data: chatCompletion.choices[0].message.content,
    },
    { status: 200 }
  );
}
