'use client';

import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useQueryStates } from 'nuqs';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';

import { createSavedSearch } from '@/app/[locale]/search/SavedSearches/actions';
import {
  columnsParser,
  excludeItemsParser,
  filterParser,
  listFilterParser,
  pagesParser,
  queryParser,
} from '@/app/[locale]/search/searchParams/searchParamsParsers';
import Alert from '@/components/Alert/Alert';
import ButtonFormSubmit from '@/components/ButtonFormSubmit/ButtonFormSubmit';
import Input from '@/components/NextUi/Input/Input';
import Modal from '@/components/NextUi/Modal/Modal';

type SaveSearchModalProps = {
  onOpenChange: () => void;
  onClose: () => void;
};

export default function SaveSearchModal({
  onOpenChange,
  onClose,
}: SaveSearchModalProps) {
  const t = useTranslations();
  const [searchData] = useQueryStates({
    query: queryParser,
    columns: columnsParser,
    pages: pagesParser,
    excludeItems: excludeItemsParser,
    collectionItemIds: listFilterParser,
    filter: filterParser,
  });
  const createSavedSearchBound = createSavedSearch.bind(null, searchData);
  const [state, formAction] = useFormState(createSavedSearchBound, {
    error: '',
    success: false,
  });

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state?.success, onClose]);

  return (
    <Modal isOpen onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>{t('full_gaudy_bear_jest')}</ModalHeader>
        <form action={formAction}>
          <ModalBody>
            {state?.error && (
              <Alert color="danger" className="whitespace-pre-line">
                {state.error}
              </Alert>
            )}
            <Input
              type="text"
              label={t('simple_inclusive_penguin_hack')}
              name="title"
              defaultValue={searchData.query}
            />
          </ModalBody>
          <ModalFooter>
            <ButtonFormSubmit color="primary" type="submit">
              {t('deft_that_starfish_aid')}
            </ButtonFormSubmit>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
