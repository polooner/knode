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
import Button from './ui/button';
import { initialNodes } from './Flow';
import './spinner.css';

type TextNodeProps = NodeProps & {
  title: string;
  answer: string;
  position: { x: number; y: number };
  parent: {};
};
//@ts-expect-error

//TODO: Make tailwind work :(

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
    <div
      className=''
      style={{
        height: 'max-content',
        border: '1px solid #eee',
        borderRadius: 5,
        borderColor: 'black',
        padding: 16,
        gap: 10,
        background: 'white',
        justifyItems: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          justifyItems: 'center',
        }}
      >
        <label
          style={{ fontSize: 32, display: 'block', inlineSize: 200 }}
          htmlFor='text'
        >
          {data.question}
        </label>

        <textarea
          //@ts-expect-error
          value={prompt}
          onChangeCapture={(e) => {
            setPrompt(e.currentTarget.value);
          }}
          rows={5}
          style={{
            borderRadius: 5,
            height: 'max-content',
            width: '100%',
          }}
          id='text'
          name='text'
          onChange={onChange}
          className='nodrag'
        />
      </div>
      <Button
        content='Ask'
        onClick={async () => {
          console.log(prompt);
          setLoading(true);
          await fetch('/api/ollama', {
            body: JSON.stringify({ prompt: prompt, temperature: 0.1 }),
            method: 'POST',
          }).then((res) =>
            res
              .json()
              .then((json) => {
                const node = JSON.parse(json.data);
                console.log('THIS IS CLIENT JSON', json.data);

                node[Object.keys(node)[Object.keys(node).length - 1]].position[
                  'x'
                ] = xPos + 400;

                console.log(
                  'XPOS OF NODE: ',
                  node[Object.keys(node)[Object.keys(node).length - 1]]
                    .position['x']
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
                  id: `edge1-${
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
              })
              .catch((e) => {
                console.log(e);
              })
          );

          console.log('this is message', message);
          setLoading(false);
        }}
      />

      {isLoading ? (
        <div style={{ placeSelf: 'center' }} className='spinner'></div>
      ) : null}
      {message ? <p style={{ width: '200px' }}>{message}</p> : null}

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
