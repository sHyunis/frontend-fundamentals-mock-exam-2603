import { css } from '@emotion/react';
import { Text, Spacing } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import type { Equipment } from 'pages/remotes';
import { ALL_EQUIPMENT, EQUIPMENT_LABELS } from '../utils/equipment';

interface EquipmentSelectorProps {
  label: string;
  value: Equipment[];
  onChange: (value: Equipment[]) => void;
}

export function EquipmentSelector({ label, value, onChange }: EquipmentSelectorProps) {
  return (
    <div>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        {label}
      </Text>
      <Spacing size={8} />
      <div css={buttonContainerStyle}>
        {ALL_EQUIPMENT.map(eq => {
          const selected = value.includes(eq);
          return (
            <button
              key={eq}
              type="button"
              onClick={() => {
                const next = selected ? value.filter(e => e !== eq) : [...value, eq];
                onChange(next);
              }}
              aria-label={EQUIPMENT_LABELS[eq]}
              aria-pressed={selected}
              css={buttonStyle(selected)}
            >
              {EQUIPMENT_LABELS[eq]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const buttonContainerStyle = css`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const buttonStyle = (selected: boolean) => css`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid ${selected ? colors.blue500 : colors.grey200};
  background: ${selected ? colors.blue50 : colors.grey50};
  color: ${selected ? colors.blue600 : colors.grey700};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    border-color: ${selected ? colors.blue500 : colors.grey400};
  }
`;
