'use client';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';

import BibtexModal from '@/app/[locale]/my-library/[[...collectionId]]/Items/BibtexModal/BibtexModal';
import DoiModal from '@/app/[locale]/my-library/[[...collectionId]]/Items/DoiModal/DoiModal';
import ItemsModal from '@/app/[locale]/my-library/[[...collectionId]]/Items/ItemsModal/ItemsModal';
import TitleModal from '@/app/[locale]/my-library/[[...collectionId]]/Items/Title/TitleModal';
import BulkActions from '@/app/[locale]/my-library/[[...collectionId]]/Toolbar/BulkActions/BulkActions';
import Sort from '@/app/[locale]/my-library/[[...collectionId]]/Toolbar/Sort/Sort';
import Dropdown from '@/components/NextUi/Dropdown/Dropdown';

export default function Toolbar() {
  const t = useTranslations();

  const {
    isOpen: isOpenAddItemsModal,
    onOpenChange: onOpenChangeAddItemsModal,
    onOpen: onOpenAddItemsModal,
    onClose: onCloseAddItemsModal,
  } = useDisclosure();

  const {
    isOpen: isOpenBibtexModal,
    onOpenChange: onOpenChangeBibtexModal,
    onOpen: onOpenBibtexModal,
    onClose: onCloseBibtexModal,
  } = useDisclosure();

  const {
    isOpen: isOpenDoiModal,
    onOpenChange: onOpenChangeDoiModal,
    onOpen: onOpenDoiModal,
    onClose: onCloseDoiModal,
  } = useDisclosure();

  const {
    isOpen: isOpenTitleModal,
    onOpenChange: onOpenChangeTitleModal,
    onOpen: onOpenTitleModal,
    onClose: onCloseTitleModal,
  } = useDisclosure();

  return (
    <div className="flex mt-5 gap-3">
      <div className="hidden md:block max-w-72 w-full shrink-0" />
      <div className="grow flex justify-between px-2">
        <div className="flex md:ms-2 grow w-full">
          <BulkActions />
          <Sort />
        </div>
        <div>
          <Dropdown>
            <DropdownTrigger>
              <Button
                color="primary"
                startContent={
                  <FontAwesomeIcon icon={faPlus} className="me-1 text-white" />
                }
              >
                {t('true_extra_buzzard_relish')}
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Add item actions">
              <DropdownItem onPress={onOpenBibtexModal}>
                {t('polite_actual_sparrow_feast')}
              </DropdownItem>
              <DropdownItem onPress={onOpenTitleModal}>
                {t('minor_upper_llama_exhale')}
              </DropdownItem>
              <DropdownItem onPress={onOpenDoiModal}>
                {t('icy_white_gibbon_aid')}
              </DropdownItem>
              <DropdownItem onPress={onOpenAddItemsModal}>
                {t('honest_active_cougar_hint')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      {isOpenAddItemsModal && (
        <ItemsModal
          onOpenChange={onOpenChangeAddItemsModal}
          onClose={onCloseAddItemsModal}
        />
      )}
      {isOpenBibtexModal && (
        <BibtexModal
          onOpenChange={onOpenChangeBibtexModal}
          onClose={onCloseBibtexModal}
        />
      )}
      {isOpenDoiModal && (
        <DoiModal
          onOpenChange={onOpenChangeDoiModal}
          onClose={onCloseDoiModal}
        />
      )}
      {isOpenTitleModal && (
        <TitleModal
          onOpenChange={onOpenChangeTitleModal}
          onClose={onCloseTitleModal}
        />
      )}
    </div>
  );
}
