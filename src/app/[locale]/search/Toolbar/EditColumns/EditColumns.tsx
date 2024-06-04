'use client';

import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, PopoverContent, PopoverTrigger } from '@nextui-org/react';

import AddColumn from '@/app/[locale]/search/Toolbar/EditColumns/AddColumn/AddColumn';
import PopularColumns from '@/app/[locale]/search/Toolbar/EditColumns/PopularColumns/PopularColumns';
import SortableColumns from '@/app/[locale]/search/Toolbar/EditColumns/SortableColumns/SortableColumns';
import Popover from '@/components/NextUi/Popover/Popover';

export default function EditColumns() {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button
          id="edit-columns"
          color="primary"
          className="ms-3 min-w-12"
          startContent={<FontAwesomeIcon icon={faPen} />}
        >
          <span className="hidden md:inline">Edit columns</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="items-start px-4 py-3">
        <div className="font-bold mb-2">Selected columns</div>
        <ul className="space-y-1">
          <SortableColumns />
          <AddColumn />
        </ul>
        <PopularColumns />
      </PopoverContent>
    </Popover>
  );
}
