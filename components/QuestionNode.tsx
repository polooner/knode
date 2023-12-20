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

type TextNodeProps = NodeProps & {
  title: string;
  questions: string[];
  position: { x: number; y: number };
};
//@ts-expect-error
const QuestionNode: FC<TextNodeProps> = ({ data, xPos, yPos, id }) => {
  console.log('ID OF NODE IS---------', id);
  console.log('number of nodes', initialNodes.length);
  console.log('CONFUSED NODE X, Y POS', xPos, yPos);
  const [isAnswer, setShowAnswer] = useState<boolean>();
  const [answer, setAnswer] = useState<string | null>();
  const [feedback, setFeedback] = useState<string | null>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const edges = useEdges();

  console.log(edges);

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
          {data.q}
        </label>
        <textarea
          //@ts-expect-error
          value={answer}
          onChangeCapture={(e) => {
            setAnswer(e.currentTarget.value);
          }}
          rows={10}
          style={{ borderRadius: 5, height: 'max-content' }}
          id='text'
          name='text'
          onChange={onChange}
          className='nodrag'
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '350px',
            gap: '10px',
            maxWidth: '350px',
            alignSelf: 'center',
            placeItems: 'center',
          }}
        >
          <Button
            content='Check my answer!'
            style={{ gap: 10 }}
            key={id}
            onClick={async () => {
              console.log(prompt);
              setLoading(true);
              await fetch('/api/feedback', {
                body: JSON.stringify({
                  prompt: `question: ${data.q}, student's answer: ${answer}`,
                }),
                method: 'POST',
              }).then((res) =>
                res.json().then((json) => {
                  console.log('ANSWER-----------', json.data);
                  setFeedback(json.data);
                  setLoading(false);
                })
              );
            }}
          />
          <Button
            content='Show answer'
            key={id}
            onClick={() => {
              setShowAnswer(!isAnswer);
            }}
          />
        </div>
        {isLoading ? (
          <div style={{ placeSelf: 'center' }} className='spinner'></div>
        ) : null}
        {isAnswer ? (
          <label style={{ width: '100%' }}>
            Answer:
            <hr style={{ width: '100%' }} />
            <p>{data.a}</p>
          </label>
        ) : null}
        {feedback ? (
          <label style={{ width: '100%' }}>
            Feedback
            <hr style={{ width: '100%' }} />
            <p>{feedback}</p>
          </label>
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
    </div>
  );
};

export default QuestionNode;
