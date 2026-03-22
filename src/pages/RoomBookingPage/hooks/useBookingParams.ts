import { useSearchParams } from 'react-router-dom';
import { parseSearchParams, type BookingParams } from '../utils/searchParams';

export type { BookingParams };

export function useBookingParams(): BookingParams {
  const [searchParams] = useSearchParams();
  return parseSearchParams(searchParams);
}
