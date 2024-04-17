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
import { useQueryState } from 'nuqs';
import { useContext, useTransition } from 'react';

import {
  excludeItemsParser,
  listFilterParser,
} from '@/app/search/searchParams/searchParamsParsers';
import CiteModal from '@/components/CiteModal/CiteModal';
import Dropdown from '@/components/NextUi/Dropdown/Dropdown';
import SelectedItemsContext from '@/components/SelectedItemsProvider/selectedItemsContext';

export default function BulkActions() {
  const { selectedItems, setSelectedItems } = useContext(SelectedItemsContext);

  const [excludeItems, setExcludeItems] = useQueryState(
    'excludeItems',
    excludeItemsParser
  );
  const [collectionItemIds, setCollectionItemIds] = useQueryState(
    'collectionItemIds',
    listFilterParser
  );

  const {
    isOpen: isOpenCiteModal,
    onOpen: onOpenCiteModal,
    onOpenChange: onOpenChangeCiteModal,
  } = useDisclosure();

  const [isLoading, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('Are you sure you want to exclude this item?')) {
      startTransition(() => {
        const newExcludeItems = [
          ...excludeItems,
          ...selectedItems
            .filter((item) => item.type === 'searchItem')
            .map((item) => item.id),
        ];
        const newCollectionItemIds = collectionItemIds.filter(
          (id) => !selectedItems.find((item) => item.id === id)
        );

        setCollectionItemIds(newCollectionItemIds);
        setExcludeItems(newExcludeItems);
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
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              animate={{
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
              <DropdownItem onPress={onOpenCiteModal}>
                Export / cite
              </DropdownItem>
              <DropdownItem onPress={handleDelete}>Hide</DropdownItem>
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
    </>
  );
}
