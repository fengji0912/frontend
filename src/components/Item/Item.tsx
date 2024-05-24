'use client';

import {
  faBookmark,
  faBuildingColumns,
  faCalendar,
  faMinus,
  faQuoteLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip, useDisclosure } from '@nextui-org/react';
import { push } from '@socialgouv/matomo-next';
import Image from 'next/image';
import Link from 'next/link';
import { useQueryState } from 'nuqs';
import { ChangeEvent, ReactElement } from 'react';
import slugify from 'slugify';

import { ItemType } from '@/app/search/SavedSearches/types';
import {
  excludeItemsParser,
  listFilterParser,
} from '@/app/search/searchParams/searchParamsParsers';
import doiIcon from '@/assets/images/doi-icon.svg';
import CiteModal from '@/components/CiteModal/CiteModal';
import ActionDropdown from '@/components/Item/ActionDropdown/ActionDropdown';
import Authors from '@/components/Item/Authors/Authors';
import Checkbox from '@/components/NextUi/Checkbox/Checkbox';
import ROUTES from '@/constants/routes';
import formatCslJsonDate from '@/lib/formatCslJsonDate';
import { IData } from '@/types/csl-json';
import { CollectionsResponse } from '@/types/pocketbase-types';

type ItemProps = {
  id: string;
  type: ItemType;
  isVisibleActions?: boolean;
  handleCheckboxClick?: ({
    e,
    cslData,
    type,
  }: {
    e: ChangeEvent<HTMLInputElement>;
    cslData: IData;
    type: ItemType;
  }) => void;
  checkboxChecked?: boolean;
  cslData: IData;
  collection?: CollectionsResponse | null;
  addToCollection?: ReactElement | null;
  linkedItemId?: string;
};

export default function Item({
  id,
  type,
  cslData,
  collection,
  isVisibleActions = false,
  handleCheckboxClick = () => {},
  checkboxChecked = false,
  addToCollection,
  linkedItemId,
}: ItemProps) {
  const [, setExcludeItems] = useQueryState('excludeItems', excludeItemsParser);
  const [, setCollectionItemIds] = useQueryState(
    'collectionItemIds',
    listFilterParser
  );

  const {
    isOpen: isOpenCiteModal,
    onOpen: onOpenCiteModal,
    onOpenChange: onOpenChangeCiteModal,
  } = useDisclosure();

  const handleExcludeItem = () => {
    if (confirm('Are you sure you want to exclude this item?')) {
      push(['trackEvent', 'exclude item']);

      if (type === 'searchItem') {
        setExcludeItems((prev) => [...prev, id]);
      } else {
        setCollectionItemIds((prev) => prev.filter((item) => item !== id));
      }
    }
  };

  return (
    <div
      className={`rounded-xl ${
        type === 'collectionItem' ? 'bg-secondary-200' : 'bg-secondary-50'
      } py-1 px-3 relative`}
      id={`item-${id}`}
    >
      {!isVisibleActions && (
        <div className="absolute top-[-6px] left-[-4px]">
          <Button
            isIconOnly
            color="secondary"
            variant="light"
            size="sm"
            onPress={handleExcludeItem}
            className={`${
              type === 'collectionItem'
                ? 'bg-secondary-300'
                : 'bg-secondary-200'
            } p-0 w-[24px] min-w-[24px] h-[24px] data-[hover=true]:bg-primary data-[hover=true]:opacity-1 data-[hover=true]:text-white`}
          >
            <FontAwesomeIcon icon={faMinus} className="" size="1x" />
          </Button>
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="flex min-w-0">
          <div className="flex items-center">
            <Checkbox
              onChange={(e) =>
                handleCheckboxClick({
                  e,
                  cslData,
                  type,
                })
              }
              value={id}
              isSelected={checkboxChecked}
            />
          </div>
          <div className="min-w-0">
            <div className="font-semibold space-x-2">
              {linkedItemId ? (
                <Link
                  href={`${ROUTES.ITEM}/${linkedItemId}/${slugify(
                    cslData?.title ?? ''
                  )}`}
                  className="me-2"
                >
                  {cslData?.title}
                </Link>
              ) : (
                <span className="text-secondary-900 dark:text-foreground">
                  {cslData?.title}
                </span>
              )}
              {collection && (
                <Link
                  href={`${ROUTES.MY_LIBRARY}/${collection.id}`}
                  className="rounded-full bg-secondary-300 text-inherit font-semibold text-sm py-[2px] px-3"
                >
                  <FontAwesomeIcon
                    icon={faBookmark}
                    className="text-primary me-2"
                  />
                  {collection.title}
                </Link>
              )}
              {addToCollection}
              <Button
                isIconOnly
                color="secondary"
                variant="light"
                size="sm"
                onPress={onOpenCiteModal}
                aria-label="Cite this article"
                className="mt-[-5px]"
              >
                <FontAwesomeIcon icon={faQuoteLeft} size="lg" />
              </Button>
            </div>
            <div
              className={`lg:flex items-center text-small gap-x-2 min-h-8 ${
                type === 'collectionItem'
                  ? 'text-secondary-800'
                  : 'text-secondary'
              }`}
            >
              <Authors authors={cslData.author} />
              {formatCslJsonDate(cslData.issued) && (
                <div className="whitespace-nowrap">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="opacity-75 me-2"
                  />
                  {formatCslJsonDate(cslData.issued)}
                </div>
              )}
              {cslData?.DOI && (
                <div className="whitespace-nowrap flex gap-1">
                  <Image src={doiIcon} width="17" alt="DOI icon" />
                  <a
                    href={`https://doi.org/${cslData?.DOI}`}
                    target="_blank"
                    className="whitespace-nowrap text-inherit !underline"
                  >
                    {cslData?.DOI}
                  </a>
                </div>
              )}
              {cslData?.custom?.['citation-count'] && (
                <Tooltip content="Citation count (estimate)">
                  <div className="whitespace-nowrap">
                    <FontAwesomeIcon
                      icon={faQuoteLeft}
                      className="opacity-75 me-1"
                    />
                    {cslData?.custom?.['citation-count']}
                  </div>
                </Tooltip>
              )}
              {(cslData?.publisher || cslData?.journalAbbreviation) && (
                <div className="whitespace-nowrap">
                  <FontAwesomeIcon
                    icon={faBuildingColumns}
                    className="opacity-75 me-1"
                  />
                  {cslData?.publisher || cslData?.journalAbbreviation}
                </div>
              )}
              {cslData?.URL && (
                <a href={cslData.URL} target="_blank" rel="noreferrer">
                  <Button
                    color="primary"
                    variant="bordered"
                    size="sm"
                    className="ms-2"
                  >
                    PDF
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
        {isVisibleActions && id && (
          <ActionDropdown itemId={id} cslData={cslData} />
        )}
      </div>
      {isOpenCiteModal && (
        <CiteModal onOpenChange={onOpenChangeCiteModal} items={[cslData]} />
      )}
    </div>
  );
}
