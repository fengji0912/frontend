'use client';

import { Tooltip } from '@nextui-org/react';
import Link from 'next/link';
import { useQueryState } from 'nuqs';
import { useContext, useMemo } from 'react';
import reactStringReplace from 'react-string-replace';
import useSWR from 'swr';

import CellLoading from '@/app/search/Results/Table/CellLoading/CellLoading';
import { queryParser } from '@/app/search/searchParams/searchParamsParsers';
import { LinkButton } from '@/components/NextUi/LinkButton/LinkButton';
import tableDataContext from '@/components/TableDataProvider/tableDataContext';
import ROUTES from '@/constants/routes';
import formatCslJsonAuthor from '@/lib/formatCslJsonAuthor';
import formatCslJsonDate from '@/lib/formatCslJsonDate';
import { synthesize } from '@/services/backend';

export default function Synthesis() {
  const [query] = useQueryState('query', queryParser);
  const { items } = useContext(tableDataContext);

  const synthesisItems = useMemo(() => {
    const collectionItemIds = [];
    const searchItemIds = [];

    for (const item of items) {
      if (item.type === 'collectionItem') {
        collectionItemIds.push(item.id);
      } else if (item.type === 'searchItem') {
        searchItemIds.push(item.id);
      }
    }

    return { collectionItemIds, searchItemIds };
  }, [items]);

  const { data: synthesisData, isLoading } = useSWR(
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
      return <div>No citation found</div>;
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
            ? 'et al.'
            : ''}
          , {formatCslJsonDate(item.cslData?.issued)}
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

  return (
    <div className="box mb-4 !py-3 max-h-[400px] overflow-y-auto">
      <h2 className="semibold text-base m-0">Answer (based on top 5 papers)</h2>
      {!isLoading ? (
        <p>
          {reactStringReplace(
            synthesisData?.payload.synthesis,
            /\[(\d+)\]/gm,
            (match, i) => (
              <Tooltip key={i} content={getTooltipContent(match)}>
                <LinkButton
                  onClick={() => handleCitationClick(match)}
                  className="text-base"
                >
                  [{match}]
                </LinkButton>
              </Tooltip>
            )
          )}
        </p>
      ) : (
        <CellLoading />
      )}
    </div>
  );
}
