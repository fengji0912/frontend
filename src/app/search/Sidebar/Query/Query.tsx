'use client';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';
import { useQueryState } from 'nuqs';
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from 'react';

import { queryParser } from '@/app/search/searchParams/searchParamsParsers';
import Textarea from '@/components/NextUi/Textarea/Textarea';

type QueryProps = {
  setIsOpenFilters: Dispatch<SetStateAction<boolean>>;
};

export default function Query({ setIsOpenFilters }: QueryProps) {
  const [isLoading, startTransition] = useTransition();
  const [query, setQuery] = useQueryState(
    'query',
    queryParser.withOptions({ startTransition })
  );

  const [localQuery, setLocalQuery] = useState('');

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  return (
    <div className="box-white">
      <form>
        <Textarea
          label="Search query"
          placeholder="Ask your question..."
          rows={3}
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
        />
        <div className="mt-3 flex justify-between lg:justify-end">
          <Button
            className="inline lg:hidden dark:!bg-secondary-200"
            color="secondary"
            onPress={() => setIsOpenFilters((v: boolean) => !v)}
          >
            Filters
          </Button>
          <Button
            color="primary"
            onPress={() => setQuery(localQuery)}
            isLoading={isLoading}
            startContent={<FontAwesomeIcon icon={faSearch} />}
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
}
