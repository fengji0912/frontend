'use client';

import useSWR from 'swr';

import { checkIfAuthenticated } from '@/components/User/actions/actions';

export default function useAuth() {
  const { data: isAuthenticated } = useSWR('checkIfAuthenticated', () =>
    checkIfAuthenticated()
  );
  return { isAuthenticated: isAuthenticated || false };
}
