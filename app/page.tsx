'use client';

import 'reactflow/dist/style.css';
import Flow from '@/components/Flow';

export default function Page({ ...rest }) {
  return (
    <div style={{ height: '100vh', width: '140vh' }}>
      <Flow />
    </div>
  );
}
