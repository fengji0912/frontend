import { Button, useDisclosure } from '@nextui-org/react';
import Image from 'next/image';

import OrkgModal from '@/app/[locale]/search/Toolbar/OrkgCsvDownload/OrkgModal/OrkgModal';
import logo from '@/assets/images/orkg-logo-bw.svg';

export default function OrkgCsvDownload() {
  const {
    isOpen: isOpenOrkgModal,
    onOpen: onOpenOrkgModal,
    onOpenChange: onOpenChangeOrkgModal,
  } = useDisclosure();

  return (
    <>
      <Button
        color="secondary"
        startContent={<Image src={logo} alt="ORKG logo" width={20} />}
        onClick={onOpenOrkgModal}
        className="dark:!bg-secondary-200 min-w-12"
      >
        <span className="hidden md:inline">ORKG</span>
      </Button>
      {isOpenOrkgModal && <OrkgModal onOpenChange={onOpenChangeOrkgModal} />}
    </>
  );
}
