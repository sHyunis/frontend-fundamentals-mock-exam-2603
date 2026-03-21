import type { Equipment } from 'pages/remotes';

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  tv: 'TV',
  whiteboard: '화이트보드',
  video: '화상장비',
  speaker: '스피커',
};

export const ALL_EQUIPMENT: Equipment[] = ['tv', 'whiteboard', 'video', 'speaker'];

export function getEquipmentLabels(equipment: Equipment[]): string {
  if (equipment.length === 0) {
    return '장비 없음';
  }
  return equipment
    .map(item => {
      return EQUIPMENT_LABELS[item];
    })
    .join(', ');
}
