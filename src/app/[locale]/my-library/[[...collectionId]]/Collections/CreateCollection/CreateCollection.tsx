'use client';

import { useRef } from 'react';
import { useFormState } from 'react-dom';

import { createCollection } from '@/app/[locale]/my-library/[[...collectionId]]/Collections/actions/actions';
import TitleInput from '@/app/[locale]/my-library/[[...collectionId]]/Collections/CreateCollection/TitleInput/TitleInput';

export default function CreateCollection() {
  const ref = useRef<HTMLFormElement>(null);
  const [, formAction] = useFormState(createCollection, {
    error: '',
    success: false,
  });

  return (
    <form
      className="flex items-center"
      ref={ref}
      action={async (formData) => {
        await formAction(formData);
        ref.current?.reset();
      }}
    >
      <TitleInput />
    </form>
  );
}
