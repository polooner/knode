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
import { Textarea } from './ui/textarea';
import Spinner from './ui/spinner';
import { Separator } from './ui/separator';
import toast from 'react-hot-toast';
import { useKeyContext } from '@/app-context/key-context-provider';

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

  const [apiKey] = useKeyContext();
  const [message, setMessage] = useState<string | null>();
  const [prompt, setPrompt] = useState<string | null>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const { setNodes, setEdges } = useReactFlow();
  const nodes = useNodes();
  const edges = useEdges();

  const addEdgeWrapped = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [id, setEdges]
  );

  return (
    <div className='h-max border rounded-md border-black gap-2.5 block justify-center items-center text-left w-[350px] max-w-[350px] p-5 bg-white'>
      <div className='flex flex-col gap-2.5'>
        <label className='text-3xl block ' htmlFor='text'>
          {data.question}
        </label>
        <Separator />
        {/* 
          Keeping this without being a form might decrease unnecessary calls caused by pressing the "Enter" button.
          If user calls enter to insert a new line, they would call the AI unnecessary.
        */}
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
            disabled={isLoading}
            onClick={async () => {
              console.log(prompt);
              setLoading(true);
              await fetch(`/api/gpt`, {
                body: JSON.stringify({
                  prompt,
                  temperature: 0.1,
                  apiKey: apiKey,
                  type: 'main',
                }),
                method: 'POST',
              }).then((res) =>
                res
                  .json()
                  .then((json) => {
                    const node = JSON.parse(json.data);
                    node['position']['x'] = xPos + 400;
                    node['id'] = String(nodes.length + 1);
                    setNodes((nds) => nds.concat(node));
                    addEdgeWrapped({
                      id: `edge${id}-${node.id}`,
                      source: String(id),
                      target: String(node['id']),
                    });
                    setLoading(false);
                  })
                  .catch((e) => {
                    toast(e as string);
                  })
              );
              setLoading(false);
            }}
          >
            Ask
            {isLoading ? <Spinner /> : null}
          </Button>
        </div>
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
