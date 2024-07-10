'use client';

import { faSave, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, ButtonGroup, useDisclosure } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

import BulkActions from '@/app/[locale]/search/Toolbar/BulkActions/BulkActions';
import EditColumns from '@/app/[locale]/search/Toolbar/EditColumns/EditColumns';
import HiddenPopover from '@/app/[locale]/search/Toolbar/HiddenPopover/HiddenPopover';
import OrkgCsvDownload from '@/app/[locale]/search/Toolbar/OrkgCsvDownload/OrkgCsvDownload';
import SaveSearchModal from '@/app/[locale]/search/Toolbar/SaveSearchModal/SaveSearchModal';
import ShareModal from '@/app/[locale]/search/Toolbar/ShareModal/ShareModal';
import useAuth from '@/components/User/hooks/useAuth';

const CsvDownload = dynamic(
  () => import('@/app/[locale]/search/Toolbar/CsvDownload/CsvDownload'),
  {
    ssr: false,
  }
);

export default function Toolbar() {
  const t = useTranslations();

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
              <span className="hidden md:inline">
                {t('steep_sour_pelican_vent')}
              </span>
            </Button>
            <Button
              color="secondary"
              className="dark:!bg-secondary-200 min-w-12"
              startContent={<FontAwesomeIcon icon={faShare} />}
              onPress={onOpenShareModal}
            >
              <span className="hidden md:inline">
                {t('plane_sleek_skunk_grow')}
              </span>
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
