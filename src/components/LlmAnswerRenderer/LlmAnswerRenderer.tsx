import { upperFirst } from 'lodash';
import { useTranslations } from 'next-intl';

function RenderItem({ text }: { text: string }) {
  const t = useTranslations();
  return text.toLowerCase() !== 'unknown' ? (
    upperFirst(text)
  ) : (
    <span className="text-secondary-700 italic">
      {t('these_curly_seahorse_foster')}
    </span>
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
