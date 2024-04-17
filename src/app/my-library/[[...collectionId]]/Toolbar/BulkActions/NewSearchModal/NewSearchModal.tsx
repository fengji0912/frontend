'use client';

import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

import ButtonFormSubmit from '@/components/ButtonFormSubmit/ButtonFormSubmit';
import Modal from '@/components/NextUi/Modal/Modal';
import selectedItemsContext from '@/components/SelectedItemsProvider/selectedItemsContext';
import ROUTES from '@/constants/routes';

type NewSearchModalProps = {
  onOpenChange: () => void;
};

export default function NewSearchModal({ onOpenChange }: NewSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { selectedItems } = useContext(selectedItemsContext);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(
      `${ROUTES.SEARCH}?query=${searchQuery}&collectionItemIds=${selectedItems
        .map((item) => item.id)
        .join(',')}`
    );
  };

  return (
    <Modal isOpen onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            New search starting with {selectedItems.length} items
          </ModalHeader>
          <ModalBody>
            <Textarea
              label="Search query"
              placeholder="Ask your question..."
              rows={3}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <ButtonFormSubmit color="primary" type="submit">
              Search
            </ButtonFormSubmit>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
