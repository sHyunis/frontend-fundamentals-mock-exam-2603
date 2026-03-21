import { css } from '@emotion/react';
import { Text, Select, Spacing } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface FloorSelectProps {
  label: string;
  value: number | null;
  floors: number[];
  onChange: (value: number | null) => void;
}

export function FloorSelect({ label, value, floors, onChange }: FloorSelectProps) {
  return (
    <div css={containerStyle}>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        {label}
      </Text>
      <Spacing size={6} />
      <Select
        value={value ?? ''}
        onChange={e => {
          const val = e.target.value;
          onChange(val === '' ? null : Number(val));
        }}
        aria-label={label}
      >
        <option value="">전체</option>
        {floors.map(f => (
          <option key={f} value={f}>
            {f}층
          </option>
        ))}
      </Select>
    </div>
  );
}

const containerStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
