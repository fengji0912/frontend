'use client';

import { Button } from '@nextui-org/react';
import { useQueryState } from 'nuqs';
import { useTransition } from 'react';

import { filterParser } from '@/app/search/searchParams/searchParamsParsers';
import OptionList from '@/app/search/Sidebar/Filters/OptionList/OptionList';
import LoadingOverlay from '@/components/LoadingOverlay/LoadingOverlay';

type ListFilterProps = {
  listItems: { [key: string]: string };
  type: string;
};

export default function ListFilter({ listItems, type }: ListFilterProps) {
  const [isLoading, startTransition] = useTransition();
  const [filter, setFilter] = useQueryState('filter', filterParser);

  const handleChange = (author: string) => {
    startTransition(() => {
      setFilter((prevValue) => {
        const listFilter = prevValue.find((f) => f.field === type);

        if (listFilter) {
          const listFilterValue = listFilter.value as string[];
          if (listFilterValue.includes(author)) {
            return [
              ...prevValue.filter((f) => f.field !== type),
              {
                field: type,
                operator: 'inList',
                value: listFilterValue.filter((a) => a !== author),
              },
            ];
          } else {
            return [
              ...prevValue.filter((f) => f.field !== type),
              {
                field: type,
                operator: 'inList',
                value: [author, ...listFilterValue],
              },
            ];
          }
        } else {
          return [
            ...prevValue,
            { field: type, operator: 'inList', value: [author] },
          ];
        }
      });
    });
  };

  const handleReset = () => {
    startTransition(() => {
      setFilter((prevValue) => prevValue.filter((f) => f.field !== type));
    });
  };

  return (
    <>
      <OptionList
        options={listItems}
        selectedItems={
          (filter.find((f) => f.field === type)?.value as string[]) ?? []
        }
        onChange={handleChange}
      />
      <div className="mt-2">
        <Button
          color="secondary"
          variant="bordered"
          className="me-2"
          isDisabled={filter.filter((f) => f.field === type).length === 0}
          onPress={handleReset}
          size="sm"
        >
          Reset
        </Button>
      </div>
      <LoadingOverlay isVisible={isLoading} />
    </>
  );
}
