'use client';

import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

type KeyContextType = {
  apiKey: string | null;
  setApiKey: Dispatch<SetStateAction<string | null>>;
};
export const KeyContext = createContext<KeyContextType | undefined>(undefined);

export const KeyProvider = ({ children }: PropsWithChildren<{}>) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const value = {
    apiKey: apiKey,
    setApiKey: setApiKey,
  };

  return <KeyContext.Provider value={value}>{children}</KeyContext.Provider>;
};

export const useKeyContext = () => {
  const context = useContext(KeyContext);

  if (!context) {
    throw new Error('useKeyContext must be used inside the KeyProvider');
  }

  return context;
};
