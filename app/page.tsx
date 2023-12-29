'use client';

import 'reactflow/dist/style.css';
import Flow from '@/components/Flow';

export default function Page({ ...rest }) {
  return (
    <main className='w-screen h-screen'>
      <Flow />
    </main>
  );
}
