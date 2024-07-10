import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { useTransition } from 'react';
import slugify from 'slugify';
import useSWR from 'swr';

import { excludeItemsParser } from '@/app/[locale]/search/searchParams/searchParamsParsers';
import Authors from '@/components/Item/Authors/Authors';
import { Link } from '@/components/Navigation/Navigation';
import ROUTES from '@/constants/routes';
import { getItem } from '@/services/backend';

type HiddenItemProps = {
  id: string;
};

export default function HiddenItem({ id }: HiddenItemProps) {
  const t = useTranslations();
  const { data, isLoading } = useSWR(`get-item-${id}`, () => getItem(id));
  const [, setExcludeItems] = useQueryState('excludeItems', excludeItemsParser);
  const [isLoadingExcludeItems, startTransition] = useTransition();

  const handleRevert = () => {
    startTransition(() => {
      setExcludeItems((prev) => prev.filter((item) => item !== id));
    });
  };

  return (
    <li className="flex gap-2 bg-secondary-50 max-w-[500px] max-w-full items-center py-2 px-3 rounded-2xl">
      <div className="grow line-clamp-2">
        {!isLoading ? (
          <>
            <Link
              href={`${ROUTES.ITEM}/${id}/${slugify(data?.title ?? '')}`}
              className="me-2 font-semibold"
            >
              {data?.title}
            </Link>
            <div className="text-secondary-800 text-[0.90em]">
              <Authors authors={data?.author} />
            </div>
          </>
        ) : (
          'Loading...'
        )}
      </div>
      <Button
        startContent={<FontAwesomeIcon icon={faRotateLeft} />}
        size="sm"
        color="primary"
        className="!rounded-full shrink-0"
        onPress={handleRevert}
        isLoading={isLoadingExcludeItems}
      >
        {t('last_quiet_hound_greet')}
      </Button>
    </li>
  );
}
