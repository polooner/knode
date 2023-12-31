import { NextResponse } from 'next/server';
import { ChatOllama } from 'langchain/chat_models/ollama';
import { ChatPromptTemplate, MessagesPlaceholder } from 'langchain/prompts';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';

export async function POST(req: Request) {
  const data = await req.json();
  console.log('new id:', data.id);
  console.log('this is prompt', data.prompt);

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `Respond to only Computer Science DSA questions in JSON format. Your JSON response should include four elements: 
      "Topic", "Description", "Subtopics" (make 3), and "Questions" (an array of 3 objects), suitable for graph node creation in a 
      UI. Use only "promptNode" type for explanations. 
      {{
      "type": "promptNode",
      "position": {{ "x": 0, "y": 0 }},
      "data": {{
        "topic": "{{Topic name}}",
        "description": "{{Topic explanation}}",
        "subtopics": ["Subtopic1", "Subtopic2", "Subtopic3", "Subtopic4", "Subtopic5"],
        "questions": [
          {{"q": "Question1?", "a": "Answer1"}},
        ],
        "im_confused": ["Concept1", "Concept2"]
      }}
      }}
      `,
    ],
    ['human', `Explain "{input}" using the JSON schema.`],
  ]);

  const model = new ChatOllama({
    baseUrl: 'http://localhost:11434', // Default value
    model: 'mistral', // Default value
    format: 'json',
    verbose: true,
  });

  const chain = prompt.pipe(model);
  const result = await chain.invoke({
    input: data.prompt,
  });
  //@ts-expect-error
  const resultJson = JSON.parse(result.content);

  resultJson.id = String(data.id);
  console.log(resultJson);

  console.log('server response');

  return NextResponse.json(
    {
      data: JSON.stringify(resultJson),
    },
    { status: 200 }
  );
}
