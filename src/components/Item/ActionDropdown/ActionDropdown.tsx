import {
  faEllipsisH,
  faPen,
  faSpinner,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useContext, useTransition } from 'react';

import { deleteCollectionItem } from '@/app/[locale]/my-library/[[...collectionId]]/Items/actions/actions';
import ItemsModal from '@/app/[locale]/my-library/[[...collectionId]]/Items/ItemsModal/ItemsModal';
import Dropdown from '@/components/NextUi/Dropdown/Dropdown';
import selectedItemsContext from '@/components/SelectedItemsProvider/selectedItemsContext';
import { IData } from '@/types/csl-json';

export default function ActionDropdown({
  itemId,
  cslData,
}: {
  itemId: string;
  cslData: IData;
}) {
  const t = useTranslations();

  const {
    isOpen: isOpenAddItemsModal,
    onOpenChange: onOpenChangeAddItemsModal,
    onOpen: onOpenAddItemsModal,
    onClose: onCloseAddItemsModal,
  } = useDisclosure();

  const [isLoading, startTransition] = useTransition();
  const { selectedItems, setSelectedItems } = useContext(selectedItemsContext);

  const handleDelete = async () => {
    if (confirm(t('fit_just_alpaca_radiate'))) {
      startTransition(() => {
        deleteCollectionItem(itemId);
        // remove the item from the batch selection if it is added
        if (selectedItems.find((item) => item.id === itemId)) {
          setSelectedItems((items) =>
            items.filter((item) => item.id !== itemId)
          );
        }
      });
    }
  };

  return (
    <>
      <Dropdown isDisabled={isLoading}>
        <DropdownTrigger>
          <Button
            isIconOnly
            color="secondary"
            variant="light"
            size="sm"
            aria-label={t('this_slow_mule_praise')}
          >
            {!isLoading ? (
              <FontAwesomeIcon
                className="text-secondary text-base"
                icon={faEllipsisH}
              />
            ) : (
              <FontAwesomeIcon
                className="text-secondary text-base"
                icon={faSpinner}
                spin
              />
            )}
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem onPress={onOpenAddItemsModal}>
            <FontAwesomeIcon icon={faPen} className="text-secondary me-2" />
            {t('every_warm_javelina_pause')}
          </DropdownItem>
          <DropdownItem onPress={handleDelete}>
            <FontAwesomeIcon icon={faTrash} className="text-secondary me-2" />
            {t('main_wise_worm_leap')}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {isOpenAddItemsModal && (
        <ItemsModal
          onOpenChange={onOpenChangeAddItemsModal}
          onClose={onCloseAddItemsModal}
          itemId={itemId}
          cslData={cslData}
        />
      )}
    </>
  );
}
