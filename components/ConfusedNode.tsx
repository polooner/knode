'use client';

import { useCallback, useState } from 'react';
import {
  Handle,
  MarkerType,
  NodeProps,
  Position,
  addEdge,
  useEdges,
  useNodes,
  useReactFlow,
} from 'reactflow';
import { Button } from './ui/button';
import { initialNodes } from './Flow';
import { Separator } from './ui/separator';
import { useKeyContext } from '@/app-context/key-context-provider';
import toast from 'react-hot-toast';
import { useCompletion } from 'ai/react';

type TextNodeProps = NodeProps & {
  title: string;
  description: string;
  position: { x: number; y: number };
  parent: {};
};
//@ts-expect-error
const ConfusedNode: FC<TextNodeProps> = ({ data, xPos, yPos, id }) => {
  console.log('CONFUSED NODE X, Y POS', xPos, yPos);
  const [prompt, setPrompt] = useState<string | null>();
  const { setEdges } = useReactFlow();
  const edges = useEdges();
  const nodes = useNodes();
  const [apiKey] = useKeyContext();
  const addEdgeWrapped = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [id, setEdges]
  );

  function onFinish(completion: string) {
    const node = {
      id: String(nodes.length + 1),
      type: 'confusedNode',
      data: {
        description: completion,
      },
      position: {
        x: xPos + 400,
        y: yPos,
      },
    };

    setNodes((nds) => nds.concat(node));
    addEdgeWrapped({
      id: `edge${id}-${node.id}`,
      source: String(id),
      target: String(node['id']),
    });
  }

  async function onResponse(res: Response) {
    if (res.status == 500) {
      const { message } = await res.json();
      toast.error(message);
    }
  }

  console.log(edges);
  const { setNodes } = useReactFlow();

  const { input, isLoading, handleInputChange, handleSubmit } = useCompletion({
    api: '/api/confused',
    onFinish: onFinish,
    onResponse,
    body: {
      temperature: 0,
      apiKey: apiKey,
      type: 'main',
      explanation: data.description,
      topic: data.topic,
    },
  });

  return (
    <div className='h-max border rounded-md border-black gap-2.5 block text-left w-[350px] max-w-[350px] p-5 bg-white'>
      <div className='flex flex-col gap-2.5'>
        <label className='text-[32px] block' htmlFor='text'>
          {data.topic}
        </label>
        <p>{data.description}</p>
        <Separator />
        <div className='flex flex-col w-[350px] max-w-[350px] self-center items-center'>
          <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
            <Button disabled={isLoading} key={id} type='submit'>
              Still confused
            </Button>
          </form>
        </div>
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
    </div>
  );
};

export default ConfusedNode;
