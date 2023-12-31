import { NextResponse } from 'next/server';

export function POST(req: Request) {
  return NextResponse.json({
    data: JSON.stringify({
      type: 'promptNode',
      position: { x: 0, y: 0 },
      data: {
        topic: 'Trees',
        description:
          'A tree is a hierarchical data structure consisting of nodes connected by edges. Each node has at most one parent and zero or more children.',
        subtopics: [
          'Binary Trees',
          'Searching Algorithms',
          'Binary Search Trees',
        ],
        questions: [
          {
            q: 'What is a tree?',
            a: 'A tree is a hierarchical data structure consisting of nodes connected by edges. Each node has at most one parent and zero or more children.',
          },
          {
            q: 'What is the difference between a binary tree and an ordinary tree?',
            a: "In a binary tree, each node has exactly two children (hence 'binary'), whereas in an ordinary tree, it can have zero or more children.",
          },
          {
            q: 'What is a BST?',
            a: 'A Binary Search Tree is a type of tree where the value of each node is greater than all values in its left subtree and less than all values in its right subtree.',
          },
        ],
        im_confused: ['Data Structures', 'Hierarchy', 'Node'],
      },
      // Non-string id WILL NOT WORK. TODO: Make a PR changing this
      //TODO: reactflow does not throw errors, ever. native react errors
      //never help.
      id: String(2),
    }),
  });
}
