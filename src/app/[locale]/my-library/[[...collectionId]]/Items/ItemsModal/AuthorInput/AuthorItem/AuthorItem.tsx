'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  faBars,
  faEllipsisH,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import AuthorFields from '@/app/[locale]/my-library/[[...collectionId]]/Items/ItemsModal/AuthorInput/AuthorFields/AuthorFields';
import Dropdown from '@/components/NextUi/Dropdown/Dropdown';
import { Person } from '@/types/csl-json';

export default function AuthorItem({
  id,
  person,
  handleDelete,
  handleEdit,
}: {
  id: string;
  person: Person;
  handleDelete: (id: string) => void;
  handleEdit: ({ id, person }: { id: string; person: Person }) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const t = useTranslations();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'default',
    display: 'flex',
    alignItems: 'center',
  };

  const handleSubmit = (person: Person) => {
    handleEdit({ id, person });
    setIsEditing(false);
  };

  return (
    <li
      className="flex bg-secondary-200 px-2 py-[2px] rounded-3xl mb-1 text-sm"
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className="grow flex items-center">
        <FontAwesomeIcon
          {...listeners}
          icon={faBars}
          className="ms-1 me-2 text-secondary"
          style={{ cursor: 'move' }}
        />
        {!isEditing ? (
          person.given || person.family ? (
            `${person.given} ${person.family}`
          ) : (
            person.literal
          )
        ) : (
          <AuthorFields
            handleSubmit={handleSubmit}
            defaultFirstName={person.given ?? person.literal}
            defaultLastName={person.family ?? ''}
          />
        )}
      </div>
      {!isEditing && (
        <Dropdown>
          <DropdownTrigger>
            <Button
              isIconOnly
              color="secondary"
              variant="light"
              size="sm"
              aria-label={t('aware_just_pig_savor')}
            >
              <FontAwesomeIcon
                className="text-secondary text-base"
                icon={faEllipsisH}
              />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label={t('extra_major_seahorse_heal')}>
            <DropdownItem
              onPress={() => setIsEditing(true)}
              startContent={
                <FontAwesomeIcon icon={faPen} className="text-secondary" />
              }
            >
              {t('gaudy_tough_myna_scold')}
            </DropdownItem>
            <DropdownItem
              onPress={() => handleDelete(id)}
              startContent={
                <FontAwesomeIcon icon={faTrash} className="text-secondary" />
              }
            >
              {t('many_honest_jan_explore')}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </li>
  );
}
