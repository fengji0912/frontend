import { Button, PopoverContent } from '@nextui-org/react';
import { useQueryState } from 'nuqs';

import { excludeItemsParser } from '@/app/[locale]/search/searchParams/searchParamsParsers';

export default function HiddenPopoverContent() {
  const [excludeItems] = useQueryState('excludeItems', excludeItemsParser);

  return (
    <PopoverContent className="py-2 flex gap-2 flex-row">
      <ul>
        {excludeItems.map((item) => (
          <li
            key={item}
            className="flex gap-2 bg-secondary-50 rounded-xl min-w-[280px] w-full items-center"
          >
            <div className="grow">{item}</div>
            <Button size="sm" color="primary" className="!rounded-full">
              Revert
            </Button>
          </li>
        ))}
      </ul>
    </PopoverContent>
  );
}
