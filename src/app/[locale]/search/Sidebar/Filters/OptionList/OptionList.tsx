'use client';

import { sortBy } from 'lodash';
import { useState } from 'react';

import Checkbox from '@/components/NextUi/Checkbox/Checkbox';
import Input from '@/components/NextUi/Input/Input';

interface OptionListProps {
  options: { [key: string]: string };
  isVisibleSearch?: boolean;
  onChange?: (selectedItem: string) => void;
  selectedItems?: string[];
}

export default function OptionList({
  options,
  isVisibleSearch = true,
  selectedItems = [],
  onChange = () => {},
}: OptionListProps) {
  const [searchValue, setSearchValue] = useState('');
  const [sortedOptions, setSortedOptions] = useState<[string, string][]>([]);

  const filteredOptions = searchValue
    ? Object.entries(options).filter(([, value]) =>
        value.toLowerCase().includes(searchValue.toLowerCase())
      )
    : [];

  if (sortedOptions.length === 0) {
    setSortedOptions(
      sortBy(Object.entries(options), (a) => !selectedItems.includes(a[0]))
    );
  }

  return (
    <>
      {isVisibleSearch && (
        <Input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          size="sm"
          className="mb-3"
          isClearable
          onClear={() => setSearchValue('')}
        />
      )}
      <div
        className="overflow-y-auto px-1 mt-2"
        style={{ maxHeight: 200, fontSize: '90%' }}
      >
        <ul className="p-0">
          {(filteredOptions.length > 0 ? filteredOptions : sortedOptions).map(
            ([key, value], i) => (
              <li key={key ?? i}>
                <label className="flex">
                  <Checkbox
                    isSelected={selectedItems.includes(key)}
                    onValueChange={() => onChange(key)}
                    className="p-0 m-0"
                  />
                  <span>
                    {value || <span className="italic">No label</span>}
                  </span>
                </label>
              </li>
            )
          )}
        </ul>
      </div>
    </>
  );
}
