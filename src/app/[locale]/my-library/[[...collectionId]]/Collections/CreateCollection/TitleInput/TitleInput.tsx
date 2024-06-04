'use client';

import { faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormStatus } from 'react-dom';

export default function TitleInput() {
  const { pending } = useFormStatus();
  return (
    <>
      <FontAwesomeIcon
        icon={!pending ? faPlus : faSpinner}
        spin={pending}
        className="ms-3 text-secondary"
      />
      <input
        name="title"
        type="text"
        disabled={pending}
        placeholder={!pending ? 'Add new collection...' : ''}
        style={{
          all: 'unset',
          width: '100%',
          padding: '0.6rem 1rem',
        }}
        required
      />
    </>
  );
}
