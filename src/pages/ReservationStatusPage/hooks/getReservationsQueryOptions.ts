import { queryOptions } from '@tanstack/react-query';
import { getReservations } from 'pages/remotes';

export function getReservationsQueryOptions(date: string) {
  return queryOptions({
    queryKey: ['reservations', date] as const,
    queryFn: () => getReservations(date),
    enabled: !!date,
  });
}
