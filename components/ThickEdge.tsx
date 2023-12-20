import { BaseEdge, getStraightPath } from 'reactflow';

//@ts-expect-error
export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge style={{ color: 'red' }} id={id} path={edgePath} />
    </>
  );
}
