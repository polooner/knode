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
import { Separator } from './ui/separator';

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
  const [isLoading, setLoading] = useState<boolean>(false);
  const { setEdges } = useReactFlow();
  const edges = useEdges();
  const addEdgeWrapped = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [id, setEdges]
  );

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
    <div className='h-max border rounded-md border-black gap-2.5 block text-left w-[350px] max-w-[350px] p-5 bg-white'>
      <div className='flex flex-col gap-2.5'>
        <label className='text-[32px] block' htmlFor='text'>
          {data.topic}
        </label>
        <p>{data.description}</p>
        <Separator />
        <div className='flex flex-col w-[350px] max-w-[350px] self-center items-center'>
          <Button
            key={id}
            onClick={async () => {
              console.log(prompt);
              setLoading(true);
              await fetch(`/api/gpt`, {
                body: JSON.stringify({
                  prompt: `I am still confused about this description: ${data.description}. in the context of ${data.topic}.`,
                  temperature: 0.1,
                }),
                method: 'POST',
              }).then((res) =>
                res.json().then((json) => {
                  const node = JSON.parse(json.data);
                  setNodes((nds) => nds.concat(node));
                  addEdgeWrapped({
                    id: `edge${id}-${node.id}`,
                    source: String(id),
                    target: String(node['id']),
                  });
                  setLoading(false);
                })
              );
            }}
          >
            Still confused
          </Button>
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
