'use client';

import { Button, SelectItem } from '@nextui-org/react';
import { useQueryState } from 'nuqs';
import { useId, useRef, useState } from 'react';

import {
  FilterOperator,
  filterParser,
} from '@/app/search/searchParams/searchParamsParsers';
import {
  FILTER_FIELDS,
  FILTER_OPERATORS,
} from '@/app/search/Sidebar/Filters/CustomFilters/CustomFilters';
import FilterItem from '@/app/search/Sidebar/Filters/FilterItem/FilterItem';
import Input from '@/components/NextUi/Input/Input';
import Select from '@/components/NextUi/Select/Select';

export default function AddFilter() {
  const [field, setField] = useState('');
  const [, setFilter] = useQueryState('filter', filterParser);
  const ref = useRef<HTMLFormElement>(null);
  const labelId = useId();

  return (
    <FilterItem label="Add filter...">
      <form
        ref={ref}
        action={async (formData) => {
          setFilter((prevFilter) => [
            ...prevFilter,
            {
              field,
              operator: formData.get('operator') as FilterOperator,
              value: formData.get('value') as string,
            },
          ]);
          setField(''); // form reset doesn't work with NextUI Select, so make it a controlled component
          ref.current?.reset();
        }}
      >
        <div className="space-y-3">
          <Select
            label="Field"
            selectedKeys={field ? [field] : new Set([])}
            isRequired
            onChange={(e) => setField(e.target.value)}
          >
            {FILTER_FIELDS.map((field) => (
              <SelectItem key={field.value} value={field.value}>
                {field.label}
              </SelectItem>
            ))}
          </Select>
          <div>
            <Input
              type="text"
              placeholder="Filter value"
              isRequired
              name="value"
              startContent={
                <div className="flex items-center">
                  <label className="sr-only" htmlFor={labelId}>
                    Filter operator
                  </label>
                  <select
                    className="outline-none border-0 bg-transparent text-small"
                    id={labelId}
                    name="operator"
                  >
                    {FILTER_OPERATORS.filter((operator) => operator.label).map(
                      (operator) => (
                        <option value={operator.value} key={operator.label}>
                          {operator.label}
                        </option>
                      )
                    )}
                  </select>
                </div>
              }
            />
          </div>
          <div className="flex justify-end">
            <Button color="primary" type="submit">
              Add
            </Button>
          </div>
        </div>
      </form>
    </FilterItem>
  );
}
