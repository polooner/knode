'use client';

import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

type SubtopicsContextType = {
  subtopics: string[] | [];
  setSubtopics: Dispatch<SetStateAction<string[] | []>>;
};
export const SubtopicsContext = createContext<SubtopicsContextType | undefined>(
  undefined
);

export const SubtopicsProvider = ({ children }: PropsWithChildren<{}>) => {
  const [subtopics, setSubtopics] = useState<string[] | []>([]);
  const value = {
    subtopics: subtopics,
    setSubtopics: setSubtopics,
  };

  return (
    <SubtopicsContext.Provider value={value}>
      {children}
    </SubtopicsContext.Provider>
  );
};

export const useSubtopicsContext = () => {
  const context = useContext(SubtopicsContext);

  if (!context) {
    throw new Error(
      'useSubtopicsContext must be used inside the SubtopicsProvider'
    );
  }

  return context;
};
