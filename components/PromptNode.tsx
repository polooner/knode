'use client';

import { useCallback, useState } from 'react';
import {
  Handle,
  MarkerType,
  NodeProps,
  Position,
  useEdges,
  useReactFlow,
} from 'reactflow';
import { Button } from './ui/button';
import { initialNodes } from './Flow';
import { Separator } from './ui/separator';
import Spinner from './ui/spinner';

const AI_MODEL = process.env['NEXT_PUBLIC_AI_MODEL'];

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
  console.log('xpos of promptnode is:', xPos);
  console.log('ypos of promptnode is:', yPos);
  console.log('ID OF PROMPT NODE IS: ', id);
  const [prompt, setPrompt] = useState<string | null>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const { setEdges, addEdges, addNodes } = useReactFlow();
  const edges = useEdges();

  console.log(edges);
  const { setNodes } = useReactFlow();
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
                    onClick={async () => {
                      console.log(prompt);
                      setLoading(true);
                      await fetch(`api/${AI_MODEL}`, {
                        body: JSON.stringify({
                          prompt: `Explain ${topic}.`,
                          id: Number(initialNodes.length),
                        }),
                        method: 'POST',
                      }).then((res) =>
                        res.json().then((json) => {
                          //TODO: abstract this into a single function across all nodes

                          // EDGE ASSIGNING WORKS
                          const node = JSON.parse(json.data);
                          console.log(json.data);

                          const lastKey = Object.keys(node).pop() as string;

                          // ASIGNING LOCATION
                          node[lastKey].position['x'] = xPos + 400;
                          node[lastKey].position['x'] = xPos - 600;
                          console.log(node[lastKey].position['x']);

                          Object.assign(initialNodes, node);
                          setNodes(initialNodes);
                          console.log('THE DESTRUCTURED NODE:', node[lastKey]);
                          const keyOfNewEdge = Object.keys(edges).length;
                          const obj = {};
                          const newEdge = {
                            id: `edge1-${
                              node[
                                Object.keys(node)[Object.keys(node).length - 1]
                              ].id
                            }`,
                            source: id,
                            //there's 2 empty objects?
                            target:
                              node[
                                Object.keys(node)[Object.keys(node).length - 1]
                              ].id,
                            markerEnd: {
                              type: MarkerType.ArrowClosed,
                              width: 20,
                              height: 20,
                              color: '#000000',
                            },
                            // label: 'marker size and color',
                            style: {
                              strokeWidth: 2,
                              stroke: '#000000',
                            },
                          };
                          //@ts-expect-error
                          obj[keyOfNewEdge] = newEdge;

                          //TODO: fix hacky edge assigning

                          Object.assign(edges, obj);
                          setLoading(false);
                          setEdges(edges);
                          console.log('EDGES POST FETCH', edges);
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
                    onClick={() => {
                      const questionNode = {
                        id: id + 3,
                        type: 'questionNode',
                        position: { x: xPos + 400, y: 200 },
                        data: {
                          q: question.q,
                          a: question.a,
                        },
                      };
                      console.log('ID OF PROMPTNODE PARENT: ', id);
                      const keyOfNewNode = Object.keys(initialNodes).length;
                      const obj = {};
                      //@ts-expect-error
                      obj[keyOfNewNode] = questionNode;

                      Object.assign(initialNodes, obj);
                      setNodes(initialNodes);
                      console.log('this is initial nodes', initialNodes);
                      console.log(
                        'MAKING NEW EDGE WITH DATA:',
                        questionNode.id,
                        edges[edges.length - 1].target
                      );
                      const keyOfNewEdge = Object.keys(edges).length;

                      const newEdge = {
                        id: `edge1-${questionNode.id}`,
                        source: id,
                        //there's 2 empty objects?
                        target: questionNode.id,
                        markerEnd: {
                          type: MarkerType.ArrowClosed,
                          width: 20,
                          height: 20,
                          color: '#000000',
                        },
                        // label: 'marker size and color',
                        style: {
                          strokeWidth: 2,
                          stroke: '#000000',
                        },
                      };
                      //@ts-expect-error
                      obj[keyOfNewEdge] = newEdge;

                      Object.assign(edges, obj);
                      setEdges(edges);

                      console.log('REASSIGNED EDGES:', edges);
                      console.log('EDGES POST FETCH', edges);
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
                    key={item}
                    onClick={async () => {
                      console.log(prompt);
                      setLoading(true);
                      await fetch('/api/confused', {
                        body: JSON.stringify({
                          prompt: `I am confused about ${item}. in terms of ${
                            data.topic
                          }. # of nodes alive: ${initialNodes.length + 1}`,
                        }),
                        method: 'POST',
                      }).then((res) =>
                        res.json().then((json) => {
                          const node = JSON.parse(json.data);
                          console.log('ID OF PROMPTNODE PARENT: ', id);
                          node[
                            Object.keys(node)[Object.keys(node).length - 1]
                          ].position.x = xPos + 400;
                          node[
                            Object.keys(node)[Object.keys(node).length - 1]
                          ].position.y = yPos + 800;
                          Object.assign(initialNodes, node);
                          setNodes(initialNodes);
                          console.log('this is initial nodes', initialNodes);

                          const keyOfNewEdge = Object.keys(edges).length;
                          const obj = {};
                          const newEdge = {
                            id: `edge1-${
                              node[
                                Object.keys(node)[Object.keys(node).length - 1]
                              ].id
                            }`,
                            source: id,
                            //there's 2 empty objects?
                            target:
                              node[
                                Object.keys(node)[Object.keys(node).length - 1]
                              ].id,
                            markerEnd: {
                              type: MarkerType.ArrowClosed,
                              width: 20,
                              height: 20,
                              color: '#000000',
                            },
                            // label: 'marker size and color',
                            style: {
                              strokeWidth: 2,
                              stroke: '#000000',
                            },
                          };
                          //@ts-expect-error
                          obj[keyOfNewEdge] = newEdge;

                          Object.assign(edges, obj);
                          setEdges(edges);
                          setLoading(false);
                          console.log('EDGES POST FETCH', edges);

                          console.log('REASSIGNED EDGES:', edges);
                          console.log('EDGES POST FETCH', edges);
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

        {isLoading ? (
          //Replace w tailwind spinner
          <Spinner />
        ) : null}
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
