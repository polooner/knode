'use client';

import { useCallback, useState } from 'react';
import {
  Handle,
  MarkerType,
  NodeProps,
  Position,
  addEdge,
  useEdges,
  useReactFlow,
} from 'reactflow';
import { Button } from './ui/button';
import { initialNodes } from './Flow';
import { Textarea } from './ui/textarea';
import Spinner from './ui/spinner';
import { Separator } from './ui/separator';
import toast from 'react-hot-toast';

type TextNodeProps = NodeProps & {
  title: string;
  answer: string;
  position: { x: number; y: number };
  parent: {};
};
//@ts-expect-error

const ChatNode: FC<TextNodeProps> = ({ data, xPos, yPos, id }) => {
  console.log(id);
  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { target } = evt;
      if (target) console.log(target.value);
    },
    []
  );

  const [message, setMessage] = useState<string | null>();
  const [prompt, setPrompt] = useState<string | null>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const { setNodes, setEdges } = useReactFlow();
  const edges = useEdges();
  console.log(edges);

  return (
    <div className='h-max border rounded-md border-black gap-2.5 block justify-center items-center text-left w-[350px] max-w-[350px] p-5 bg-white'>
      <div className='flex flex-col gap-2.5'>
        <label className='text-3xl block ' htmlFor='text'>
          {data.question}
        </label>
        <Separator />

        <Textarea
          value={prompt as any}
          onChangeCapture={(e) => {
            setPrompt(e.currentTarget.value);
          }}
          rows={5}
          className='nodrag rounded-md h-max'
          id='text'
          name='text'
          onChange={onChange}
        />

        <div className='flex flex-col w-[350px] max-w-[350px] self-center items-center'>
          <Button
            onClick={async () => {
              console.log(prompt);
              setLoading(true);

              await fetch('/api/mixtral', {
                body: JSON.stringify({
                  prompt: prompt,
                  temperature: 0.1,
                  id,
                }),
                method: 'POST',
              }).then((res) =>
                res
                  .json()
                  .then((json) => {
                    const node = JSON.parse(json.data);

                    console.log('THIS IS CLIENT JSON', json.data);

                    const lastKey = Object.keys(node).pop() as string;
                    node[lastKey].position['x'] = xPos + 400;

                    console.log('XPOS OF NODE: ', node[lastKey].position['x']);

                    setNodes((nds) => nds.concat(node[lastKey]));
                    console.log('THE DESTRUCTURED NODE:', node[lastKey]);
                    console.log('new node id:', node[lastKey]['id']);

                    setEdges((eds) =>
                      addEdge(
                        {
                          id: `edge1-${node[lastKey]['id']}`,
                          source: String(id),
                          //there's 2 empty objects?
                          target: String(node[lastKey]['id']),
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
                        },
                        eds
                      )
                    );
                    const keyOfNewEdge = Object.keys(edges).length;
                    const obj = {};
                    const newEdge = {
                      id: `edge1-${node[lastKey].id}`,
                      source: id,
                      //there's 2 empty objects?
                      target: node[lastKey].id,
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
                    console.log('edges after setEdges', edges);
                  })
                  .catch((e) => {
                    toast(e as string);
                  })
              );

              setLoading(false);
            }}
          >
            Ask
          </Button>
        </div>
      </div>

      <div className='flex justify-center'>
        {isLoading ? <Spinner /> : null}
      </div>
      {message ? <p className=' w-[200px]'>{message}</p> : null}

      <Handle
        type='source'
        position={Position.Right}
        id='a'
        isConnectable={false}
      />
    </div>
  );
};

export default ChatNode;
