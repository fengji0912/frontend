import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';

import { excludeItemsParser } from '@/app/[locale]/search/searchParams/searchParamsParsers';
import HiddenItem from '@/app/[locale]/search/Toolbar/HiddenPopover/HiddenItem/HiddenItem';
import Popover from '@/components/NextUi/Popover/Popover';

export default function HiddenPopover() {
  const t = useTranslations();
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
            {t('stout_knotty_mule_mix')}{' '}
            {excludeItems.length > 0 ? `(${excludeItems.length})` : ''}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-4 py-3 items-start">
        {excludeItems.length > 0 ? (
          <>
            <div className="font-bold mb-2">
              {t('solid_trite_ant_treasure')}
            </div>
            <ul className="space-y-1">
              {excludeItems.map((item) => (
                <HiddenItem key={item} id={item} />
              ))}
            </ul>
          </>
        ) : (
          <div className="text-center p-3">{t('sunny_bald_rabbit_pout')}</div>
        )}
      </PopoverContent>
    </Popover>
  );
}
