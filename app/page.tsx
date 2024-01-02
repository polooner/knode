'use client';

import 'reactflow/dist/style.css';
import Flow from '@/components/Flow';
import { ReactFlowProvider } from 'reactflow';

export default function Page({ ...rest }) {
  return (
    <main className='w-screen h-screen'>
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </main>
  );
}
