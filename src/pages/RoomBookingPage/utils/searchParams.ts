import dayjs from 'dayjs';
import type { Equipment } from 'pages/remotes';

const VALID_EQUIPMENT: Equipment[] = ['tv', 'whiteboard', 'video', 'speaker'];

function isEquipment(value: string): value is Equipment {
  return (VALID_EQUIPMENT as string[]).includes(value);
}

export interface BookingParams {
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: Equipment[];
  preferredFloor: number | null;
}

export function parseSearchParams(searchParams: URLSearchParams): BookingParams {
  return {
    date: searchParams.get('date') ?? dayjs().format('YYYY-MM-DD'),
    start: searchParams.get('start') ?? searchParams.get('startTime') ?? '',
    end: searchParams.get('end') ?? searchParams.get('endTime') ?? '',
    attendees: Number(searchParams.get('attendees')) || 1,
    equipment: searchParams.get('equipment')?.split(',').filter(isEquipment) ?? [],
    preferredFloor: searchParams.get('floor') ? Number(searchParams.get('floor')) : null,
  };
}

export function buildSearchParams(data: BookingParams): Record<string, string> {
  const params: Record<string, string> = {};

  if (data.date) {
    params.date = data.date;
  }
  if (data.start) {
    params.start = data.start;
  }
  if (data.end) {
    params.end = data.end;
  }
  if (data.attendees > 1) {
    params.attendees = String(data.attendees);
  }
  if (data.equipment.length > 0) {
    params.equipment = data.equipment.join(',');
  }
  if (data.preferredFloor !== null) {
    params.floor = String(data.preferredFloor);
  }

  return params;
}
