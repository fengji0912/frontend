'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';

export default function ColumnItem({
  column,
  handleDelete,
}: {
  column: string;
  handleDelete: (column: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'default',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <li
      className="rounded-3xl min-w-[290px] w-full block px-[8px] py-[3px] bg-secondary-50"
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
        {column}
      </div>
      <Button
        isIconOnly
        variant="light"
        color="secondary"
        size="sm"
        className="py-0 px-1 lh-1"
        onPress={() => handleDelete(column)}
        isDisabled={column === 'Answer'}
      >
        <FontAwesomeIcon icon={faTimes} className="text-secondary" size="lg" />
      </Button>
    </li>
  );
}
