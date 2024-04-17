import { Person } from 'csl-json';
import { KeyboardEvent, useState } from 'react';

import Input from '@/components/NextUi/Input/Input';

export default function AuthorFields({
  handleSubmit,
  defaultFirstName = '',
  defaultLastName = '',
}: {
  handleSubmit: (person: Person) => void;
  defaultFirstName?: string;
  defaultLastName?: string;
}) {
  const [firstName, setFirstName] = useState(defaultFirstName);
  const [lastName, setLastName] = useState(defaultLastName);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
      handleSubmit({ given: firstName, family: lastName });
      setFirstName('');
      setLastName('');
    }
  };
  return (
    <>
      <div className="grow">
        <Input
          type="text"
          className="me-1"
          label="First names"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          size="sm"
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="grow">
        <Input
          type="text"
          className="ms-1"
          label="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          size="sm"
          onKeyDown={handleKeyDown}
        />
      </div>
    </>
  );
}
