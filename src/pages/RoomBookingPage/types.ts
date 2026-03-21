import type { Equipment, Room, Reservation } from 'pages/remotes';

export type { Equipment, Room, Reservation };

export interface BookingFormData {
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: Equipment[];
  preferredFloor: number | null;
  roomId: string | null;
}
