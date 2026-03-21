const TIMELINE_START = 9;
const TIMELINE_END = 20;
export const TOTAL_MINUTES = (TIMELINE_END - TIMELINE_START) * 60;

export const TIME_SLOTS: string[] = [];
for (let h = TIMELINE_START; h <= TIMELINE_END; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, '0')}:00`);
  if (h < TIMELINE_END) {
    TIME_SLOTS.push(`${String(h).padStart(2, '0')}:30`);
  }
}

export const HOUR_LABELS = TIME_SLOTS.filter((t) => {
  return t.endsWith(':00');
});

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h - TIMELINE_START) * 60 + m;
}

export function calculateBlockPosition(start: string, end: string): { left: number; width: number } {
  const left = (timeToMinutes(start) / TOTAL_MINUTES) * 100;
  const width = ((timeToMinutes(end) - timeToMinutes(start)) / TOTAL_MINUTES) * 100;
  return { left, width };
}
