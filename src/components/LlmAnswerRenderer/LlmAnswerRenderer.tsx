import { upperFirst } from 'lodash';

export default function LlmAnswerRenderer({
  cell,
}: {
  cell: string | undefined;
}) {
  return (
    <>
      {cell && cell.toLowerCase() !== 'unknown' ? (
        upperFirst(cell)
      ) : (
        <span className="text-secondary-700 italic">N/A</span>
      )}
    </>
  );
}
