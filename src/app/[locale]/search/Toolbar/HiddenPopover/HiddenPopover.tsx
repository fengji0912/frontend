import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { useQueryState } from 'nuqs';

import { excludeItemsParser } from '@/app/[locale]/search/searchParams/searchParamsParsers';
import HiddenItem from '@/app/[locale]/search/Toolbar/HiddenPopover/HiddenItem/HiddenItem';
import Popover from '@/components/NextUi/Popover/Popover';

export default function HiddenPopover() {
  const [excludeItems] = useQueryState('excludeItems', excludeItemsParser);

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button
          color="secondary"
          className="dark:!bg-secondary-200 min-w-12"
          startContent={<FontAwesomeIcon icon={faEyeSlash} />}
        >
          <span className="hidden md:inline">
            Hidden {excludeItems.length > 0 ? `(${excludeItems.length})` : ''}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-4 py-3 items-start">
        {excludeItems.length > 0 ? (
          <>
            <div className="font-bold mb-2">Hidden items</div>
            <ul className="space-y-1">
              {excludeItems.map((item) => (
                <HiddenItem key={item} id={item} />
              ))}
            </ul>
          </>
        ) : (
          <div className="text-center p-3">
            You didn&apos;t hide any search results yet
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
