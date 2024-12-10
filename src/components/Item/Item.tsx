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
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { ChangeEvent, ReactElement, useContext } from 'react';
import React, { useState } from 'react';
import { useEffect } from 'react';
import slugify from 'slugify';

import ChatWindow from '@/app/[locale]/item/[id]/[[...slug]]/ChatWindow';
import { ItemType } from '@/app/[locale]/search/SavedSearches/types';
import {
  excludeItemsParser,
  listFilterParser,
} from '@/app/[locale]/search/searchParams/searchParamsParsers';
import doiIcon from '@/assets/images/doi-icon.svg';
import CiteModal from '@/components/CiteModal/CiteModal';
import ActionDropdown from '@/components/Item/ActionDropdown/ActionDropdown';
import Authors from '@/components/Item/Authors/Authors';
import { Link } from '@/components/Navigation/Navigation';
import Checkbox from '@/components/NextUi/Checkbox/Checkbox';
import SelectedItemsContext from '@/components/SelectedItemsProvider/selectedItemsContext';
import ROUTES from '@/constants/routes';
import useCslJsonDateFormatter from '@/lib/useCslJsonDateFormatter';
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
  const t = useTranslations();
  const [, setExcludeItems] = useQueryState('excludeItems', excludeItemsParser);
  const [, setCollectionItemIds] = useQueryState(
    'collectionItemIds',
    listFilterParser
  );
  const { formatDate } = useCslJsonDateFormatter();
  const { selectedItems } = useContext(SelectedItemsContext);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (isChatOpen) {
      setIsChatOpen(false);
      setTimeout(() => setIsChatOpen(true), 0);
    }
  }, [selectedItems]);

  const toggleChatWindow = () => {
    setIsChatOpen((prev) => !prev);
  };

  const {
    isOpen: isOpenCiteModal,
    onOpen: onOpenCiteModal,
    onOpenChange: onOpenChangeCiteModal,
  } = useDisclosure();

  const handleExcludeItem = () => {
    if (confirm(t('major_muddy_monkey_lend'))) {
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
            aria-label={t('fresh_trite_walrus_gaze')}
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
                aria-label="cite this article"
                className="mt-[-2px]"
              >
                <FontAwesomeIcon icon={faQuoteLeft} size="lg" />
              </Button>
              <Button
                isIconOnly
                color="secondary"
                variant="light"
                size="sm"
                onPress={toggleChatWindow}
                className="top-[7px]"
              >
                <svg
                  className="w-7 h-7 secondary inline-block cursor-pointer"
                  fill="none"
                  stroke="#BCC6CC"
                  viewBox="0 0 30 30"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8c-1.704 0-3.297-.48-4.637-1.312L3 20l1.689-3.542A7.962 7.962 0 0 1 4 12z"
                  />
                </svg>
              </Button>
              <ChatWindow
                isOpen={isChatOpen}
                onClose={toggleChatWindow}
                selectedItems={selectedItems}
              />
            </div>
            <div
              className={`lg:flex items-center text-small gap-x-2 min-h-8 ${
                type === 'collectionItem'
                  ? 'text-secondary-800'
                  : 'text-secondary'
              }`}
            >
              <Authors authors={cslData.author} />
              {formatDate(cslData.issued) && (
                <div className="whitespace-nowrap">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="opacity-75 me-2"
                  />
                  {formatDate(cslData.issued)}
                </div>
              )}
              {cslData?.DOI && (
                <div className="whitespace-nowrap flex gap-1">
                  <Image
                    src={doiIcon}
                    width="17"
                    alt={t('sea_maroon_capybara_tear')}
                  />
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
                <Tooltip content={t('safe_any_oryx_zap')}>
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
                    {t('odd_proud_shrike_value')}
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
