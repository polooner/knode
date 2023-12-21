'use client';

import 'reactflow/dist/style.css';
import Flow from '@/components/Flow';

export default function Page({ ...rest }) {
  return (
    <div className='w-screen h-screen'>
      <Flow />
    </div>
  );
}
