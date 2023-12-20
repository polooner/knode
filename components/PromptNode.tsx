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
    <div
      style={{
        height: 'max-content',
        border: '1px solid #eee',
        borderRadius: 5,
        borderColor: 'black',
        gap: '10px',
        display: 'block',
        justifyContent: 'center',
        placeItems: 'center',
        textAlign: 'start',
        width: '350px',
        maxWidth: '350px',

        padding: 20,
        background: 'white',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label style={{ fontSize: 32, display: 'block' }} htmlFor='text'>
          {data.topic}
        </label>
        <p>{data.description}</p>
        <h3>Subtopics</h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '350px',
            maxWidth: '350px',
            alignSelf: 'center',
            placeItems: 'center',
          }}
        >
          {data.subtopics
            ? //@ts-expect-error
              data.subtopics.map((topic) => {
                return (
                  <Button
                    onClick={async () => {
                      console.log(prompt);
                      setLoading(true);
                      await fetch('/api/gpt', {
                        body: JSON.stringify({
                          prompt: `Explain ${topic}. # of nodes alive: ${initialNodes.length}`,
                        }),
                        method: 'POST',
                      }).then((res) =>
                        res.json().then((json) => {
                          // EDGE ASSIGNING WORKS
                          const node = JSON.parse(json.data);
                          console.log(json.data);

                          console.log(
                            'length of object',
                            Object.keys(node).length
                          );
                          // ASIGNING LOCATION
                          node[
                            Object.keys(node)[Object.keys(node).length - 1]
                          ].position.x = xPos + 400;
                          node[
                            Object.keys(node)[Object.keys(node).length - 1]
                          ].position.y = yPos - 600;
                          console.log(
                            'XPOS OF NODE: ',
                            node[
                              Object.keys(node)[Object.keys(node).length - 1]
                            ].position.x
                          );

                          Object.assign(initialNodes, node);
                          setNodes(initialNodes);
                          console.log('this is initial nodes', initialNodes);
                          console.log(
                            'THE DESTRUCTURED NODE:',
                            node[
                              Object.keys(node)[Object.keys(node).length - 1]
                            ]
                          );
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
                          setLoading(false);
                          setEdges(edges);
                          console.log('EDGES POST FETCH', edges);
                        })
                      );
                    }}
                    content={topic}
                    key={topic}
                  />
                );
              })
            : null}
        </div>
        <h3>Test yourself:</h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '350px',
            maxWidth: '350px',
            alignSelf: 'center',
            placeItems: 'center',
          }}
        >
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
                    content={question.q}
                    key={question.q}
                  />
                );
              })
            : null}
        </div>
        <h3>I&apos;m confused about...</h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '350px',
            maxWidth: '350px',
            alignSelf: 'center',
            placeItems: 'center',
          }}
        >
          {data.im_confused
            ? //@ts-expect-error
              data.im_confused.map((item) => {
                return (
                  <Button
                    content={item}
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
                  />
                );
              })
            : null}
        </div>
        {isLoading ? (
          <div style={{ placeSelf: 'center' }} className='spinner'></div>
        ) : null}
        {/* <textarea
          rows={10}
          style={{ borderRadius: 10, height: 'max-content' }}
          id='text'
          name='text'
          onChange={onChange}
          className='nodrag'
        /> */}
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
      <Handle
        type='source'
        position={Position.Right}
        id={id}
        isConnectable={false}
      />
    </div>
  );
};

export default PromptNode;
