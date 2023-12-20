import OpenAI from 'openai';

// FREE Mixtral 8x7B Instruct API:
// https://openrouter.ai/models/fireworks/mixtral-8x7b-fw-chat?tab=api
//TODO: Implement route

import { NextResponse } from 'next/server';

// Openrouter.ai api returns the
function cleanJsonWrapper(inputText: string) {
  if (inputText.startsWith('```json') && inputText.endsWith('```')) {
    return inputText.substring(7, inputText.length - 3).trim();
  } else {
    return inputText;
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  console.log('this is prompt', data.prompt);
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
            to create elements within a node of a graph that displays
            explanations of topics, and a user interface that allows users to follow up if they need help or want
            more information. There are 4 elements, "Topic", "Description", "Subtopics", "Questions": an array of strings. You will also be given a number of nodes that already
            exist, to be able to assign unique ids. IDs MUST BE STRINGS. MAKE SURE YOU ARE ONLY REPLYING WITH JSON AND NOT MARKDOWN 
            These are the only node types you are allowed to pick from:
            "promptNode": USE FOR ALL EXPLANATIONS
            "confusedNode": USED WHEN CONFUSED

            {

              "{DEFINE ID BUT IN "STRING" FORM! +1 HIGHER THAN NUMBER GIVEN}": {
                "THE ID AGAIN": {number},
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

  console.log('this is cleaed response', cleanedResponse);

  return NextResponse.json(
    {
      data: cleanedResponse,
    },
    { status: 200 }
  );
}
