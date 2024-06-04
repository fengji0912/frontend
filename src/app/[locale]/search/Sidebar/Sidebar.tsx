'use client';

import { useState } from 'react';
import { useMedia } from 'react-use';
import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '@/../tailwind.config.js';
import Collapsible from '@/app/[locale]/search/Sidebar/Filters/Collapsable/Collapsable';
import Filters from '@/app/[locale]/search/Sidebar/Filters/Filters';
import Query from '@/app/[locale]/search/Sidebar/Query/Query';
import SupportingOrganizations from '@/app/[locale]/search/Sidebar/SupportingOrganizations/SupportingOrganizations';
import LogoCarousel from '@/components/LogoCarousel/LogoCarousel';

export default function Sidebar() {
  const fullConfig = resolveConfig(tailwindConfig);
  const [isOpenFilters, setIsOpenFilters] = useState(false);
  const isWide = useMedia(`(min-width: ${fullConfig.theme.screens.lg})`);

  return (
    <div className="w-full shrink-0 lg:max-w-[330px] mb-4 lg:mb-0">
      <Query setIsOpenFilters={setIsOpenFilters} />
      <SupportingOrganizations />
      <Collapsible isExpanded={isOpenFilters || isWide}>
        <Filters />
      </Collapsible>
      <div className="box mt-5 text-center hidden lg:block">
        <LogoCarousel />
      </div>
    </div>
  );
}
