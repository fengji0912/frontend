'use client';

import { ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

import Modal from '@/components/NextUi/Modal/Modal';

type FeedbackModalProps = {
  onOpenChange: () => void;
};

export default function FeedbackModal({ onOpenChange }: FeedbackModalProps) {
  const t = useTranslations();

  return (
    <Modal
      isOpen
      onOpenChange={onOpenChange}
      scrollBehavior="outside"
      size="2xl"
    >
      <ModalContent>
        <ModalHeader>{t('white_jumpy_elk_thrive')}</ModalHeader>
        <ModalBody className="flex items-center">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSfgctzavTmE-_45yznpqjFxw_girILfyA3uep93LL4o5fKKZQ/viewform?embedded=true"
            width="600"
            height="1350"
          >
            {t('watery_cuddly_stork_arrive')}
          </iframe>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
