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
    temperature: data.temperature,
    messages: [
      {
        role: 'system',
        content: `You are an AI Computer Science Data Structures teaching system that responds to all questions STRICTLY 
          in JSON format. You will be given a question on DSA concepts. Contents of JSON made by you will be used 
          to create elements within a node of a graph that displays 
          explanations of topics, and a user interface that allows users to follow up if they need help or want 
          more information. There are 2 elements, "Topic", "Description". Do not
          come up with answers, that will be graded by another AI agent. You will also be given a number of nodes that already
          exist, to be able to assign unique ids. IDs MUST BE STRINGS 
          
          {
            
            "{DEFINE ID BUT IN "STRING" FORM! +1 HIGHER THAN NUMBER GIVEN}": {
              "DEFINE ID BUT IN "STRING" FORM! +1 HIGHER THAN NUMBER GIVEN": {number},
              "type": "confusedNode",
              "position": { "x": 0, "y": 0 },
              "data": {
                "topic": "{Short name of topic}",
                "description": "{The explanation of topic}",
              }
            }
          }
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
