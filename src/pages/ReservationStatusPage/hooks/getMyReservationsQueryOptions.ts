import { queryOptions } from '@tanstack/react-query';
import { getMyReservations } from 'pages/remotes';

export function getMyReservationsQueryOptions() {
  return queryOptions({
    queryKey: ['myReservations'] as const,
    queryFn: getMyReservations,
  });
}
