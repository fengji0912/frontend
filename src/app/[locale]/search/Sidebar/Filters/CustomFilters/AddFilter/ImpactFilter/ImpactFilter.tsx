'use client';

import { SelectItem } from '@nextui-org/react';
import { useState } from 'react';

import Select from '@/components/NextUi/Select/Select';

export default function ImpactFilter() {
  const [field, setField] = useState('');

  return (
    <>
      <input type="hidden" name="operator" value="equals" />
      <Select
        label="Article impact level"
        selectedKeys={field ? [field] : new Set([])}
        isRequired
        onChange={(e) => setField(e.target.value)}
        name="value"
      >
        <SelectItem key="high">High</SelectItem>
        <SelectItem key="medium">Medium</SelectItem>
        <SelectItem key="low">Low</SelectItem>
      </Select>
    </>
  );
}
