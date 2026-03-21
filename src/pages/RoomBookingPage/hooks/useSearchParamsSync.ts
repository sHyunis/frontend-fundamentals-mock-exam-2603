import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';
import { buildSearchParams } from '../utils/searchParams';
import type { BookingFormData } from '../types';

export function useSearchParamsSync() {
  const [, setSearchParams] = useSearchParams();

  const syncSearchParams = useCallback(
    (values: Omit<BookingFormData, 'roomId'>) => {
      setSearchParams(buildSearchParams(values), { replace: true });
    },
    [setSearchParams]
  );

  return syncSearchParams;
}
