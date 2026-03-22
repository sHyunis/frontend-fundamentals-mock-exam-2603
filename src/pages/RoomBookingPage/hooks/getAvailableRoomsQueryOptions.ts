import { queryOptions } from '@tanstack/react-query';
import { getRooms, getReservations } from 'pages/remotes';
import type { Equipment } from 'pages/remotes';
import {
  filterByCapacity,
  filterByEquipment,
  filterByFloor,
  filterByTimeAvailability,
  orderByFloorAndName,
} from '../utils/filter';

interface FilterParams {
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: Equipment[];
  preferredFloor: number | null;
}

export function getAvailableRoomsQueryOptions(params: FilterParams) {
  const { date, start, end, attendees, equipment, preferredFloor } = params;

  return queryOptions({
    queryKey: ['availableRooms', date, { start, end, attendees, equipment, preferredFloor }] as const,
    queryFn: async () => {
      const [rooms, reservations] = await Promise.all([getRooms(), getReservations(date)]);
      return { rooms, reservations };
    },
    select: data => {
      return data.rooms
        .filter(room => filterByCapacity(room, attendees))
        .filter(room => filterByEquipment(room, equipment))
        .filter(room => filterByFloor(room, preferredFloor))
        .filter(room => filterByTimeAvailability(room, data.reservations, { date, start, end }))
        .sort(orderByFloorAndName);
    },
  });
}
