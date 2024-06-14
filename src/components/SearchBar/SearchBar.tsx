'use client';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useRouter } from '@/components/Navigation/Navigation';
import { MAX_QUESTION_LENGTH } from '@/constants/misc';
import ROUTES from '@/constants/routes';

export default function SearchBar() {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const t = useTranslations('SearchBar');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(ROUTES.SEARCH + '?query=' + searchValue);
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white dark:bg-secondary-950 flex items-stretch rounded-3xl shadow-box">
        <input
          type="text"
          placeholder={t('placeholder')}
          className="md:!text-2xl text-xl text-foreground grow px-4 py-3 md:py-4 rounded-3xl outline-primary-300 bg-transparent min-w-0"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          maxLength={MAX_QUESTION_LENGTH}
        />
        <Button
          type="submit"
          variant="light"
          className="border-0 px-4 rounded-3xl h-auto !hover:bg-black !hover:text-white data-[hover=true]:bg-white data-[hover=true]:opacity-60"
        >
          <FontAwesomeIcon
            icon={faSearch}
            className="text-primary"
            style={{ fontSize: '1.7rem' }}
          />
        </Button>
      </div>
    </form>
  );
}
