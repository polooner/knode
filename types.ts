import { Edge, Node, NodeProps } from 'reactflow';

export type UserPrompt = {
  id: number;
  text: string;
  node_id: NodeProps['id'];
};

export type SessionObject = {
  nodes: Node<unknown>[];
  edges?: Edge<unknown>[];
  prompts?: UserPrompt[];
};
