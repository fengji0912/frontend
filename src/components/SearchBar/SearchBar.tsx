'use client';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import ROUTES from '@/constants/routes';

export default function SearchBar() {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(ROUTES.SEARCH + '?query=' + searchValue);
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white dark:bg-secondary-950 flex items-stretch rounded-3xl shadow-box">
        <input
          type="text"
          placeholder="Ask your question..."
          className="md:!text-2xl text-xl text-foreground grow px-4 py-3 md:py-4 rounded-3xl outline-primary-300 bg-transparent min-w-0"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
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
