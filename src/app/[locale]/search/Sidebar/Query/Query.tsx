'use client';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from 'react';

import { queryParser } from '@/app/[locale]/search/searchParams/searchParamsParsers';
import Textarea from '@/components/NextUi/Textarea/Textarea';
import { MAX_QUESTION_LENGTH } from '@/constants/misc';
import REGEX from '@/constants/regex';

type QueryProps = {
  setIsOpenFilters: Dispatch<SetStateAction<boolean>>;
};

export default function Query({ setIsOpenFilters }: QueryProps) {
  const t = useTranslations();
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
          label={t('still_major_macaw_spur')}
          placeholder={t('low_key_sheep_cure')}
          rows={3}
          value={localQuery}
          onChange={(e) =>
            setLocalQuery(e.target.value.replace(REGEX.LINE_BREAKS, ''))
          }
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              setQuery(e.currentTarget.value);
            }
          }}
          maxLength={MAX_QUESTION_LENGTH}
        />
        <div className="mt-3 flex justify-between lg:justify-end">
          <Button
            className="inline lg:hidden dark:!bg-secondary-200"
            color="secondary"
            onPress={() => setIsOpenFilters((v: boolean) => !v)}
          >
            {t('stout_proof_thrush_earn')}
          </Button>
          <Button
            color="primary"
            onPress={() => setQuery(localQuery)}
            isLoading={isLoading}
            startContent={<FontAwesomeIcon icon={faSearch} />}
          >
            {t('long_tame_turkey_rise')}
          </Button>
        </div>
      </form>
    </div>
  );
}
