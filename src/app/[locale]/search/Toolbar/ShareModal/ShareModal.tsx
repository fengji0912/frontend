'use client';

import { ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { useQueryState, useQueryStates } from 'nuqs';
import pluralize from 'pluralize';
import { useEffect, useState, useTransition } from 'react';

import {
  columnsParser,
  excludeItemsParser,
  filterParser,
  listFilterParser,
  pagesParser,
  queryParser,
} from '@/app/[locale]/search/searchParams/searchParamsParsers';
import { createSharedLink } from '@/app/[locale]/search/Toolbar/ShareModal/actions';
import Alert from '@/components/Alert/Alert';
import Input from '@/components/NextUi/Input/Input';
import Modal from '@/components/NextUi/Modal/Modal';
import ShareButtons from '@/components/ShareButtons/ShareButtons';
import ROUTES from '@/constants/routes';

type ShareModalProps = {
  onOpenChange: () => void;
  onClose: () => void;
};

export default function ShareModal({ onOpenChange }: ShareModalProps) {
  const [sharedLinkId, setSharedLinkId] = useState('');
  const [isLoading, startTransition] = useTransition();

  const [searchData] = useQueryStates({
    query: queryParser,
    columns: columnsParser,
    pages: pagesParser,
    excludeItems: excludeItemsParser,
    filter: filterParser,
  });
  const [collectionItemIds] = useQueryState(
    'collectionItemIds',
    listFilterParser
  );

  useEffect(() => {
    startTransition(async () => {
      const sharedLink = await createSharedLink(searchData);

      if (sharedLink?.id) {
        setSharedLinkId(sharedLink.id);
      }
    });
  }, [searchData]);

  const url = !isLoading
    ? `${window.location.origin}${ROUTES.SHARE_LINK}/${sharedLinkId}`
    : 'Loading...';

  return (
    <Modal isOpen onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Share search</ModalHeader>
        <ModalBody className="mb-4">
          {collectionItemIds.length > 0 && (
            <Alert color="info">
              In total {collectionItemIds.length}{' '}
              {pluralize('items', collectionItemIds.length)} from your private
              library will be excluded from the shared search.
            </Alert>
          )}
          {!isLoading && (
            <div className="flex gap-2">
              <ShareButtons url={url} />
            </div>
          )}
          <Input
            type="text"
            value={url}
            isReadOnly
            onClick={(e) => e.currentTarget.select()}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
