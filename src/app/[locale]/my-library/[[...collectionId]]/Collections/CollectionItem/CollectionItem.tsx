'use client';

import {
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
import {
  ChangeEvent,
  KeyboardEvent,
  useOptimistic,
  useState,
  useTransition,
} from 'react';

import {
  deleteCollection,
  updateCollection,
} from '@/app/[locale]/my-library/[[...collectionId]]/Collections/actions/actions';
import { Link } from '@/components/Navigation/Navigation';
import Dropdown from '@/components/NextUi/Dropdown/Dropdown';
import ROUTES from '@/constants/routes';
import { CollectionsResponse } from '@/types/pocketbase-types';

export default function CollectionItem({
  item,
  isActive,
}: {
  item: CollectionsResponse;
  isActive: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, startTransition] = useTransition();

  const handleDelete = async () => {
    // if items is 0, ignore confirmation
    if (confirm('Are you sure you want to delete this collection?')) {
      startTransition(() => {
        deleteCollection(item.id);
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

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
      await updateCollection({ id: item.id, title: e.currentTarget.value });
      setIsEditing(false);
    });
  };

  return (
    <li>
      <div
        className={`px-3 py-1 flex justify-between items-center ${
          isEditing ? 'bg-secondary-50' : ''
        } ${isActive ? 'bg-secondary-50' : ''}`}
      >
        {!isEditing ? (
          <>
            <Link
              href={`${ROUTES.MY_LIBRARY}/${encodeURIComponent(item.id)}`}
              className="text-inherit text-truncate"
            >
              {optimisticTitle}
            </Link>
            <Dropdown isDisabled={isEditing || isLoading}>
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
              <DropdownMenu>
                <DropdownItem onPress={handleEdit}>
                  <FontAwesomeIcon
                    icon={faPen}
                    className="text-secondary me-2"
                  />
                  Edit
                </DropdownItem>
                <DropdownItem onPress={handleDelete}>
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-secondary me-2"
                  />
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
            className="!py-1"
            style={{
              all: 'unset',
              width: '100%',
            }}
          />
        )}
      </div>
    </li>
  );
}
