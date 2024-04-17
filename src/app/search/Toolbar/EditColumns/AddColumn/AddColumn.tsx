'use client';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import useColumns from '@/app/search/Toolbar/EditColumns/hooks/useColumns';
import LoadingOverlay from '@/components/LoadingOverlay/LoadingOverlay';

export default function AddColumn() {
  const [label, setLabel] = useState('');
  const { isPending, setColumns } = useColumns();

  const handleAdd = () => {
    setColumns((items) => [...items, label]);
    setLabel('');
  };

  return (
    <li className="rounded-3xl min-w-[290px] w-full block py-1 px-2 bg-secondary-50">
      <LoadingOverlay isVisible={isPending} />

      <form action={handleAdd} className="flex items-center my-1">
        <FontAwesomeIcon icon={faPlus} className="ms-1 me-2 text-secondary" />

        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          style={{
            all: 'unset',
            width: '100%',
          }}
          placeholder="Add new column..."
        />
      </form>
    </li>
  );
}
