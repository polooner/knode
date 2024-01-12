import { NextResponse } from 'next/server';

//TODO: dynamic id's

export async function POST(req: Request) {
  const { type, prompt } = await req.json();

  switch (type) {
    case 'main':
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
          //TODO: reactflow does not throw errors, ever.
          id: String(2),
        }),
      });
    case 'subtopic':
      return NextResponse.json({
        data: JSON.stringify({
          type: 'promptNode',
          position: { x: 0, y: 0 },
          data: {
            topic: 'Trees',
            description: 'An array.',
            subtopics: ['2D arrays', '3D arrays', 'Binary Search Trees'],
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
          //TODO: reactflow does not throw errors, ever.
          id: String(4),
        }),
      });
    case 'confused':
      return NextResponse.json({
        data: 'This is a test better explanation coming for a confusedNode',
      });
    case 'grade_answer':
      return NextResponse.json({
        data: 'This is a test answer grade coming for a question in a promptNode',
      });
  }
}
