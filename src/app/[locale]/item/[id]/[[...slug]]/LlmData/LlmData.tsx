'use client';

import { Accordion, AccordionItem } from '@nextui-org/react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';

import LlmDataLoading from '@/app/[locale]/item/[id]/[[...slug]]/LlmData/LlmDataLoading/LlmDataLoading';
import { DEFAULT_COLUMNS } from '@/app/[locale]/search/Results/hooks/defaultColumns';
import LlmAnswerRenderer from '@/components/LlmAnswerRenderer/LlmAnswerRenderer';
import useColumnTranslator from '@/lib/useColumnTranslator';
import { getLlmExtraction } from '@/services/backend';

export default function LlmData() {
  const params = useParams<{ id: string }>();
  const t = useTranslations();
  const { translateColumn } = useColumnTranslator();

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
      <h2 className="text-xl font-semibold mb-3">
        {t('mellow_witty_otter_forgive')}
      </h2>
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
                aria-label={`${t('calm_crisp_puffin_spark')} ${translateColumn(
                  property
                )}`}
                title={translateColumn(property)}
                isDisabled={
                  Array.isArray(llmData?.payload?.values?.[property]) &&
                  (
                    llmData?.payload?.values?.[property] as string[]
                  )?.[0]?.toLowerCase() === 'unknown'
                }
              >
                <LlmAnswerRenderer
                  cell={
                    llmData?.payload?.values?.[property] as
                      | string[]
                      | string
                      | undefined // TODO: remove when backend updates type
                  }
                />
              </AccordionItem>
            ))}
          </Accordion>
        )}
      {isLoading && <LlmDataLoading />}
    </>
  );
}
