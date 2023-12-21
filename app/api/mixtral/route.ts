import OpenAI from 'openai';

// FREE Mixtral 8x7B Instruct API:
// https://openrouter.ai/models/fireworks/mixtral-8x7b-fw-chat?tab=api
//TODO: Implement route

import { NextResponse } from 'next/server';

// Openrouter.ai api returns the
function cleanJsonWrapper(inputText: string) {
  //FIXME: the safe way does not work, if openrouter fixes the json string return this will break
  // if (inputText.startsWith('```json') && inputText.endsWith('```')) {
  //   return inputText.substring(7, inputText.length - 3).trim();
  // } else {
  //   return inputText;
  // }
  return inputText.substring(7, inputText.length - 3).trim();
}

export async function POST(req: Request) {
  const data = await req.json();
  console.log('this is prompt', data.prompt);
  console.log('id received:', data.id);
  const id_plus_1 = Number(data.id) + 1;
  console.log(id_plus_1);

  const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env['OPENROUTER_API_KEY'],
    //   defaultHeaders: {
    //     'HTTP-Referer': $YOUR_SITE_URL, // Optional, for including your app on openrouter.ai rankings.
    //     'X-Title': $YOUR_SITE_NAME, // Optional. Shows in rankings on openrouter.ai.
    //   },
    // dangerouslyAllowBrowser: true,
  });

  const completion = await openai.chat.completions.create({
    temperature: data.temperature,
    messages: [
      {
        role: 'system',
        content: `You are an AI Computer Science Data Structures teaching system that responds to all questions STRICTLY
            in JSON format. You will be given a question on DSA concepts. Contents of JSON made by you will be used
            to create elements within a node of a graph that displays explanations of topics, and a user interface that 
            allows users to follow up if they need help or want more information. There are 4 elements, "Topic", "Description", 
            "Subtopics", "Questions": an array of strings. MAKE SURE YOU ARE ONLY REPLYING WITH JSON AND NOT MARKDOWN, DO NOT ESCAPE CHARACTERS
            This is the only node type you are allowed to reply with:
            "promptNode"

            {
              "${id_plus_1}": {
                "id": "${id_plus_1}",
                "type": "promptNode",
                "position": { "x": 0, "y": 0 },
                "data": {
                  "topic": "{Short name of topic}",
                  "description": "{The explanation of topic}",
                  "subtopics": [an array of strings of 5 related topics],
                  "questions": [an array of objects of 4 related questions and answers, eg: {'q': 'Question?', 'a': 'Ans'}],
                  "im_confused": [array of concepts mentioned in the description that they could be confused about]
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
    model: 'mistralai/mixtral-8x7b-instruct',
  });

  console.log('server');
  console.log(completion.choices[0].message.content);

  const cleanedResponse = cleanJsonWrapper(
    completion.choices[0].message.content as string
  );

  console.log('normalized response', cleanedResponse);

  return NextResponse.json(
    {
      data: completion.choices[0].message.content,
    },
    { status: 200 }
  );
}
