'use client';

import {
  faCaretDown,
  faExternalLink,
  faFile,
  faQuoteLeft,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  ButtonGroup,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from '@nextui-org/react';
import { ReactElement } from 'react';

import CiteModal from '@/components/CiteModal/CiteModal';
import { Link } from '@/components/Navigation/Navigation';
import Dropdown from '@/components/NextUi/Dropdown/Dropdown';
import Popover from '@/components/NextUi/Popover/Popover';
import ShareButtons from '@/components/ShareButtons/ShareButtons';
import { IData } from '@/types/csl-json';

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

  const links = item?.custom?.urls;
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
      {links && Array.isArray(links) && links.length > 0 ? (
        <ButtonGroup>
          <Button
            color="secondary"
            variant="bordered"
            startContent={<FontAwesomeIcon icon={faExternalLink} />}
            as={Link}
            href={links[0]}
            target="_blank"
          >
            Open link
          </Button>
          {links.length > 1 ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  isIconOnly
                  color="secondary"
                  variant="bordered"
                  aria-label="show more links"
                >
                  <FontAwesomeIcon icon={faCaretDown} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Link locations"
                selectionMode="single"
                className="max-w-[300px]"
              >
                {links.map((link, index) => (
                  <DropdownItem
                    key={link}
                    as={Link}
                    href={link}
                    target="_blank"
                  >
                    {index + 1}. {new URL(link).hostname ?? link}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          ) : null}
        </ButtonGroup>
      ) : null}
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
