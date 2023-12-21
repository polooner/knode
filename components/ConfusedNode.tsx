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

// Clean up bad state controls

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

        <div className='flex flex-col w-[350px] max-w-[350px] self-center items-center'>
          <Button
            key={id}
            onClick={async () => {
              console.log(prompt);
              setLoading(true);
              await fetch('/api/confused', {
                body: JSON.stringify({
                  prompt: `I am still confused about this description: ${data.description}. in the context of ${data.topic}.  # of nodes alive: ${initialNodes.length}`,
                  temperature: 0.1,
                }),
                method: 'POST',
              }).then((res) =>
                res.json().then((json) => {
                  // EDGE ASSIGNING WORKS
                  const node = JSON.parse(json.data);
                  console.log(json.data);

                  console.log('length of object', Object.keys(node).length);
                  // ASIGNING LOCATION
                  node[
                    Object.keys(node)[Object.keys(node).length - 1]
                  ].position.x = xPos + 400;
                  node[
                    Object.keys(node)[Object.keys(node).length - 1]
                  ].position.y = yPos + 150;
                  console.log(
                    'XPOS OF NODE: ',
                    node[Object.keys(node)[Object.keys(node).length - 1]]
                      .position.x
                  );

                  Object.assign(initialNodes, node);
                  setNodes(initialNodes);
                  console.log('this is initial nodes', initialNodes);
                  console.log(
                    'THE DESTRUCTURED NODE:',
                    node[Object.keys(node)[Object.keys(node).length - 1]]
                  );
                  const keyOfNewEdge = Object.keys(edges).length;
                  const obj = {};
                  const newEdge = {
                    id: `edge-${id}-${
                      node[Object.keys(node)[Object.keys(node).length - 1]].id
                    }`,
                    source: id,
                    //there's 2 empty objects?
                    target:
                      node[Object.keys(node)[Object.keys(node).length - 1]].id,
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
                  console.log('EDGES POST FETCH', edges);
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
