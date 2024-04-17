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
import moment from 'moment';
import Link from 'next/link';
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
} from '@/app/search/SavedSearches/actions';
import { SearchData } from '@/app/search/SavedSearches/types';
import { searchParamsSchema } from '@/app/search/searchParams/searchParams';
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
    if (confirm('Are you sure you want to delete this saved search?')) {
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
              {moment(item.created).calendar(null, {
                lastDay: '[Yesterday at] HH:mm',
                sameDay: '[Today at] HH:mm',
                nextDay: '[Tomorrow at] HH:mm',
                lastWeek: '[last] dddd [at] HH:mm',
                nextWeek: 'dddd [at] HH:mm',
                sameElse: 'L',
              })}
            </div>
          </div>
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly color="secondary" variant="light" size="sm">
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
            <DropdownMenu aria-label="Saved search item actions">
              <DropdownItem
                onPress={() => setIsEditing(true)}
                startContent={
                  <FontAwesomeIcon icon={faPen} className="text-secondary" />
                }
              >
                Edit
              </DropdownItem>
              <DropdownItem
                onPress={() => handleDelete(item.id)}
                startContent={
                  <FontAwesomeIcon icon={faTrash} className="text-secondary" />
                }
              >
                Delete
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
          placeholder="Title"
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
