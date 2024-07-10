'use client';

import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { useContext, useMemo, useState } from 'react';
import reactStringReplace from 'react-string-replace';
import useSWR from 'swr';

import CellLoading from '@/app/[locale]/search/Results/Table/CellLoading/CellLoading';
import { queryParser } from '@/app/[locale]/search/searchParams/searchParamsParsers';
import LoadingOverlay from '@/components/LoadingOverlay/LoadingOverlay';
import { Link } from '@/components/Navigation/Navigation';
import { LinkButton } from '@/components/NextUi/LinkButton/LinkButton';
import tableDataContext from '@/components/TableDataProvider/tableDataContext';
import ROUTES from '@/constants/routes';
import formatCslJsonAuthor from '@/lib/formatCslJsonAuthor';
import useCslJsonDateFormatter from '@/lib/useCslJsonDateFormatter';
import { synthesize } from '@/services/backend';

export default function Synthesis() {
  const [isReloading, setIsReloading] = useState(false);
  const t = useTranslations();
  const [query] = useQueryState('query', queryParser);
  const { items } = useContext(tableDataContext);
  const { formatDate } = useCslJsonDateFormatter();

  const synthesisItems = useMemo(() => {
    const collectionItemIds = [];
    const searchItemIds = [];

    for (const item of items.slice(0, 5)) {
      if (item.type === 'collectionItem') {
        collectionItemIds.push(item.id);
      } else if (item.type === 'searchItem') {
        searchItemIds.push(item.id);
      }
    }

    return { collectionItemIds, searchItemIds };
  }, [items]);

  const {
    data: synthesisData,
    isLoading,
    mutate,
  } = useSWR(
    synthesisItems.collectionItemIds.length > 0 ||
      synthesisItems.searchItemIds.length > 0
      ? [
          {
            item_ids: synthesisItems.searchItemIds,
            custom_item_ids: synthesisItems.collectionItemIds,
            question: query,
          },
          'getSynthesis',
        ]
      : null,
    ([params]) => synthesize(params)
  );

  const getItem = (match: string) => {
    const mappedItem =
      synthesisData?.payload.collection_items_mapping?.[match] ??
      synthesisData?.payload.items_mapping?.[match];

    return items.find((item) => item.id === mappedItem);
  };

  const getTooltipContent = (match: string) => {
    const item = getItem(match);

    if (!item) {
      return <div>{t('low_close_wombat_clap')}</div>;
    }
    return (
      <div className="p-2">
        <p>
          {item.type === 'searchItem' ? (
            <Link href={`${ROUTES.ITEM}/${item.id}`} target="_blank">
              {item.cslData?.title}
            </Link>
          ) : (
            item.cslData?.title
          )}{' '}
          by {formatCslJsonAuthor(item.cslData?.author?.[0])}{' '}
          {item.cslData?.author && item.cslData?.author?.length > 1
            ? t('frail_small_hamster_imagine')
            : ''}
          , {formatDate(item.cslData?.issued)}
        </p>
      </div>
    );
  };

  const handleCitationClick = (match: string) => {
    const item = getItem(match);
    const itemSelector = document.querySelector(`#item-${item?.id}`);
    const headerSelector = document.querySelector(`#item-${item?.id}`);

    if (!item || !itemSelector || !headerSelector) {
      return;
    }

    window.scrollTo({
      behavior: 'smooth',
      top:
        itemSelector.getBoundingClientRect().top -
        document.body.getBoundingClientRect().top -
        headerSelector.getBoundingClientRect().height,
    });
  };

  const handleReload = () => {
    mutate(async () => {
      setIsReloading(true);
      const updatedSynthesis = await synthesize({
        item_ids: synthesisItems.searchItemIds,
        collection_item_ids: synthesisItems.collectionItemIds,
        question: query,
        invalidate_cache: true,
      });
      setIsReloading(false);
      return updatedSynthesis;
    });
  };

  return (
    <div className="box mb-4 !py-3 max-h-[400px] overflow-y-auto group relative">
      <h2 className="semibold text-base m-0">
        {t('fluffy_moving_puffin_bask')}
      </h2>
      {!isLoading ? (
        <p>
          <LoadingOverlay isVisible={isReloading} />

          {reactStringReplace(
            synthesisData?.payload.synthesis,
            /\[(\d+)\]/gm,
            (match, i) => (
              <Tooltip key={i} content={getTooltipContent(match)}>
                <LinkButton
                  color="primary"
                  variant="link"
                  onClick={() => handleCitationClick(match)}
                  className="text-base"
                >
                  [{match}]
                </LinkButton>
              </Tooltip>
            )
          )}
          <Tooltip content={t('calm_keen_marlin_bubble')}>
            <Button
              onClick={handleReload}
              aria-label={t('novel_low_chipmunk_swim')}
              isIconOnly
              color="secondary"
              variant="light"
              size="sm"
              className="absolute top-[5px] right-[15px] opacity-70 hidden group-hover:block z-10 bg-secondary-300 data-[hover=true]:bg-secondary-400 data-[hover=true]:opacity-100"
            >
              <FontAwesomeIcon icon={faRotateRight} size="lg" />
            </Button>
          </Tooltip>
        </p>
      ) : (
        <CellLoading />
      )}
    </div>
  );
}
