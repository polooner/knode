import ReactFlow, {
  Node,
  useNodesState,
  Edge,
  ConnectionLineType,
  useEdgesState,
  MarkerType,
  MiniMap,
  Controls,
  Background,
} from 'reactflow';
import PromptNode from './PromptNode';
import ChatNode from './ChatNode';
import ConfusedNode from './ConfusedNode';
import QuestionNode from './QuestionNode';
import { useCallback, useMemo } from 'react';

export const initialNodes: Node[] = [
  {
    id: '1',
    type: 'quizNode',
    data: {
      question: 'Ask me anything CS related.',
    },
    position: { x: 0, y: 0 },
  },

  // {
  //   id: '2',
  //   type: 'promptNode',
  //   //This node is mostly 400px on avg
  //   position: { x: 300, y: -250 },
  //   data: {
  //     topic: 'Linked Lists',
  //     description:
  //       'A linked list is a linear data structure where each element is a separate object. Each element (node) of a list consists of two items - the data and a reference to the next node. The last node has a reference to null. The entry point into a linked list is called the head of the list. It should be noted that head is not a separate node, but the reference to the first node. If the list is empty then the head is a null reference.',
  //     subtopics: [
  //       'Singly Linked List',
  //       'Doubly Linked List',
  //       'Circular Linked List',
  //       'Operations on Linked List',
  //     ],
  //     questions: [
  //       { q: 'What is a node in a linked list?', a: 'ik' },
  //       { q: 'What is a node in a linked ?', a: 'id' },
  //       { q: 'What is a node in a li?', a: 'i' },
  //       { q: 'What is a node in ?', a: 'k' },
  //     ],
  //     im_confused: [
  //       'Node',
  //       'Head',
  //       'Types of Linked Lists',
  //       'Operations on Linked List',
  //     ],
  //   },
  // },
  // {
  //   id: '3',
  //   type: 'questionNode',
  //   position: { x: 700, y: 0 },
  //   data: {
  //     q: 'Question?',
  //     a: 'Some answer',
  //   },
  // },
];

const initialEdges: Edge[] = [
  { id: 'edge-1', source: '1', target: '2' },
  { id: 'edge-2', source: '1', target: '2' },
  { id: 'edge-3', source: '2', target: '3' },
];

// const initialEdges: Edge[] = [];

export default function Flow({ ...rest }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  // const onConnect = useCallback(
  //   (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
  //   [setEdges]
  // );
  const nodeTypes = useMemo(
    () => ({
      promptNode: PromptNode,
      quizNode: ChatNode,
      confusedNode: ConfusedNode,
      questionNode: QuestionNode,
    }),
    []
  );
  const defaultEdgeOptions = useMemo(
    () => ({
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#000000',
      },
      // label: 'label an edge',
      style: {
        strokeWidth: 2,
        stroke: '#000000',
      },
    }),
    []
  );

  return (
    <ReactFlow
      className='w-full h-full'
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      // onEdgesChange={onEdgesChange}
      // onConnect={onConnect}
      nodeTypes={nodeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView
      {...rest}
    >
      <Controls />
      <Background color='#aaa' />
      <MiniMap />
    </ReactFlow>
  );
}
