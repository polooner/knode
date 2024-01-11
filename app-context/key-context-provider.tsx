'use client';

import { PropsWithChildren, createContext, useContext, useState } from 'react';

type KeyContextType = [string, (theme: string) => void];
export const KeyContext = createContext<KeyContextType | undefined>(undefined);

export const KeyProvider = ({ children }: PropsWithChildren<{}>) => {
  const apiKey = useState('');

  return <KeyContext.Provider value={apiKey}>{children}</KeyContext.Provider>;
};

export const useKeyContext = () => {
  const context = useContext(KeyContext);

  if (!context) {
    throw new Error('useKeyContext must be used inside the KeyProvider');
  }

  return context;
};
