'use client';

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

import useColumns from '@/app/[locale]/search/Toolbar/EditColumns/hooks/useColumns';
import ColumnItem from '@/app/[locale]/search/Toolbar/EditColumns/SortableColumns/ColumnItem/ColumnItem';
import LoadingOverlay from '@/components/LoadingOverlay/LoadingOverlay';

export default function SortableColumns() {
  const { isPending, columns, setColumns } = useColumns();
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
      setColumns((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDelete = (column: string) =>
    setColumns((_columns) => _columns.filter((c) => c !== column));

  return (
    <>
      <LoadingOverlay isVisible={isPending} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={columns} strategy={verticalListSortingStrategy}>
          {columns.map((column) => (
            <ColumnItem
              column={column}
              key={column}
              handleDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
}
