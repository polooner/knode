'use client';

import { useState } from 'react';
import { Handle, NodeProps, Position, useEdges } from 'reactflow';
import { Button } from './ui/button';

import { Textarea } from './ui/textarea';
import Spinner from './ui/spinner';
import { Separator } from './ui/separator';
import { useCompletion } from 'ai/react';
import toast from 'react-hot-toast';
import { useKeyContext } from '@/app-context/key-context-provider';

type TextNodeProps = NodeProps & {
  title: string;
  questions: string[];
  position: { x: number; y: number };
};
//@ts-expect-error
const QuestionNode: FC<TextNodeProps> = ({ data, xPos, yPos, id }) => {
  const [isAnswer, setShowAnswer] = useState<boolean>();
  const [answer, setAnswer] = useState<string>('');
  const [apiKey] = useKeyContext();
  const edges = useEdges();

  console.log(edges);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { target } = e;
    if (target) {
      console.log(target.value);
      setAnswer(target.value);
    }
  };

  async function onResponse(res: Response) {
    if (res.status == 500) {
      const { message } = await res.json();
      toast.error(message);
    }
  }

  function onFinish(prompt: string, completion: string) {}

  const { isLoading, completion, handleSubmit, input, handleInputChange } =
    useCompletion({
      api: '/api/feedback',
      onFinish: onFinish,
      onResponse,
      body: {
        temperature: 0,
        apiKey: apiKey,
        type: 'main',
        question: data.q,
      },
    });

  return (
    <div className='h-max border rounded-md border-black gap-2.5 block justify-center items-center text-left w-[350px] max-w-[350px] p-5 bg-white'>
      <div className='flex flex-col gap-2.5'>
        <label className='text-3xl block' htmlFor='text'>
          {data.q}
        </label>
        <Separator />
        <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
          <Textarea
            value={input}
            rows={6}
            placeholder='Enter your response'
            id='text'
            name='text'
            onChange={handleInputChange}
            className='nodrag resize-none rounded-md h-max'
          />

          <Button className='w-full' disabled={isLoading} type='submit'>
            Check my answer!
            {isLoading ? <Spinner /> : null}
          </Button>
        </form>
        <Button
          className='w-full'
          onClick={() => {
            setShowAnswer(!isAnswer);
          }}
        >
          Show answer
        </Button>

        {isAnswer ? (
          <label className='w-full'>
            Answer:
            <hr className='w-full' />
            <p>{data.a}</p>
          </label>
        ) : null}

        <label className='w-full'>
          Feedback
          <hr className='w-full' />
          <p>{completion}</p>
        </label>
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
