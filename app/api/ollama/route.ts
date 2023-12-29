import { NextResponse } from 'next/server';
import { ChatOllama } from 'langchain/chat_models/ollama';
import { ChatPromptTemplate, MessagesPlaceholder } from 'langchain/prompts';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';

export async function POST(req: Request) {
  const data = await req.json();
  console.log('this is prompt', data.prompt);

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `Respond to only Computer Science DSA questions in JSON format. Your JSON response should include four elements: 
      "Topic", "Description", "Subtopics" (make 3), and "Questions" (an array of 3 strings), suitable for graph node creation in a 
      UI. Ensure unique string IDs for each node. Use only "promptNode" type for explanations. You will be given an ID
      to use inside the object.
      {{
      "{id}": {{
      "id": "{id}",
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
      }}
      `,
    ],
    ['human', `Explain "{input}" using the JSON schema.`],
  ]);

  const model = new ChatOllama({
    baseUrl: 'http://localhost:11434', // Default value
    model: 'mistral', // Default value
    format: 'json',
  });

  const chain = prompt.pipe(model);

  const result = await chain.invoke({
    input: 'trees',
    id: 2,
  });

  console.log(JSON.parse(result.content as string));

  // const completion = await openai.chat.completions.create({
  //   temperature: data.temperature,
  //   messages: [
  //     {
  //       role: 'system',
  // content: `You are an AI Computer Science Data Structures teaching system that responds to all questions STRICTLY
  //     in JSON format. You will be given a question on DSA concepts. Contents of JSON made by you will be used
  //     to create elements within a node of a graph that displays
  //     explanations of topics, and a user interface that allows users to follow up if they need help or want
  //     more information. There are 4 elements, "Topic", "Description", "Subtopics", "Questions": an array of strings. You will also be given a number of nodes that already
  //     exist, to be able to assign unique ids. IDs MUST BE STRINGS. MAKE SURE YOU ARE ONLY REPLYING WITH JSON AND NOT MARKDOWN
  //     These are the only node types you are allowed to pick from:
  //     "promptNode": USE FOR ALL EXPLANATIONS
  //     "confusedNode": USED WHEN CONFUSED

  //     {

  //       "{DEFINE ID BUT IN "STRING" FORM! +1 HIGHER THAN NUMBER GIVEN}": {
  //         "THE ID AGAIN": {number},
  //         "type": "promptNode",
  //         "position": { "x": 0, "y": 0 },
  //         "data": {
  //           "topic": "{Short name of topic}",
  //           "description": "{The explanation of topic}",
  //           "subtopics": [an array of strings of 5 related topics],
  //           "questions": [an array of objects of 4 related questions and answers, eg: {'q': 'Question?', 'a': 'Ans'}],
  //           "im_confused": [array of concepts mentioned in the description that they could be confused about]
  //         }
  //       }
  //     }
  //     `,
  //     },
  //     {
  //       role: 'user',
  //       content: data.prompt,
  //     },
  //   ],
  //   model: 'ollama',
  // });

  console.log('server response');
  // console.log(completion);

  return NextResponse.json(
    {
      data: result.content,
    },
    { status: 200 }
  );
}
