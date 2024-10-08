'use client';

import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useEffect, useId, useState } from 'react';
import { useFormState } from 'react-dom';

import { importItem } from '@/app/[locale]/my-library/[[...collectionId]]/Items/actions/actions';
import Alert from '@/components/Alert/Alert';
import ButtonFormSubmit from '@/components/ButtonFormSubmit/ButtonFormSubmit';
import Modal from '@/components/NextUi/Modal/Modal';
import Textarea from '@/components/NextUi/Textarea/Textarea';

type BibtexModalProps = {
  onOpenChange: () => void;
  onClose: () => void;
};

export default function BibtexModal({
  onOpenChange,
  onClose,
}: BibtexModalProps) {
  const [bibtex, setBibtex] = useState('');
  const id = useId();
  const t = useTranslations();
  const params = useParams<{ collectionId: string }>();
  const updateWithId = importItem.bind(null, params.collectionId?.[0]);
  const [state, formAction] = useFormState(updateWithId, {
    error: '',
    success: false,
  });

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state?.success, onClose]);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) {
      return;
    }
    const text = await file?.text();
    setBibtex(text);
  };

  return (
    <Modal isOpen onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        <ModalHeader>{t('steep_drab_newt_clip')}</ModalHeader>
        <form action={formAction}>
          <ModalBody>
            {state?.error && (
              <Alert color="danger" className="whitespace-pre-line">
                {state.error}
              </Alert>
            )}
            <label htmlFor={`${id}file`}>
              {t('solid_inclusive_impala_hike')}
            </label>
            <input
              type="file"
              name="file"
              id={`${id}file`}
              onChange={handleFileUpload}
              className="mb-2"
            />
            <Textarea
              label={t('sharp_polite_crab_mend')}
              name="importString"
              minRows={10}
              maxRows={30}
              value={bibtex}
              onChange={(e) => setBibtex(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <ButtonFormSubmit color="primary" type="submit">
              {t('day_trite_moose_enjoy')}
            </ButtonFormSubmit>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
