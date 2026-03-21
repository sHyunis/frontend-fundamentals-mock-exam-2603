import { forwardRef } from 'react';
import { css } from '@emotion/react';
import { Text, Spacing } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface AttendeesInputProps {
  label: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
}

export const AttendeesInput = forwardRef<HTMLInputElement, AttendeesInputProps>(
  ({ label, onChange, onBlur, name }, ref) => {
    return (
      <div css={containerStyle}>
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
          {label}
        </Text>
        <Spacing size={6} />
        <input
          ref={ref}
          type="number"
          name={name}
          min={1}
          onChange={onChange}
          onBlur={onBlur}
          aria-label={label}
          css={inputStyle}
        />
      </div>
    );
  }
);

const containerStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const inputStyle = css`
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  height: 48px;
  background-color: ${colors.grey50};
  border-radius: 12px;
  color: ${colors.grey800};
  width: 100%;
  border: 1px solid ${colors.grey200};
  padding: 0 16px;
  outline: none;
  transition: border-color 0.15s;
  &:focus {
    border-color: ${colors.blue500};
  }
`;
