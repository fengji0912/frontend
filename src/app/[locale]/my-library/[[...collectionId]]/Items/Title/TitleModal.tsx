'use client';

import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useParams } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { useFormState } from 'react-dom';
import { AsyncPaginate } from 'react-select-async-paginate';

import {
  createCollectionItemByTitle,
  titleLookup,
} from '@/app/[locale]/my-library/[[...collectionId]]/Items/actions/actions';
import Alert from '@/components/Alert/Alert';
import ButtonFormSubmit from '@/components/ButtonFormSubmit/ButtonFormSubmit';
import Modal from '@/components/NextUi/Modal/Modal';

export type OptionType = {
  value: string;
  label: string | undefined;
};

type TitleModalProps = {
  onOpenChange: () => void;
  onClose: () => void;
};

export default function TitleModal({ onOpenChange, onClose }: TitleModalProps) {
  const [title, setTitle] = useState<OptionType | null>(null);
  const id = useId();
  const params = useParams<{ collectionId: string }>();
  const createWithId = createCollectionItemByTitle.bind(
    null,
    params.collectionId?.[0]
  );
  const [state, formAction] = useFormState(createWithId, {
    error: '',
    success: false,
  });

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state?.success, onClose]);

  return (
    <Modal
      isOpen
      onOpenChange={onOpenChange}
      scrollBehavior="outside"
      size="lg"
    >
      <ModalContent>
        <ModalHeader>Lookup by title</ModalHeader>
        <form action={formAction}>
          <ModalBody>
            {state?.error && (
              <Alert color="danger" className="whitespace-pre-line">
                {state.error}
              </Alert>
            )}

            <label htmlFor={`${id}doi`}>Title</label>
            <AsyncPaginate
              name="linkedItemId"
              loadOptions={titleLookup}
              debounceTimeout={300}
              loadOptionsOnMenuOpen={false}
              openMenuOnClick={false}
              required
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              value={title}
              onChange={setTitle}
              placeholder="Start typing to search by title"
              additional={{
                page: 1,
              }}
            />
          </ModalBody>
          <ModalFooter>
            <ButtonFormSubmit color="primary" type="submit">
              Import
            </ButtonFormSubmit>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}