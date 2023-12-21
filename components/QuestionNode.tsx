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
    <div className='h-max border rounded-md border-black gap-2.5 block justify-center items-center text-left w-[350px] max-w-[350px] p-5 bg-white'>
      <div className='flex flex-col gap-2.5'>
        <label className='text-3xl block' htmlFor='text'>
          {data.q}
        </label>
        <Separator />
        <Textarea
          //@ts-expect-error
          value={answer}
          onChangeCapture={(e) => {
            setAnswer(e.currentTarget.value);
          }}
          rows={10}
          id='text'
          name='text'
          onChange={onChange}
          className=' rounded-md h-max'
        />

        <div className='flex flex-col w-[350px] gap-2.5 max-w-[350px] self-center place-items-center'>
          <Button
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
          >
            Check my answer!
          </Button>
          <Button
            key={id}
            onClick={() => {
              setShowAnswer(!isAnswer);
            }}
          >
            Show answer
          </Button>
        </div>
        {isLoading ? <Spinner /> : null}
        {isAnswer ? (
          <label className='w-full'>
            Answer:
            <hr className='w-full' />
            <p>{data.a}</p>
          </label>
        ) : null}
        {feedback ? (
          <label className='w-full'>
            Feedback
            <hr className='w-full' />
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
