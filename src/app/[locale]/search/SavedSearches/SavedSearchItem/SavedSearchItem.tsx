'use client';

import {
  faCalendar,
  faEllipsisH,
  faPen,
  faSpinner,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { useFormatter, useTranslations } from 'next-intl';
import { createSerializer } from 'nuqs';
import {
  ChangeEvent,
  KeyboardEvent,
  useOptimistic,
  useState,
  useTransition,
} from 'react';

import {
  deleteSavedSearch,
  updateSavedSearch,
} from '@/app/[locale]/search/SavedSearches/actions';
import { SearchData } from '@/app/[locale]/search/SavedSearches/types';
import { searchParamsSchema } from '@/app/[locale]/search/searchParams/searchParams';
import { Link } from '@/components/Navigation/Navigation';
import Dropdown from '@/components/NextUi/Dropdown/Dropdown';
import ROUTES from '@/constants/routes';
import { SavedSearchesResponse } from '@/types/pocketbase-types';

type SavedSearchItemProps = {
  item: SavedSearchesResponse<SearchData>;
  mutate: () => void;
};

export default function SavedSearchItem({
  item,
  mutate,
}: SavedSearchItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const format = useFormatter();
  const t = useTranslations();
  const [isLoading, startTransition] = useTransition();

  const [optimisticTitle, changeOptimisticTitle] = useOptimistic(
    item.title,
    (_, newTitle: string) => newTitle
  );

  const handleSaveEdit = async (
    e: ChangeEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.currentTarget.value === item.title) {
      return setIsEditing(false);
    }
    startTransition(async () => {
      changeOptimisticTitle(e.currentTarget.value);
      await updateSavedSearch({ id: item.id, title: e.currentTarget.value });
      mutate();

      setIsEditing(false);
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('salty_calm_wolf_emerge'))) {
      startTransition(() => {
        deleteSavedSearch(id);
        mutate();
      });
    }
  };

  const serialize = createSerializer(searchParamsSchema);

  return (
    <li
      key={item.id}
      className="bg-secondary-250 rounded-2xl py-2 md:py-1 px-3 mb-1 flex justify-between items-center"
    >
      {!isEditing ? (
        <>
          <div className="md:flex justify-between w-full items-center">
            <Link href={serialize(ROUTES.SEARCH, item.searchData!)}>
              {optimisticTitle}
            </Link>
            <div className="text-secondary text-sm me-2 ml-auto shrink-0">
              <FontAwesomeIcon icon={faCalendar} />{' '}
              {format.relativeTime(new Date(item.created))}
            </div>
          </div>
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                color="secondary"
                variant="light"
                size="sm"
                aria-label={t('blue_solid_alpaca_sing')}
              >
                {!isLoading ? (
                  <FontAwesomeIcon
                    className="text-secondary text-base"
                    icon={faEllipsisH}
                  />
                ) : (
                  <FontAwesomeIcon
                    className="text-secondary text-base"
                    icon={faSpinner}
                    spin
                  />
                )}
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label={t('many_pretty_walrus_bend')}>
              <DropdownItem
                onPress={() => setIsEditing(true)}
                startContent={
                  <FontAwesomeIcon icon={faPen} className="text-secondary" />
                }
              >
                {t('dark_royal_fly_praise')}
              </DropdownItem>
              <DropdownItem
                onPress={() => handleDelete(item.id)}
                startContent={
                  <FontAwesomeIcon icon={faTrash} className="text-secondary" />
                }
              >
                {t('dizzy_hour_robin_relish')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </>
      ) : (
        <input
          type="text"
          defaultValue={optimisticTitle}
          onBlur={handleSaveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveEdit(e);
          }}
          placeholder={t('happy_tense_gibbon_breathe')}
          autoFocus
          className="!py-1 !border-2 !border-primary-500"
          style={{
            all: 'unset',
            width: '100%',
          }}
        />
      )}
    </li>
  );
}
