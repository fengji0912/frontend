'use client';

import { faSave, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, ButtonGroup, useDisclosure } from '@nextui-org/react';
import dynamic from 'next/dynamic';

import BulkActions from '@/app/search/Toolbar/BulkActions/BulkActions';
import EditColumns from '@/app/search/Toolbar/EditColumns/EditColumns';
import HiddenPopover from '@/app/search/Toolbar/HiddenPopover/HiddenPopover';
import OrkgCsvDownload from '@/app/search/Toolbar/OrkgCsvDownload/OrkgCsvDownload';
import SaveSearchModal from '@/app/search/Toolbar/SaveSearchModal/SaveSearchModal';
import ShareModal from '@/app/search/Toolbar/ShareModal/ShareModal';
import useAuth from '@/components/User/hooks/useAuth';

const CsvDownload = dynamic(
  () => import('@/app/search/Toolbar/CsvDownload/CsvDownload'),
  {
    ssr: false,
  }
);

export default function Toolbar() {
  const {
    isOpen: isOpenSaveSearchModal,
    onOpen: onOpenSaveSearchModal,
    onClose: onCloseSaveSearchModal,
    onOpenChange: onOpenChangeSaveSearchModal,
  } = useDisclosure();
  const {
    isOpen: isOpenShareModal,
    onOpen: onOpenShareModal,
    onClose: onCloseShareModal,
    onOpenChange: onOpenChangeShareModal,
  } = useDisclosure();

  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto mt-5 flex max-w-full lg:max-w-[calc(100%-100px)]">
      <div className="w-full shrink-0 max-w-[330px] hidden lg:block" />
      <div className="md:flex space-y-1 lg:space-y-0 justify-between w-100 grow lg:ms-8 me-4">
        <div>
          <BulkActions />
        </div>

        <div>
          <ButtonGroup className="space-x-[1px]">
            <Button
              color="secondary"
              className="dark:!bg-secondary-200 min-w-12"
              startContent={<FontAwesomeIcon icon={faSave} className="ms-1" />}
              onPress={onOpenSaveSearchModal}
              isDisabled={!isAuthenticated}
            >
              <span className="hidden md:inline">Save</span>
            </Button>
            <Button
              color="secondary"
              className="dark:!bg-secondary-200 min-w-12"
              startContent={<FontAwesomeIcon icon={faShare} />}
              onPress={onOpenShareModal}
            >
              <span className="hidden md:inline">Share</span>
            </Button>
            <HiddenPopover />
            <CsvDownload />
            <OrkgCsvDownload />
          </ButtonGroup>
          <EditColumns />
        </div>
      </div>
      {isOpenSaveSearchModal && (
        <SaveSearchModal
          onOpenChange={onOpenChangeSaveSearchModal}
          onClose={onCloseSaveSearchModal}
        />
      )}
      {isOpenShareModal && (
        <ShareModal
          onOpenChange={onOpenChangeShareModal}
          onClose={onCloseShareModal}
        />
      )}
    </div>
  );
}
