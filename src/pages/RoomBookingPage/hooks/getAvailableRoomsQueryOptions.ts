import { queryOptions } from '@tanstack/react-query';
import { getRooms, getReservations } from 'pages/remotes';
import type { Room, Reservation } from '../types';
import { orderByFloorAndName } from '../utils/filter';

export type FilterRoom = (room: Room) => boolean;
export type FilterTimeAvailability = (room: Room, reservations: Reservation[]) => boolean;

interface Options {
  date: string;
  filters?: FilterRoom[];
  timeFilter?: FilterTimeAvailability;
}

export function getAvailableRoomsQueryOptions({ date, filters, timeFilter }: Options) {
  return queryOptions({
    queryKey: ['availableRooms', date] as const,
    queryFn: async () => {
      const [rooms, reservations] = await Promise.all([
        getRooms(),
        getReservations(date),
      ]);
      return { rooms, reservations };
    },
    enabled: !!date,
    select: (data) => {
      let filtered = data.rooms.filter((room) => {
        return filters?.every((filter) => filter(room)) ?? true;
      });

      if (timeFilter) {
        filtered = filtered.filter((room) => timeFilter(room, data.reservations));
      }

      return filtered.sort(orderByFloorAndName);
    },
  });
}
