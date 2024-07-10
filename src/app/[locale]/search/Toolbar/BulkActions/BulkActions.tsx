import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from '@nextui-org/react';
import { push } from '@socialgouv/matomo-next';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { useContext, useTransition } from 'react';

import {
  excludeItemsParser,
  listFilterParser,
} from '@/app/[locale]/search/searchParams/searchParamsParsers';
import CiteModal from '@/components/CiteModal/CiteModal';
import Dropdown from '@/components/NextUi/Dropdown/Dropdown';
import SelectedItemsContext from '@/components/SelectedItemsProvider/selectedItemsContext';

export default function BulkActions() {
  const t = useTranslations();

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
    if (confirm(t('raw_fair_eel_pride'))) {
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
        push(['trackEvent', 'exclude item']);
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
                  {t('mushy_aloof_pigeon_belong', {
                    itemNumber: selectedItems.length,
                  })}
                </Button>
              </DropdownTrigger>
            </motion.div>
            <DropdownMenu aria-label="Bulk select actions">
              <DropdownItem onPress={onOpenCiteModal}>
                {t('that_active_larva_yell')}
              </DropdownItem>
              <DropdownItem onPress={handleDelete}>
                {t('major_patchy_fish_race')}
              </DropdownItem>
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
