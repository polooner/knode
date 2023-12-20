import { ComponentProps } from 'react';

export interface ButtonProps extends React.ComponentProps<'button'> {
  content: string;
}

export default function Button(props: ButtonProps) {
  return (
    <button
      onClick={props.onClick}
      style={{
        padding: 4,
        placeSelf: 'center',
        borderRadius: 5,
        width: '90%',
        height: 'max-content',
        alignSelf: 'center',
        borderColor: 'black',
      }}
      className='p-4 rounded-md bg-black text-md font-bold text-white'
    >
      {props.content}
    </button>
  );
}
