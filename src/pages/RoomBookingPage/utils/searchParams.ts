import dayjs from 'dayjs';
import type { BookingFormData, Equipment } from '../types';

export function parseSearchParams(searchParams: URLSearchParams): Omit<BookingFormData, 'roomId'> {
  return {
    date: searchParams.get('date') ?? dayjs().format('YYYY-MM-DD'),
    start: searchParams.get('start') ?? searchParams.get('startTime') ?? '',
    end: searchParams.get('end') ?? searchParams.get('endTime') ?? '',
    attendees: Number(searchParams.get('attendees')) || 1,
    equipment: (searchParams.get('equipment')
      ? searchParams.get('equipment')!.split(',').filter(Boolean)
      : []) as Equipment[],
    preferredFloor: searchParams.get('floor') ? Number(searchParams.get('floor')) : null,
  };
}

export function buildSearchParams(data: Omit<BookingFormData, 'roomId'>): Record<string, string> {
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
