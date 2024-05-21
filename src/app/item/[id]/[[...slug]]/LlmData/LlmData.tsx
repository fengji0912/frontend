'use client';

import { Accordion, AccordionItem } from '@nextui-org/react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';

import LlmDataLoading from '@/app/item/[id]/[[...slug]]/LlmData/LlmDataLoading/LlmDataLoading';
import { DEFAULT_COLUMNS } from '@/app/search/Results/hooks/defaultColumns';
import LlmAnswerRenderer from '@/components/LlmAnswerRenderer/LlmAnswerRenderer';
import { getLlmExtraction } from '@/services/backend';

export default function LlmData() {
  const params = useParams<{ id: string }>();

  const { data: llmData, isLoading } = useSWR(
    params.id ? [params.id, ...DEFAULT_COLUMNS] : null,
    () =>
      getLlmExtraction({
        item_id: params.id,
        properties: DEFAULT_COLUMNS.slice(1),
      })
  );

  return (
    <>
      <h2 className="text-xl font-semibold mb-3">Extracted data</h2>
      {!isLoading &&
        llmData?.payload?.properties &&
        llmData?.payload?.properties.length > 0 && (
          <Accordion
            showDivider={false}
            isCompact
            className="px-0"
            itemClasses={{
              trigger: 'bg-secondary-50 !border-0 rounded-2xl px-4',
              title: 'semi-bold',
              content: 'px-2 !pt-0 !pb-2',
            }}
          >
            {llmData?.payload.properties.map((property) => (
              <AccordionItem
                key={property}
                aria-label="Accordion 1"
                title={property}
              >
                <LlmAnswerRenderer
                  cell={llmData?.payload?.values?.[property]?.toString()}
                />
              </AccordionItem>
            ))}
          </Accordion>
        )}
      {isLoading && <LlmDataLoading />}
    </>
  );
}