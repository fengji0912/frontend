import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { KeyedMutator } from 'swr';

import CellLoading from '@/app/[locale]/search/Results/Table/CellLoading/CellLoading';
import { Item } from '@/app/[locale]/search/Results/Table/TableRow/TableRow';
import LlmAnswerRenderer from '@/components/LlmAnswerRenderer/LlmAnswerRenderer';
import LoadingOverlay from '@/components/LoadingOverlay/LoadingOverlay';
import { getLlmExtraction } from '@/services/backend';
import { components } from '@/services/backend/types';

type TableCellProps = {
  isLoading: boolean;
  llmData:
    | components['schemas']['ExtractItemValuesFromPropertiesResponse']
    | undefined;
  property: string;
  item: Item;
  mutate: KeyedMutator<
    components['schemas']['ExtractItemValuesFromPropertiesResponse']
  >;
};

export default function TableCell({
  isLoading,
  llmData,
  property,
  item,
  mutate,
}: TableCellProps) {
  const [isReloading, setIsReloading] = useState(false);
  const t = useTranslations();

  const handleReloadCell = (property: string) => {
    if (!llmData) {
      return;
    }
    mutate(async () => {
      setIsReloading(true);
      try {
        const newExtraction = await getLlmExtraction({
          ...(item.type === 'searchItem' && { item_id: item.id }),
          ...(item.type === 'collectionItem' && {
            collection_item_id: item.id,
          }),
          properties: [property],
          invalidate_cache: true,
        });

        return {
          ...llmData,
          payload: {
            ...llmData?.payload,
            values: {
              ...llmData?.payload?.values,
              [property]: newExtraction.payload?.values?.[property] ?? '',
            },
          },
        };
      } catch (e) {
        console.error(e);
      } finally {
        setIsReloading(false);
      }
    });
  };

  return (
    <div className="min-w-[300px] w-full text-sm py-3 px-4 border-r-2 border-secondary-100 break-words first:pl-[40px] last:border-r-0 group">
      {isLoading ? (
        <CellLoading />
      ) : (
        <div className="relative">
          <LoadingOverlay isVisible={isReloading} />
          <LlmAnswerRenderer
            cell={
              llmData?.payload?.values?.[property] as
                | string
                | string[]
                | undefined
            }
          />
          <Tooltip content={t('sunny_loose_goose_spur')}>
            <Button
              onClick={() => handleReloadCell(property)}
              aria-label={t('fine_bland_swallow_glow')}
              isIconOnly
              color="secondary"
              variant="light"
              size="sm"
              className="absolute top-[-8px] right-[-12px] opacity-70 hidden group-hover:block z-10 bg-secondary-200 data-[hover=true]:bg-secondary-100 data-[hover=true]:opacity-100"
            >
              <FontAwesomeIcon icon={faRotateRight} size="lg" />
            </Button>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
