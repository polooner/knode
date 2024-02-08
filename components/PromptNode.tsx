'use client';

import { useCallback, useState } from 'react';
import {
  Handle,
  NodeProps,
  Position,
  addEdge,
  useEdges,
  useNodes,
  useReactFlow,
} from 'reactflow';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import Spinner from './ui/spinner';
import { useKeyContext } from '@/app-context/key-context-provider';

type TextNodeProps = NodeProps & {
  title: string;
  description: string;
  subtopics: string[];
  questions: string[];
  im_confused: string[];
  position: { x: number; y: number };
  parent: {};
};
//@ts-expect-error
const PromptNode: FC<TextNodeProps> = ({ data, xPos, yPos, id }) => {
  const [prompt, setPrompt] = useState<string | null>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const { setEdges, setNodes, addEdges } = useReactFlow();
  const [apiKey] = useKeyContext();
  const edges = useEdges();
  const nodes = useNodes();

  const addEdgeWrapped = useCallback(
    (node: any) =>
      setEdges((eds) =>
        addEdge(
          {
            id: `edge${id}-${node.id}`,
            source: String(id),
            //there's 2 empty objects?
            target: String(node.id),
          },
          eds
        )
      ),
    [id, setEdges]
  );

  console.log(edges);

  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { target } = evt;
      if (target) console.log(target.value);
    },
    []
  );

  return (
    <div className='h-max border rounded-md border-black gap-2.5 block justify-center items-center text-left w-[350px] max-w-[350px] p-5 bg-white'>
      <div className='flex flex-col gap-2.5'>
        <label className='block text-3xl' htmlFor='text'>
          {data.topic}
        </label>
        <p>{data.description}</p>
        <h3>Subtopics</h3>
        <Separator />
        <div className='flex flex-col gap-2.5 w-[350px] max-w-[350px] self-center items-center'>
          {data.subtopics
            ? //@ts-expect-error
              data.subtopics.map((topic) => {
                return (
                  <Button
                    className='min-h-fit'
                    disabled={isLoading}
                    onClick={async () => {
                      console.log(prompt);
                      setLoading(true);
                      await fetch(`api/gpt`, {
                        body: JSON.stringify({
                          prompt: `Explain ${topic}.`,
                          id: Number(nodes.length),
                          apiKey,
                          type: 'subtopic',
                        }),
                        method: 'POST',
                      }).then((res) =>
                        res.json().then((json) => {
                          //TODO: abstract this into a single function across all nodes
                          console.log(json);
                          const node = json;
                          console.log(node);
                          node['position']['y'] = yPos - 600;
                          node['position']['x'] = xPos + 400;
                          node['id'] = String(nodes.length + 1);
                          setNodes((nds) => nds.concat(node));
                          addEdgeWrapped(node);
                          setLoading(false);
                          console.log('source:', id, 'target:', node['id']);
                        })
                      );
                    }}
                    key={topic}
                  >
                    {topic}
                  </Button>
                );
              })
            : null}
        </div>
        <h3>Test yourself:</h3>
        <Separator />
        <div className='flex flex-col w-[350px] max-w-[350px] self-center items-center gap-2.5'>
          {data.questions
            ? //@ts-expect-error
              data.questions.map((question) => {
                return (
                  <Button
                    className='min-h-fit'
                    disabled={isLoading}
                    onClick={() => {
                      const questionNode = {
                        id: String(nodes.length + 1),
                        type: 'questionNode',
                        position: { x: xPos + 400, y: yPos + 200 },
                        data: {
                          q: question.q,
                          a: question.a,
                        },
                      };
                      setNodes((nds) => nds.concat(questionNode));
                      addEdgeWrapped(questionNode);
                    }}
                    key={question.q}
                  >
                    {question.q}
                  </Button>
                );
              })
            : null}
        </div>
        <h3>I&apos;m confused about...</h3>
        <Separator />
        <div className='flex gap-2.5 flex-col w-[350px] max-w-[350px] self-center items-center'>
          {data.im_confused
            ? //@ts-expect-error
              data.im_confused.map((item) => {
                return (
                  <Button
                    className='min-h-fit'
                    disabled={isLoading}
                    key={item}
                    onClick={async () => {
                      console.log(prompt);
                      setLoading(true);
                      await fetch('/api/gpt', {
                        body: JSON.stringify({
                          prompt: `I am confused about ${item}. in terms of ${data.topic}.`,
                          type: 'confused',
                        }),
                        method: 'POST',
                      }).then((res) =>
                        res.json().then((json) => {
                          const rephrasedExplanation = json.data;
                          const confusedNode = {
                            id: String(nodes.length + 1),
                            type: 'confusedNode',
                            data: {
                              description: rephrasedExplanation,
                            },
                            position: { x: xPos + 400, y: yPos + 800 },
                          };

                          setNodes((nds) => nds.concat(confusedNode));
                          addEdgeWrapped(confusedNode);
                          setLoading(false);
                        })
                      );
                    }}
                  >
                    {item}
                  </Button>
                );
              })
            : null}
        </div>

        {isLoading ? <Spinner /> : null}
      </div>
      <Handle
        type='target'
        position={Position.Left}
        id={id}
        isConnectable={false}
      />
      <Handle
        type='source'
        position={Position.Right}
        id={id}
        isConnectable={false}
      />
      {/* TODO: add top and bottom handles */}
      {/* <Handle
        type='source'
        position={Position.Right}
        id={id}
        isConnectable={false}
      /> */}
    </div>
  );
};

export default PromptNode;
