import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useContext, useTransition } from 'react';

import { deleteCollectionItems } from '@/app/[locale]/my-library/[[...collectionId]]/Items/actions/actions';
import NewSearchModal from '@/app/[locale]/my-library/[[...collectionId]]/Toolbar/BulkActions/NewSearchModal/NewSearchModal';
import CiteModal from '@/components/CiteModal/CiteModal';
import Dropdown from '@/components/NextUi/Dropdown/Dropdown';
import SelectedItemsContext from '@/components/SelectedItemsProvider/selectedItemsContext';

export default function BulkActions() {
  const { selectedItems, setSelectedItems } = useContext(SelectedItemsContext);

  const {
    isOpen: isOpenCiteModal,
    onOpen: onOpenCiteModal,
    onOpenChange: onOpenChangeCiteModal,
  } = useDisclosure();

  const {
    isOpen: isOpenNewSearchModal,
    onOpenChange: onOpenChangeNewSearchModal,
    onOpen: onOpenNewSearchModal,
  } = useDisclosure();

  const [isLoading, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete these items?')) {
      startTransition(() => {
        deleteCollectionItems(selectedItems.map((item) => item.id));
        setSelectedItems([]);
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <Dropdown isDisabled={isLoading}>
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              animate={{
                width: 'auto',
                opacity: 1,
              }}
            >
              <DropdownTrigger className="px-3 me-3">
                <Button
                  color="secondary"
                  className="dark:!bg-secondary-200"
                  startContent={
                    isLoading && (
                      <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                    )
                  }
                >
                  With {selectedItems.length} selected...
                </Button>
              </DropdownTrigger>
            </motion.div>
            <DropdownMenu aria-label="Bulk select actions">
              <DropdownItem onPress={onOpenNewSearchModal}>
                New search...
              </DropdownItem>
              <DropdownItem onPress={onOpenCiteModal}>
                Export / cite
              </DropdownItem>
              <DropdownItem onPress={handleDelete}>Delete</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </AnimatePresence>
      {isOpenCiteModal && (
        <CiteModal
          onOpenChange={onOpenChangeCiteModal}
          items={selectedItems.map((item) => item.cslData)}
        />
      )}
      {isOpenNewSearchModal && (
        <NewSearchModal onOpenChange={onOpenChangeNewSearchModal} />
      )}
    </>
  );
}
