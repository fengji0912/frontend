'use client';

import {
  faFile,
  faQuoteLeft,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from '@nextui-org/react';
import { IData } from 'csl-json';
import Link from 'next/link';
import { ReactElement } from 'react';

import CiteModal from '@/components/CiteModal/CiteModal';
import Popover from '@/components/NextUi/Popover/Popover';
import ShareButtons from '@/components/ShareButtons/ShareButtons';

type ActionButtonsProps = {
  item: IData;
  addToCollection: ReactElement;
  orkgButton: ReactElement;
};

export default function ActionButtons({
  item,
  addToCollection,
  orkgButton,
}: ActionButtonsProps) {
  const {
    isOpen: isOpenCiteModal,
    onOpen: onOpenCiteModal,
    onOpenChange: onOpenChangeCiteModal,
  } = useDisclosure();

  const shareUrl = typeof window !== 'undefined' ? window?.location?.href : '';

  return (
    <div className="mt-4 flex gap-x-3 gap-y-1 flex-wrap">
      {item.URL && (
        <Button
          color="primary"
          startContent={<FontAwesomeIcon icon={faFile} />}
          as={Link}
          href={item.URL}
          target="_blank"
        >
          Open PDF
        </Button>
      )}
      {addToCollection}
      <Button
        color="secondary"
        variant="bordered"
        startContent={<FontAwesomeIcon icon={faQuoteLeft} />}
        onPress={onOpenCiteModal}
      >
        Cite
      </Button>
      <Popover placement="bottom">
        <PopoverTrigger>
          <Button
            color="secondary"
            variant="bordered"
            startContent={<FontAwesomeIcon icon={faShare} />}
            onPress={onOpenCiteModal}
          >
            Share
          </Button>
        </PopoverTrigger>
        <PopoverContent className="py-2 flex gap-2 flex-row">
          <ShareButtons url={shareUrl} />
        </PopoverContent>
      </Popover>
      {orkgButton}
      {isOpenCiteModal && (
        <CiteModal onOpenChange={onOpenChangeCiteModal} items={[item]} />
      )}
    </div>
  );
}
