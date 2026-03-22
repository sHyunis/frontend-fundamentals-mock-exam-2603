import { useSearchParams } from 'react-router-dom';
import { parseSearchParams } from '../utils/searchParams';

export type BookingParams = ReturnType<typeof parseSearchParams>;

export function useBookingParams(): BookingParams {
  const [searchParams] = useSearchParams();
  return parseSearchParams(searchParams);
}
