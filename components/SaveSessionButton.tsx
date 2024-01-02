'use client';

import { Edge, Node, NodeProps, useEdges, useNodes } from 'reactflow';
import { Button } from './ui/button';

type UserPrompt = {
  id: number;
  text: string;
  node_id: NodeProps['id'];
};

type SessionObject = {
  nodes: Node<unknown>[];
  edges?: Edge<unknown>[];
  prompts?: UserPrompt[];
};

export default function SaveSessionButton() {
  //TODO: save nodes, edges, user's prompts!
  //TODO: don't save single chat node.
  const nodes = useNodes();
  const edges = useEdges();
  const prompts = function handleOnClick() {
    const obj: SessionObject = {} as SessionObject;
    obj['nodes'] = nodes;
    obj['edges'] = edges;
    obj['prompts'] = prompts;
    console.log(obj);
  };

  return <Button onClick={handleOnClick}>Save session</Button>;
}
