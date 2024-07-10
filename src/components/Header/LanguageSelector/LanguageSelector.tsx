import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';

import useLanguages from '@/app/[locale]/search/Sidebar/Filters/helpers/useLanguages';
import { Link, usePathname } from '@/components/Navigation/Navigation';
import Dropdown from '@/components/NextUi/Dropdown/Dropdown';
import languages from '@/constants/locales';

export default function LanguageSelector() {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { LANGUAGES } = useLanguages();

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button color="secondary" variant="flat">
          <FontAwesomeIcon icon={faGlobe} /> {LANGUAGES[locale]}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        {languages.map((language) => (
          <DropdownItem
            key={language}
            as={Link}
            href={`${pathname}${
              searchParams.size > 0 ? `?${searchParams}` : ''
            }`}
            // @ts-expect-error the type of Link is not correctly inferred for some reason in NextUI
            locale={language}
          >
            {LANGUAGES[language]}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
