const TIMELINE_START = 9;
const TIMELINE_END = 20;
export const TOTAL_MINUTES = (TIMELINE_END - TIMELINE_START) * 60;

export const TIME_SLOTS: string[] = [];
for (let hour = TIMELINE_START; hour <= TIMELINE_END; hour++) {
  TIME_SLOTS.push(`${String(hour).padStart(2, '0')}:00`);
  if (hour < TIMELINE_END) {
    TIME_SLOTS.push(`${String(hour).padStart(2, '0')}:30`);
  }
}

export const HOUR_LABELS = TIME_SLOTS.filter((time) => {
  return time.endsWith(':00');
});

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours - TIMELINE_START) * 60 + minutes;
}

export function calculateBlockPosition(start: string, end: string): { left: number; width: number } {
  const leftPercent = (timeToMinutes(start) / TOTAL_MINUTES) * 100;
  const widthPercent = ((timeToMinutes(end) - timeToMinutes(start)) / TOTAL_MINUTES) * 100;
  return { left: leftPercent, width: widthPercent };
}
