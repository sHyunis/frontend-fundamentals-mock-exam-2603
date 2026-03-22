import type { Equipment, Room, Reservation } from 'pages/remotes';
import { hasTimeConflict } from './time';

export const filterByCapacity = (room: Room, attendees: number): boolean => {
  if (attendees <= 0) {
    return true;
  }
  return room.capacity >= attendees;
};

export const filterByEquipment = (room: Room, requiredEquipment: Equipment[]): boolean => {
  if (requiredEquipment.length === 0) {
    return true;
  }
  return requiredEquipment.every(eq => room.equipment.includes(eq));
};

export const filterByFloor = (room: Room, floor: number | null): boolean => {
  if (floor === null) {
    return true;
  }
  return room.floor === floor;
};

interface TimeFilterParams {
  date: string;
  start: string;
  end: string;
}

export const filterByTimeAvailability = (
  room: Room,
  reservations: Reservation[],
  params: TimeFilterParams
): boolean => {
  if (!params.start || !params.end) {
    return true;
  }
  const roomReservations = reservations.filter(
    reservation => reservation.roomId === room.id && reservation.date === params.date
  );
  return !roomReservations.some(reservation => {
    return hasTimeConflict(params.start, params.end, reservation.start, reservation.end);
  });
};

export const orderByFloorAndName = (a: Room, b: Room): number => {
  if (a.floor !== b.floor) {
    return a.floor - b.floor;
  }
  return a.name.localeCompare(b.name);
};
