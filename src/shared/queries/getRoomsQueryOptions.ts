import { queryOptions } from '@tanstack/react-query';
import { getRooms } from 'pages/remotes';

export function getRoomsQueryOptions() {
  return queryOptions({
    queryKey: ['rooms'] as const,
    queryFn: getRooms,
    staleTime: 1000 * 60 * 5,
  });
}
