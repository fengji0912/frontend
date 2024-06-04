'use client';

import { ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';

import Modal from '@/components/NextUi/Modal/Modal';

type FeedbackModalProps = {
  onOpenChange: () => void;
};

export default function FeedbackModal({ onOpenChange }: FeedbackModalProps) {
  return (
    <Modal
      isOpen
      onOpenChange={onOpenChange}
      scrollBehavior="outside"
      size="2xl"
    >
      <ModalContent>
        <ModalHeader>Provide feedback</ModalHeader>
        <ModalBody className="flex items-center">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSfgctzavTmE-_45yznpqjFxw_girILfyA3uep93LL4o5fKKZQ/viewform?embedded=true"
            width="600"
            height="1350"
          >
            Loading…
          </iframe>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
