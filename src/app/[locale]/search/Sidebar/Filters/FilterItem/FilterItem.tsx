'use client';

import { useState } from 'react';

import Collapsible from '@/app/[locale]/search/Sidebar/Filters/Collapsable/Collapsable';

type FilterItemProps = {
  label: string;
  children: React.ReactNode;
};

export default function FilterItem({ label, children }: FilterItemProps) {
  const [isExpended, setIsExpended] = useState(false);

  return (
    <div className="px-3 border-t-2 border-t-secondary-100">
      <div
        className="py-3 font-bold"
        style={{ cursor: 'pointer' }}
        onClick={() => setIsExpended((v) => !v)}
      >
        {label}
      </div>
      <Collapsible isExpanded={isExpended}>
        <div className="pb-2">{children}</div>
      </Collapsible>
    </div>
  );
}
