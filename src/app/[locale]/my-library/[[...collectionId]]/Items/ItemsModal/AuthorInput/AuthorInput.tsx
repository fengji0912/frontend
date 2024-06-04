import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';

import AuthorFields from '@/app/[locale]/my-library/[[...collectionId]]/Items/ItemsModal/AuthorInput/AuthorFields/AuthorFields';
import AuthorItem from '@/app/[locale]/my-library/[[...collectionId]]/Items/ItemsModal/AuthorInput/AuthorItem/AuthorItem';
import { Person } from '@/types/csl-json';

export default function AuthorInput({
  cslType,
  defaultValue,
}: {
  cslType: string;
  defaultValue?: Person[];
}) {
  const [authors, setAuthors] = useState<{ id: string; person: Person }[]>(
    defaultValue ? defaultValue.map((person) => ({ id: uuid(), person })) : []
  );

  const handleAdd = (person: Person) => {
    setAuthors([...authors, { id: uuid(), person }]);
  };

  const handleEdit = ({ id, person }: { id: string; person: Person }) => {
    setAuthors(
      authors.map((author) =>
        author.id === id
          ? { ...author, person: { ...author.person, ...person } }
          : author
      )
    );
  };

  const handleDelete = (id: string) =>
    setAuthors(authors.filter((author) => author.id !== id));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      setAuthors((items) => {
        const oldIndex = items.findIndex(
          (item) => item.id === (active.id as string)
        );
        const newIndex = items.findIndex(
          (item) => item.id === (over?.id as string)
        );

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="mt-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={authors} strategy={verticalListSortingStrategy}>
          {authors.map((author) => (
            <AuthorItem
              id={author.id}
              person={author.person}
              key={author.id}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          ))}
        </SortableContext>
      </DndContext>
      <div className="flex bg-secondary-200 px-2 py-1 pe-3 rounded-3xl items-center">
        <FontAwesomeIcon icon={faPlus} className="ms-2 me-2 text-secondary" />
        <AuthorFields handleSubmit={handleAdd} />
      </div>
      <input type="hidden" name={cslType} value={JSON.stringify(authors)} />
    </div>
  );
}
