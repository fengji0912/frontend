import { upperFirst } from 'lodash';

function RenderItem({ text }: { text: string }) {
  return text.toLowerCase() !== 'unknown' ? (
    upperFirst(text)
  ) : (
    <span className="text-secondary-700 italic">N/A</span>
  );
}

export default function LlmAnswerRenderer({
  cell,
}: {
  cell: string | string[] | undefined;
}) {
  const cellItems = Array.isArray(cell) ? cell : [cell];

  return (
    <>
      {cellItems && cellItems.length === 1 && (
        <RenderItem text={cellItems.toString()} />
      )}

      {cellItems && cellItems.length > 1 && (
        <ul className="list-disc ps-3">
          {cellItems.map((item, index) => (
            <li
              key={index}
              className="marker:text-secondary-300 text-foreground"
            >
              <RenderItem text={item?.toString() ?? ''} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
