import { forwardRef } from 'react';
import { css } from '@emotion/react';
import { Text, Spacing } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface TimeSelectProps {
  label: string;
  options: string[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  name?: string;
}

export const TimeSelect = forwardRef<HTMLSelectElement, TimeSelectProps>(
  ({ label, options, value, onChange, onBlur, name }, ref) => {
    return (
      <div css={containerStyle}>
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
          {label}
        </Text>
        <Spacing size={6} />
        <select ref={ref} name={name} value={value} onChange={onChange} onBlur={onBlur} aria-label={label} css={selectStyle}>
          <option value="">선택</option>
          {options.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

const selectStyle = css`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  height: 52px;
  transition: background-color 0.2s ease;
  background-color: ${colors.grey50};
  border-radius: 14px;
  align-items: center;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.02);
  color: ${colors.grey800};
  width: 100%;
  margin: 0;
  border: 0 solid transparent;
  padding: 0;
  outline: none;
  appearance: none;
  padding: 0 24px 0 16px;
`;

const containerStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
