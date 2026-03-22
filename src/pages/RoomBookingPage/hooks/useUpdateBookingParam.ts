import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';
import { parseSearchParams, buildSearchParams } from '../utils/searchParams';
import type { BookingParams } from './useBookingParams';

export function useUpdateBookingParam() {
  const [searchParams, setSearchParams] = useSearchParams();

  return useCallback(
    (partial: Partial<BookingParams>) => {
      const current = parseSearchParams(searchParams);
      setSearchParams(buildSearchParams({ ...current, ...partial }), { replace: true });
    },
    [searchParams, setSearchParams]
  );
}
