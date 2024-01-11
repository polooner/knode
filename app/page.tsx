'use client';

import 'reactflow/dist/style.css';
import Flow from '@/components/Flow';
import { ReactFlowProvider } from 'reactflow';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import ApiKeyDialog from '@/components/ApiKeyDialog';
import { useKeyContext } from '@/app-context/key-context-provider';

export default function Page() {
  const [apiKey, setApiKey] = useKeyContext();
  useEffect(() => {
    const localStorageKey = localStorage.getItem('openai_api_key');
    if (localStorageKey) {
      setApiKey(localStorageKey);
    }
    console.log('key in provider:', apiKey);
  }, []);
  const isApiKey = apiKey !== '' || apiKey !== undefined || apiKey !== null;

  return (
    <main className='w-screen h-screen'>
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </main>
  );
}
