const TIMELINE_START = 9;
const TIMELINE_END = 20;

export const TIME_SLOTS: string[] = [];
for (let h = TIMELINE_START; h <= TIMELINE_END; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, '0')}:00`);
  if (h < TIMELINE_END) {
    TIME_SLOTS.push(`${String(h).padStart(2, '0')}:30`);
  }
}

export const START_TIME_OPTIONS = TIME_SLOTS.slice(0, -1);
export const END_TIME_OPTIONS = TIME_SLOTS.slice(1);

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export function isValidTimeRange(start: string, end: string): boolean {
  if (!start || !end) return false;
  return timeToMinutes(end) > timeToMinutes(start);
}

export const hasTimeConflict = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);
  return s1 < e2 && s2 < e1;
};
