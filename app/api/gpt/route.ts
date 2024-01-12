import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  const data = await req.json();
  const { apiKey, mode } = data;

  switch (data.prompt) {
    case null:
    case undefined:
    case ' ':
      return NextResponse.json(
        {
          message: 'Empty input.',
        },
        { status: 500 }
      );
  }

  if (apiKey) {
    try {
      console.log('this is prompt', data.prompt);
      const openai = new OpenAI({
        apiKey: apiKey,
      });

      const chatCompletion = await openai.chat.completions.create({
        temperature: data.temperature,
        messages: [
          {
            role: 'system',
            content: `Respond to only Computer Science DSA questions in JSON format. Your JSON response should include four elements: 
      "Topic", "Description", "Subtopics" (try to make 3), and "Questions" (an array of 3 objects), suitable for graph node creation in a 
      UI. Use only "promptNode" type for explanations. If a user asks for clarification or feedback, reply only with a rephrased, better explanation of the given
      description they provide or feedback.
      {
      "type": "promptNode",
      "position": { "x": 0, "y": 0 },
      "data": {
        "topic": "{Topic name}",
        "description": "{Topic explanation}",
        "subtopics": ["Subtopic1", "Subtopic2", "Subtopic3", "Subtopic4"],
        "questions": [
          {"q": "Question1?", "a": "Answer1"},
        ],
        "im_confused": ["Concept1", "Concept2", "Concept3"]
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

      const chatResponse = chatCompletion.choices[0].message.content;
      console.log(chatResponse);
      let resultJson;

      if (chatResponse) {
        resultJson = JSON.parse(chatResponse);
        resultJson.id = String(data.id);
      }
      console.log(resultJson);

      //TODO: add status handling client-side
      return NextResponse.json(
        {
          data: JSON.stringify(resultJson),
        },
        { status: 200 }
      );
    } catch (error) {
      NextResponse.json(
        {
          message: 'Something went wrong with OpenAI',
        },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      {
        message: 'Please provide an OpenAI key.',
      },
      {
        status: 500,
      }
    );
  }
}
