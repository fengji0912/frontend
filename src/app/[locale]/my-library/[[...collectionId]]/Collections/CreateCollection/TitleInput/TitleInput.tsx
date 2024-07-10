'use client';

import { faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import { useFormStatus } from 'react-dom';

export default function TitleInput() {
  const { pending } = useFormStatus();
  const t = useTranslations();

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
        placeholder={!pending ? t('dizzy_actual_haddock_cry') : ''}
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
