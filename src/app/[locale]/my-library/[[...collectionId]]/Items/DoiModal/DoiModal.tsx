'use client';

import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

import { importItem } from '@/app/[locale]/my-library/[[...collectionId]]/Items/actions/actions';
import Alert from '@/components/Alert/Alert';
import ButtonFormSubmit from '@/components/ButtonFormSubmit/ButtonFormSubmit';
import Modal from '@/components/NextUi/Modal/Modal';
import Textarea from '@/components/NextUi/Textarea/Textarea';

type DoiModalProps = {
  onOpenChange: () => void;
  onClose: () => void;
};

export default function DoiModal({ onOpenChange, onClose }: DoiModalProps) {
  const [doi, setDoi] = useState('');
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

  return (
    <Modal isOpen onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>{t('happy_wild_gorilla_attend')}</ModalHeader>
        <form action={formAction}>
          <ModalBody>
            {state?.error && (
              <Alert color="danger" className="whitespace-pre-line">
                {state.error}
              </Alert>
            )}

            <Textarea
              label={t('least_white_flamingo_quell')}
              name="importString"
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
              description={t('cute_civil_hound_urge')}
              required
            />
          </ModalBody>
          <ModalFooter>
            <ButtonFormSubmit color="primary" type="submit">
              {t('active_home_mole_sing')}
            </ButtonFormSubmit>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
